// Copyright 2025 Johnson
$(function () {

    let kvHeight = $(".kv").height();
    let mainHeight = $(".main-fix").height();
    console.log(mainHeight);

    $(window).scroll(function () {
        let currentScrollTop = $(window).scrollTop();
        if (currentScrollTop >= kvHeight) {
            $("body").addClass("freezed");
        } else {
            $("body").removeClass("freezed");
        }
    })
    // console.log();
})