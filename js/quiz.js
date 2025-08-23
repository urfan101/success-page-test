
document.querySelector(".quiz").addEventListener("submit", function (e) {
    e.preventDefault();

    $('#form-send-successfully-popup').fadeIn();

    $(".quiz__final__btn__text").hide();
    $(".btn__load").show();
    $(".btn.quiz__final__btn").prop("disabled", true).addClass("loading");

    var form = new FormData(this);

    setTimeout(() => {
        e.preventDefault();

        let message = "Заявка из квиза:\n";
        form.forEach((value, key) => {
            if (['Тип', 'Площадь', 'Допы', 'Когда', 'Бюджет', 'Бюджет', 'Куда', 'Номер'].includes(key)) {
                message += `${key}: ${value}\n`;
            }
        });
        
        console.log(message)

        fetch('/api/send-telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({mode: 0, message: message})
        })
        .then(response => {
            if (!response.ok) throw new Error('Ошибка сервера: ' + response.status);
            setTimeout(()=>{$(".btn__load").hide();$(".quiz__final__btn__text").show();}, 1000)
            return response.json();
        })
        .then(data => {
            if (data.success) {
                console.log("Сообщение успешно отправлено");
                window.location = "../public/success-page.html";
            } else {
                $(".btn__load").hide();
                $(".quiz__final__btn__text").show();
                throw new Error(data.error || 'Неизвестная ошибка');
            }
        })
        .catch(error => {
            console.error("Ошибка отправки в Telegram:", error);
            $(".btn.quiz__final__btn").removeClass("loading");
            setTimeout(()=>{$(".btn__load").hide();$(".quiz__final__btn__text").show();}, 1000)
            $(".btn.quiz__final__btn").prop("disabled", false);
        });
    });
    });