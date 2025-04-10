// Copyright 2025 Johnson
$(function () {

    const $body = $("body");
    const $scrollBox = $(".scroll-box");
    const headerHeight = $(".header").outerHeight();
    const kvHeight = $(".kv").outerHeight();
    const mainHeight = $(".main-fix").outerHeight();
    const totalPadding = headerHeight + kvHeight + mainHeight;

    let isFreezed = false;

    $(window).on("scroll", function () {
        const currentScrollTop = $(this).scrollTop();

        if (currentScrollTop >= kvHeight) {
            if (!isFreezed) {
                $body.addClass("freezed");
                $scrollBox.css("padding-top", totalPadding);
                isFreezed = true;
            }
        } else {
            if (isFreezed) {
                $body.removeClass("freezed");
                $scrollBox.css("padding-top", "");
                isFreezed = false;
            }
        }
    });
    // console.log();
})