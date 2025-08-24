        const PRICE_PER_SQM = 40000;

        const areaInput = document.getElementById('area');
        const areaValue = document.getElementById('area-value');
        const monthsInput = document.getElementById('months');
        const monthsValue = document.getElementById('months-value');
        const totalPriceElement = document.getElementById('total-price');
        const initialPaymentElement = document.getElementById('initial-payment');
        const monthlyPaymentElement = document.getElementById('monthly-payment');
        const createApplicationButton = document.getElementById('create-application');
        const modal = document.getElementById('modal');
        const closeModalButton = document.getElementById('close-modal');
        const phoneInput = document.getElementById('phone');
        const phoneError = document.getElementById('phone-error');
        const sendForm = document.getElementById('send-form');
        const submitButton = document.getElementById('submit-button');
        const applicationForm = document.getElementById('application-form');
        const successMessage = document.getElementById('success-message');
        const inputMortgage = document.getElementById("input-mortgage");
        const buttonMortgage = document.getElementById("button-mortgage");
        const textErrorMortgage = document.getElementById("text-error-mortgage");
        const quizInput = document.getElementById("inp-phone");

        let area = parseInt(areaInput.value);
        let months = parseInt(monthsInput.value);

        function formatPrice(price) {
            return new Intl.NumberFormat('ru-RU').format(Math.round(price)) + ' ₽';
        }

        function calculateValues() {
            const totalPrice = area * PRICE_PER_SQM;
            const initialPayment = totalPrice * 0.5;
            const monthlyPayment = (totalPrice - initialPayment) / months;

            totalPriceElement.textContent = formatPrice(totalPrice);
            initialPaymentElement.textContent = formatPrice(initialPayment);
            monthlyPaymentElement.textContent = formatPrice(monthlyPayment);
        }

        areaInput.addEventListener('input', function() {
            area = parseInt(this.value);
            areaValue.textContent = area;
            calculateValues();
        });

        monthsInput.addEventListener('input', function() {
            months = parseInt(this.value);
            monthsValue.textContent = months;
            calculateValues();
        });

        createApplicationButton.addEventListener('click', function() {
            modal.classList.add('active');
        });

        closeModalButton.addEventListener('click', function() {
            modal.classList.remove('active');
            modal.style.display = "none"
            applicationForm.style.display = 'none';
            successMessage.style.display = 'none';
            phoneInput.value = '';
            phoneError.textContent = '';
            submitButton.disabled = false;
            submitButton.textContent = 'Отправить заявку';
        });

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                applicationForm.style.display = 'block';
                successMessage.style.display = 'none';
                phoneInput.value = '';
                phoneError.textContent = '';
                submitButton.disabled = false;
                submitButton.textContent = 'Отправить заявку';
            }
        });

        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0 && value[0] !== '7') value = '7' + value;
            let formattedValue = value.length > 0 ? '+' + value[0] : '';
            if (value.length > 1) formattedValue += ' (' + value.substring(1, 4);
            if (value.length > 4) formattedValue += ') ' + value.substring(4, 7);
            if (value.length > 7) formattedValue += '-' + value.substring(7, 9);
            if (value.length > 9) formattedValue += '-' + value.substring(9, 11);
            e.target.value = formattedValue;
        });

        inputMortgage.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0 && value[0] !== '7') value = '7' + value;
            let formattedValue = value.length > 0 ? '+' + value[0] : '';
            if (value.length > 1) formattedValue += ' (' + value.substring(1, 4);
            if (value.length > 4) formattedValue += ') ' + value.substring(4, 7);
            if (value.length > 7) formattedValue += '-' + value.substring(7, 9);
            if (value.length > 9) formattedValue += '-' + value.substring(9, 11);
            e.target.value = formattedValue;
        });

        quizInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0 && value[0] !== '7') value = '7' + value;
            let formattedValue = value.length > 0 ? '+' + value[0] : '';
            if (value.length > 1) formattedValue += ' (' + value.substring(1, 4);
            if (value.length > 4) formattedValue += ') ' + value.substring(4, 7);
            if (value.length > 7) formattedValue += '-' + value.substring(7, 9);
            if (value.length > 9) formattedValue += '-' + value.substring(9, 11);
            e.target.value = formattedValue;
        });

        sendForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const phone = phoneInput.value;
            const phoneDigits = phone.replace(/\D/g, '');

            if (phoneDigits.length < 11) {
                phoneError.textContent = 'Введите корректный номер телефона';
                return;
            }

            submitButton.textContent = 'Отправка...';

            const data = {
                phone,
                area,
                months,
                totalPrice: area * PRICE_PER_SQM,
                initialPayment: (area * PRICE_PER_SQM) * 0.5,
                monthlyPayment: ((area * PRICE_PER_SQM) * 0.5) / months
            };

            fetch('/api/send-telegram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка сервера: ' + response.status);
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    window.location = "../public/success-page.html";
                } else {
                    throw new Error(data.error || 'Неизвестная ошибка');
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
                phoneError.textContent = 'Ошибка при отправке. Попробуйте позже.';
                submitButton.textContent = 'Отправить заявку';
            });
        });

        buttonMortgage.addEventListener("click", (e) => {
            e.preventDefault();
            let phone = inputMortgage.value.trim();
            let mode = 1;
            let phoneDigits = phone.replace(/\D/g, '');

            if (phoneDigits.length < 11) {
                textErrorMortgage.style.display = "inline";
                textErrorMortgage.textContent = 'Введите корректный номер телефона';
                return;
            }

            buttonMortgage.disabled = true;
            buttonMortgage.textContent = 'Отправка...';

            let data = {
                mode: mode,
                phone
            };

            fetch('/api/send-telegram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка сервера: ' + response.status);
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    window.location = "../public/success-page.html";
                } else {
                    throw new Error(data.error || 'Неизвестная ошибка');
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
                textErrorMortgage.style.display = "inline"
                textErrorMortgage.textContent = 'Ошибка при отправке. Попробуйте позже.';
                buttonMortgage.disabled = false;
                buttonMortgage.textContent = 'Отправить заявку';
            });
        });

        // Инициализация
        calculateValues();
