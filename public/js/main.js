$(document).ready(function () {
    $(".video-preview").click(function () {
        $(".play-button").hide();
        $(".video-preview").hide();
        $(".video-preview").hide(); // Этот селектор продублирован, возможно, нужно удалить одну строку.
        $(".video-container iframe").show();
    });
});


$(document).ready(function () {

    // Исправлено: РќРѕРјРµСЂ выглядит как ошибочная кодировка. Предполагаем, что нужен ввод телефона.
    // Используйте правильный селектор для вашего поля ввода телефона, например по ID или классу.
    // $('input[name="РќРѕРјРµСЂ"]').mask("+7(999) 999-99-99");
    // Пример: Если поле ввода ID="phone", используйте $('#phone').mask(...)
    // Или если поле ввода имеет класс "phone-input", используйте $('.phone-input').mask(...)
    // $.mask.definitions['h'] = "[0|1|3|4|5|6|7|9]"
    // Оставляем маску для примера, но возможно, потребуется уточнить селектор.
//   $('input[type="tel"]').click(function(){
//         $(this).setCursorPosition(-1);
//     }).mask("+7(h99) 999-99-99");
//     $.fn.setCursorPosition = function(pos) {
//         if ($(this).get(0).setSelectionRange) {
//             $(this).get(0).setSelectionRange(pos, pos);
//         } else if ($(this).get(0).createTextRange) {
//             var range = $(this).get(0).createTextRange();
//             range.collapse(true);
//             range.moveEnd('character', pos);
//             range.moveStart('character', pos);
//             range.select();
//         }
//     };

IMask(
        document.getElementById('inp-phone'),
        {
            mask: '+{7}(#00)000-00-00',
            definitions: {'#': /(0|1|3|4|5|6|7|9)/}
        }
    )
    /*Прокрутка страницы к середине квиза - закомментировано в оригинале*/
    /*$(".quiz__btn-prev, .quiz__btn-next").on("click", function () {
        $("body, html").animate({scrollTop: $("#quiz_block").offset().top}, 1000);
    });
    

    $('.quiz__question input[type="radio"]').on("change", function () {
        $("body, html").animate({scrollTop: $("#quiz_block").offset().top}, 1000);
    });
*/
    new WOW().init();
    $('.popup-wrap, .close').on('click', function (e) {
        if (e.target == this) {
            $(this).closest('.popup').fadeOut();
        }
    })

    jQuery('img.svg').each(function () {
        var $img = jQuery(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');
        jQuery.get(imgURL, function (data) {
            var $svg = jQuery(data).find('svg');

            if (typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            if (typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass + ' replaced-svg');
            }
            $svg = $svg.removeAttr('xmlns:a');
            if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
            }
            $img.replaceWith($svg);

        }, 'xml');
    });

    // Удалены вызовы ym()
    $('.quiz__answer__label').on('click', function () {
        if ($(this).data('metricsid')) {
            // ym($(this).data('metricsid'), 'reachGoal', 'quiz_' + $(this).data('metrics')) // Удалено
        }
    })
    // Удалены вызовы ym()
    $('.quiz__btn-next').on('click', function () {
        if ($(this).data('metricsid')) {
            // ym($(this).data('metricsid'), 'reachGoal', 'quiz_' + $(this).data('metrics')) // Удалено
        }
    })

    $('.close-quiz').on('click', function() {
        $('.quiz').removeClass('__clicked')
        $('.quiz__question').removeClass('active')
       var prev_q = 'q_1';
        var prev_qnum = $(this).data('prevnum');
        var prev_qperc = 0;
        $('#' + prev_q).addClass('active');
        track(prev_qperc, prev_qnum, prev_q.replace('q_', ''))
        $('html').removeClass('quiz_clicked')
    })

    $('.quiz__question input[type="radio"]').on('change', function () {
        if (!$('.quiz').hasClass('__clicked')) {
            $('html').addClass('quiz_clicked')
            $('.quiz').addClass('__clicked')
        }
        var answ = $(this).closest('.quiz__question');
        var btn = $(answ).find('.quiz__btn-next');
        $(btn).prop('disabled', false);
        var q = $(this).closest('.quiz__question');
        var id = $(q).attr('id');
        var next_q = $(this).data('next');
        var next_perc = $(this).data('perc');
        $(btn).data('next', next_q)
        $(btn).data('nextperc', next_perc)
        window.setTimeout(function () {
            if (next_q != 'final' && next_q != '') {
                $('.quiz__question').removeClass('active');
                $('#q_' + next_q).addClass('active');

                var next_btn_prev = $('#q_' + next_q).find('.quiz__btn-prev');
                var next_btn_next = $('#q_' + next_q).find('.quiz__btn-next');

                var q_num = $(q).find('.q_num')[0]
                var next_prev_num = $(q_num).html()
                var next_prev_perc = $('#quiz-percent').html();

                var next_label = $('#q_' + next_q).find('.quiz__answer__label');
                // Удалена установка атрибута data-metrics, который использовался для ym()
                // $(next_label).attr('data-metrics', $(q_num).html()) // Удалено
                // $(next_btn_next).attr('data-metrics', $(q_num).html()) // Удалено


                $(next_btn_prev).attr('data-prev', id);
                $(next_btn_prev).attr('data-prevnum', next_prev_num);
                $(next_btn_prev).attr('data-prevperc', next_prev_perc);

                curId = Number($(q).data('num')) + 1;
                answ_track(curId - 1, id)
                track(next_perc, curId, next_q)
                $('#q_' + next_q).attr('data-num', curId);
            } else {
                $('.quiz__question').removeClass('active');
                $('.quiz__final').addClass('active');
                $('.quiz__left').hide();
                $('.quiz__main').hide();
                window.setTimeout(function () {
                    $('.quiz__load').fadeOut();
                }, 2000);
            }
        }, 500);
    })

    $('.quiz__question input[type="checkbox"]').on('change', function () {
        var q = $(this).closest('.quiz__question');
        var btn = $(q).find('.quiz__btn-next');
        var check = $(q).find('input[type=checkbox]:checked');
        if (check.length > 0) {
            $(btn).prop('disabled', false);
        } else {
            $(btn).prop('disabled', true);
        }
    })

    $('.quiz__question input[type="file"]').on('change', function () {
        var q = $(this).closest('.quiz__question');
        var btn = $(q).find('.quiz__btn-next');
        $(btn).prop('disabled', false);
    })

    var Q = $('.quiz__main').find('.quiz__question');
    var MAX_Q = Q.length;

    $('.quiz__btn-next').on('click', function () {
        if (!$('.quiz').hasClass('__clicked')) {
            $('.quiz').addClass('__clicked')
        }
        var q = $(this).closest('.quiz__question');
        var id = $(q).attr('id');
        // var id = Number($(q).data('question')); // Закомментировано в оригинале
        // id += 1; // Закомментировано в оригинале

        var next_q = $(this).data('next');
        var next_num = $(this).data('nextnum'); // Эта переменная не используется далее в этом блоке
        var next_perc = $(this).data('nextperc');
        if (next_q != 'final' && next_q != '') {

            $('.quiz__question').removeClass('active');
            $('#q_' + next_q).addClass('active');
            var next_btn_prev = $('#q_' + next_q).find('.quiz__btn-prev');
            // var next_btn_next = $('#q_' + next_q).find('.quiz__btn-next'); // Эта переменная не используется далее в этом блоке

            var q_num = $(q).find('.q_num')
            var next_prev_num = $(q_num[0]).html()
            var next_prev_perc = $('#quiz-percent').html();

            track(next_perc, curId + 1, next_q);

            $(next_btn_prev).attr('data-prev', id);
            $(next_btn_prev).attr('data-prevnum', next_prev_num);
            $(next_btn_prev).attr('data-prevperc', next_prev_perc);

            var next_label = $('#q_' + next_q).find('.quiz__answer__label');
            // Удалена установка атрибута data-metrics, который использовался для ym()
            // $(next_label).attr('data-metrics', $(q_num).html()) // Удалено
            // $(next_btn_next).attr('data-metrics', $(q_num).html()) // Удалено - переменная не использовалась до этого

            answ_track(curId, id)
            curId = Number($(q).data('num')) + 1;
            $('#q_' + next_q).attr('data-num', curId);
        } else {
            $('.quiz__question').removeClass('active');
            $('.quiz__final').addClass('active');
            $('.quiz__left').hide();
            $('.quiz__main').hide();
            window.setTimeout(function () {
                $('.quiz__load').fadeOut();
            }, 2000);
        }
    })

    $('.quiz__btn-prev').on('click', function () {
        var q = $(this).closest('.quiz__question');
        // var id = Number($(q).data('question')); // Закомментировано в оригинале
        // id -= 1; // Закомментировано в оригинале
        $('.quiz__question').removeClass('active');
        var prev_q = $(this).data('prev');
        var prev_qnum = $(this).data('prevnum');
        var prev_qperc = $(this).data('prevperc');
        $('#' + prev_q).addClass('active');
        track(prev_qperc, prev_qnum, prev_q.replace('q_', ''))
        curId -= 1;
        $('.quiz__answ-list__item').each(function () {
            if (Number($(this).data('id')) >= curId) {
                $(this).remove();
            }
        })
    })

    $('.quiz__final input[name="contact"]').on('change', function () {
        if ($(this).val() == 'E-mail') {
            $('#q_mail').prop('required', true).removeClass('visually-hidden');
        } else {
            $('#q_mail').prop('required', false).addClass('visually-hidden');
        }
    })

    function track(perc, num, id) {
        $('#quiz-percent').html(perc);
        $('#quiz-bar-prg').css('width', perc + '%');
        $('.quiz__help p').html($('#hint_' + id).html());
        $('#num_' + id).html(num)
    }


    var q1 = $('.quiz__main').find('.quiz__question')[0]

    track(0, 1, $(q1).data('id'));

    $('.quiz__inputs-block input').on('keyup', function () {
        var q = $(this).closest('.quiz__question');
        var btn = $(q).find('.quiz__btn-next');
        var inp = $(q).find('.quiz__inputs-block input');
        var filled = true;
        inp.each(function () {
            if ($(this).val().length == 0) {
                filled = false;
            }
        })
        if (filled) {
            $(btn).prop('disabled', false);
        } else {
            $(btn).prop('disabled', true);
        }
    })

    $('.footer__btn').on('click', function () {
        $('.footer').slideToggle();
        $(this).toggleClass('active')
    })

    $('.widget-close').on('click', function () {
        $('.widget').toggleClass('closed')
        $(this).toggleClass('active')
    })

    $('.quiz .quiz__contact__item input').on('change', function () {
        if ($(this).val() == 'Email') {
            $('#inp-mail').prop('required', true);
            $('#inp-mail').removeClass('visually-hidden')
            $('#inp-phone').attr('placeholder', '+7 (___) ___-__-__')
        } else {
            $('#inp-phone').attr('placeholder', '+7 (___) ___-__-__');
            $('#inp-mail').prop('required', false);
            $('#inp-mail').addClass('visually-hidden')
        }
    })

    $('.form-consult .quiz__contact__item input').on('change', function () {
        var form = $(this).closest('.form-consult');
        var mailF = $(form).find('input[name="mail"]')
        var phoneF = $(form).find('input[name="phone"]')
        if ($(this).val() == 'Email') {
            $(mailF).prop('required', true);
            $(mailF).removeClass('visually-hidden')
            $(phoneF).attr('placeholder', '+7 (___) ___-__-__')
        } else {
            $(phoneF).attr('placeholder', '+7 (___) ___-__-__');
            $(mailF).prop('required', false);
            $(mailF).addClass('visually-hidden')
        }
    })

    $('a[href="#popup-policy"]').on('click', function (e) {
        e.preventDefault();
        $('#popup-policy').fadeIn();
    })

    // Код, связанный с куки и событием mouseleave, оставлен, так как он не вызывает напрямую ym(),
    // хотя может использоваться для триггера чего-то другого, что в свою очередь может вызвать ym.
    // Если нужно полностью исключить логику "поймать уход мыши", удалите и этот блок.
    var visit = get_cookie("quiz_visited");
    $(document).mouseleave(function (event) {
        if (get_cookie("quiz_visited") != '1') {
            event = event || window.event;
            if (event.clientY < 0 || event.clientY < 3) {
                $('#magnet-popup').fadeIn();
                var date2 = new Date();
                date2.setDate(date2.getDate() + 7);
                date2 = date2.toUTCString();
                document.cookie = "quiz_visited=1;expires=" + date2;
            }
        }
    });

})

