$(document).ready(function () {
    // mobile header
    $(".nav-menu-mobile").click(function () {
        $("body").addClass("lock");
        $(".nav-menu").addClass("open");
    })
    $(".nav-menu-mobile-close").click(function () {
        $("body").removeClass("lock");
        $(".nav-menu").removeClass("open");
    })
    // -----------
    $('.nav-menu').on('click', 'a', function (event) {
        $("body").removeClass("lock");
        $(".nav-menu").removeClass("open");
        var _headerHeight = $("header").height();
        event.preventDefault();
        var _href = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(_href).offset().top - _headerHeight
        }, 800);
    });
    // number anime
    $(".countValue").each(function () {
        var $div = $(this);
        var targetNumber = parseFloat($div.data('target'), 50);
        var currentNumber = 0;
        var addNumber = parseInt(targetNumber / 30) + 1;
        var interval = setInterval(function () {
            currentNumber = currentNumber + addNumber;
            $div.text(currentNumber);
            if (currentNumber >= targetNumber) {
                clearInterval(interval);
                $div.text(targetNumber);
            }
        }, 50);
    });

    // anime
    $(window).scroll(function () {
        $(".fadePlay").each(function (i) {
            var bottom_of_object = $(this).offset().top;
            var bottom_of_window = $(window).scrollTop() + $(window).height() * 0.9;
            if (bottom_of_window > bottom_of_object) {
                $(this).addClass("fadeInUp");
            }
        });
    });
    $(window).scroll(function () {
        $div = $(".fadeAnime>div");
        $(".fadeAnime").each(function (i) {
            var bottom_of_object = $(this).offset().top;
            var bottom_of_window = $(window).scrollTop() + $(window).height() * 0.9;
            if (bottom_of_window > bottom_of_object) {
                $div.each(function (index) {
                    // 使用 setTimeout 來延遲每個 div 的 class 添加
                    setTimeout(function () {
                        $($div[index]).addClass("fadeIn"); // 添加 class
                    }, index * 300);  // 每個 div 的延遲時間增加 1 秒
                });
            }
        });
    });
});