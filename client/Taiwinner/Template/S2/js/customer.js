// Copyright 2025 Johnson
$(function () {

    let kvHeight = $(".kv").height();
    let mainHeight = $(".main-fix").height();
    $(window).scroll(function () {
        let currentScrollTop = $(window).scrollTop();
        // console.log(currentScrollTop);
        if (currentScrollTop >= kvHeight) {
            $("body").addClass("freezed");
        }
        if (currentScrollTop <= mainHeight) {
            $("body").removeClass("freezed");
        }
    })

    $(".control li").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
    })
    // console.log();
})