function get_cookie(cookie_name) {
    var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');

    if (results)
        return (unescape(results[2]));
    else
        return null;
}

function answ_track(num, id) {
    var elem_id = ('quiz_list-elem' + num);
    if (document.getElementById(elem_id)) {
        var elem = document.getElementById(elem_id)
        $(elem).html('')
    } else {
        var elem = document.createElement('div');
        $(elem).attr('id', 'quiz_list-elem' + num)
        $(elem).attr('data-id', num)
    }
    $(elem).addClass('quiz__answ-list__item');
    var title = document.createElement('p');
    var q = $('#' + id);
    $(title).addClass('fw-bold');
    // Вероятно, требуется исправить кодировку здесь тоже: Р’РѕРїСЂРѕСЃ
    $(title).html('Вопрос ' + num + ': ' + $($(q).find('.quiz__question__title')).html())
    var type = $(q).data('qtype');
    var choose = $(q).data('qchoose');
    var answ = document.createElement('div');
    $(answ).addClass('quiz__answ-list__answ');
    if (type == 'file-answer') {
         // Вероятно, требуется исправить кодировку: Р¤Р°Р№Р» Р·Р°РіСЂСѓР¶РµРЅ
        $(answ).html('Файл загружен')
    } else if (type == 'input-answer') {
        var answers = $(q).find('.quiz__input__wrap');
        $(answers).each(function () {
            var p = document.createElement('p');
            var t = $(this).find('.quiz__input__title')[0]
            var v = $(this).find('.quiz__input')[0]
            var m = $(this).find('.quiz__input__ms')[0]
            $(p).html($(t).html() + ' - ' + $(v).val() + ' ' + $(m).html())
            answ.append(p)
        })
    } else if (choose == 'radio') {
        var val = $(q).find('input:checked')[0]
        $(answ).html($(val).val())
    } else if (choose == 'checkbox') {
        var val = $(q).find('input:checked')
        $(val).each(function () {
            var p = document.createElement('p');
            var v = $(this).val()
            $(p).html(v)
            answ.append(p)
        })
    }
    $(elem).append(title)
    $(elem).append(answ)
    $('#quiz_answers-list').append(elem);
}


var curId = 1;