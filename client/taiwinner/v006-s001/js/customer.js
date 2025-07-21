// Copyright 2025 Johnson
$(function () {

    const $body = $("body");
    const $scrollBox = $(".scroll-box");
    const headerHeight = $(".header").outerHeight();
    const mainHeight = $(".main").outerHeight();

    let isFreezed = false;

    $(window).on("scroll", function () {
        const currentScrollTop = $(this).scrollTop();

        if (currentScrollTop >= mainHeight) {
            if (!isFreezed) {
                $body.addClass("freezed");
                isFreezed = true;
            }
        } else {
            if (isFreezed) {
                $body.removeClass("freezed");
                isFreezed = false;
            }
        }
    });

    // card box main 
    $(".main .tags .rt .btn").click(function () {
        $(".main").removeClass("close");
        $(".main").toggleClass("open");
        if ($(".main").hasClass("open")) {
            $(".entrance-box").addClass("close");
        } else {
            $(".entrance-box").removeClass("close");
        }
    })
    $(".main .tags .rt i").click(function () {
        $(".main").removeClass("open");
        $(".main").toggleClass("close");
        if ($(".main").hasClass("open")) {
            $(".entrance-box").addClass("close");
        } else {
            $(".entrance-box").removeClass("close");
        }
    })




    // console.log();
})