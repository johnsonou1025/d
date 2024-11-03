$(document).ready(function () {
    // mobile header
    $(".nav-switch").click(function () {
        $("body").addClass("lock");
        $(".nav-menu").addClass("open");
    })
    $(".nav-close").click(function () {
        $("body").removeClass("lock");
        $(".nav-menu").removeClass("open");
    })
    // -----------
    // $('.nav-menu').on('click', 'a', function (event) {
    $(".nav-menu a").not(':last').on('click', function (event) {
        $("body").removeClass("lock");
        $(".nav-menu").removeClass("open");
        var _headerHeight = $("header").height();
        event.preventDefault();
        var _href = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(_href).offset().top - _headerHeight
        }, 800);
    });
    // language
    $(".lang").click(function () {
        $(this).toggleClass("en");
    })

    // slider card
    $(".card-slider i:first-child").click(function () {
        $(".card-group li:last-child").insertBefore($(".card-group li:first-child"));
    });
    $(".card-slider i:last-child").click(function () {
        $(".card-group li:first-child").insertAfter($(".card-group li:last-child"));
    });

});
// anime
$(window).scroll(function () {
    $(".fadePlay").each(function (i) {
        var $div = $(this).children("div");
        var bottom_of_object = $(this).offset().top;
        var bottom_of_window = $(window).scrollTop() + $(window).height() * 0.9;
        if (bottom_of_window > bottom_of_object) {
            $div.each(function (index) {
                setTimeout(function () {
                    $($div[index]).addClass("fadeIn");
                }, index * 300);
            });
        }
    });
});

function setLanguage(lang) {
    fetch('../language.json') // 載入 JSON 文件
        .then(response => response.json())
        .then(data => {
            const translations = data[lang];
            document.querySelectorAll('[data-lang]').forEach(element => {
                const key = element.getAttribute('data-lang');
                if (translations[key]) {
                    element.textContent = translations[key];
                }
            });
        });
}
document.addEventListener("DOMContentLoaded", function () {
    setLanguage('en');
});