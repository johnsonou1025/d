// Copyright 2025 Johnson
$(function () {
    // set scroll area height
    var freezedBox = $(".freeze-box").height();
    var nav = $(".navigation").height();
    var kv = $(".kv").height();
    $(".scroll-box").css({
        "padding-top": freezedBox,
        "padding-bottom": nav + 12
    });


    // scroll 
    $(window).scroll(function () {
        var currentScrollTop = $(this).scrollTop();
        if (currentScrollTop >= kv) {
            $(".control").addClass("active");
        } else {
            $(".control").removeClass("active");
        }
    })
    // set control top 
    $(".control").css("top", ($(window).height() - freezedBox - nav) / 2 + freezedBox);
    // game menu run 
    $(".control li").click(function () {
        var liIndex = $(this).index();
        var gameTop = $(".games ul").eq(liIndex).offset().top;
        $('html, body').animate({ scrollTop: gameTop - freezedBox }, 300);
    })

})