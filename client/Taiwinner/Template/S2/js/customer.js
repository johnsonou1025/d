// Copyright 2025 Johnson
$(function () {

    let kvHeight = $(".kv").height();
    let mainHeight = $(".main-fix").height();
    $(window).scroll(function () {
        let currentScrollTop = $(window).scrollTop();
        console.log(currentScrollTop);
        if (currentScrollTop >= kvHeight) {
            $("body").addClass("jackpot-fixed");
        }
        if (currentScrollTop <= mainHeight) {
            $("body").removeClass("jackpot-fixed");
        }
    })
    // console.log();
})