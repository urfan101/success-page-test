<?php
// Включаем отображение ошибок для отладки (удалите в продакшене)
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

// Загрузка переменных окружения из .env
if (file_exists(__DIR__ . '/.env')) {
    $env = parse_ini_file(__DIR__ . '/.env');
    $TELEGRAM_BOT_TOKEN = $env['TELEGRAM_BOT_TOKEN'] ?? '';
    $CHAT_ID = $env['CHAT_ID'] ?? '';
} else {
    error_log('ОШИБКА: Файл .env не найден');
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Серверная ошибка: отсутствует конфигурация']);
    exit;
}

if (empty($TELEGRAM_BOT_TOKEN)) {
    error_log('ОШИБКА: Отсутствует TELEGRAM_BOT_TOKEN');
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Серверная ошибка: отсутствует токен']);
    exit;
}

if (empty($CHAT_ID)) {
    error_log('ОШИБКА: Отсутствует CHAT_ID');
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Серверная ошибка: отсутствует ID чата']);
    exit;
}

$request_method = $_SERVER['REQUEST_METHOD'];
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($request_method === 'POST' && $request_uri === '/api/send-telegram') {
    header('Content-Type: application/json');

    $input = json_decode(file_get_contents('php://input'), true);

    $phone = $input['phone'] ?? '';

    if (isset($input['mode']) && $input['mode'] == 0) {
        $message = $input["message"];
    } elseif (isset($input['mode']) && $input['mode'] == 1){
        if (!$input || !isset($input['phone'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Неверный формат данных']);
            exit;
        }
        $message = "*Заявка на звонок*\n" .
                "Номер: $phone";
    } else {
        if (!$input || !isset($input['phone'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Неверный формат данных']);
            exit;
        }
        $area = $input['area'] ?? 0;
        $months = $input['months'] ?? 0;
        $totalPrice = $input['totalPrice'] ?? 0;
        $initialPayment = $input['initialPayment'] ?? 0;
        $monthlyPayment = $input['monthlyPayment'] ?? 0;

        $formatPrice = function($price) {
            return number_format(round($price), 0, '.', ' ');
        };

        $message = "*Заявка на рассрочку*\n\n" .
               "📏 Площадь: $area м²\n" .
               "⏱️ Срок: $months месяцев\n" .
               "💰 Стоимость дома: " . $formatPrice($totalPrice) . " ₽\n" .
               "💸 Первон. взнос: " . $formatPrice($initialPayment) . " ₽\n" .
               "📅 Платеж в мес.: " . $formatPrice($monthlyPayment) . " ₽\n" .
               "📞 Номер: $phone";
    }

    /* EnvyCRM */
    $envyUrl = parse_url($_SERVER['HTTP_REFERER']);
    if (isset ($envyUrl['query'])) {
        parse_str($envyUrl['query'], $get_array_envy);
    }
    $linkEnvyCrm = 'https://envycrm.com/crm/api/v1/lead/workset/?api_key=e653a913d70bbc6a87cd65f14b86b01259c6ec34';
    $dataEnvyCrm = [
        'method' => 'create',
        'inbox_type_id' => 1485528,
        'visit_id' => $_COOKIE['WhiteCallback_visit'],
        'values' => [
            'name' => '',
            'phone' => $phone,
            'email' => '',
            'comment' => '',
            'utm_source' => isset($get_array_envy) ? $get_array_envy['utm_source'] : '',
            'utm_medium' => isset($get_array_envy) ? $get_array_envy['utm_medium'] : '',
            'utm_campaign' => isset($get_array_envy) ? $get_array_envy['utm_campaign'] : '',
            'utm_content' => isset($get_array_envy) ? $get_array_envy['utm_content'] : '',
            'utm_term' => isset($get_array_envy) ? $get_array_envy['utm_term'] : ''
        ]
    ];
    
    $dataEnvyCrm['values']['comment'] = $message;
    if (preg_match('/Номер:\s*(\+?[0-9()\s-]+)/', $message, $matches) and $input['mode'] == 0) {
        $dataEnvyCrm['values']['phone'] = trim($matches[1]);
    }

    $curl = curl_init();

    curl_setopt_array($curl, [
      CURLOPT_URL => $linkEnvyCrm,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => '',
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 30,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => 'POST',
      CURLOPT_POSTFIELDS => json_encode(['request' => $dataEnvyCrm]),
      CURLOPT_HTTPHEADER => array(
        'Content-Type: application/json'
      ),
    ]);

    $responseEnvyCrm = curl_exec($curl);
    curl_close($curl);
    /* EnvyCRM */

    $send_url = "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage";
    $data = [
        'chat_id' => $CHAT_ID,
        'text' => $message,
        'parse_mode' => 'Markdown'
    ];

    $options = [
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => http_build_query($data)
        ]
    ];

    $context = stream_context_create($options);
    $response = @file_get_contents($send_url, false, $context); // @ для подавления предупреждений

    if ($response === false) {
        /*error_log('ОШИБКА: Не удалось отправить запрос в Telegram');*/
        http_response_code(200);
        echo json_encode(['success' => true]);
        exit;
    }

    $result = json_decode($response, true);
    if ($result && isset($result['ok']) && $result['ok']) {
        error_log("Сообщение успешно отправлено в Telegram. Телефон: $phone, chat_id: $CHAT_ID");
        echo json_encode(['success' => true]);
    } else {
        $error = $result['description'] ?? 'Неизвестная ошибка Telegram';
        error_log("ОШИБКА: $error");
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $error]);
    }
    exit;
}

// Отдаём index.html для корневого запроса
if ($request_uri === '/' && file_exists(__DIR__ . '/public/index.html')) {
    readfile('public/index.html');
} else {
    http_response_code(404);
    echo '404 Not Found';
}
