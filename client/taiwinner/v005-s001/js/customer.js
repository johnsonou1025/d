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
    // console.log();
})