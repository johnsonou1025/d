// Copyright 2025 Johnson

$(function () {
    // freezed
    $(window).on('scroll', function () {
        var currentScrollTop = $(this).scrollTop();
        // console.log(currentScrollTop);
        var topHeight = ($(".freeze-box").height()) * 2 + 26;
        if (!$("body").hasClass("freezed")) {
            if (currentScrollTop >= 176) {
                $("body").addClass("freezed");
                $(".freezed main").css('padding-top', topHeight);

            }
        } else {
            if (currentScrollTop < 176) {
                $("body").removeClass("freezed");
                $("main").css('padding-top', 0);
            }
        }
    })

    // jackpot number 
    let num = 0;
    let numEnd = 8888888;
    let interval = setInterval(function () {
        if (num >= numEnd) {
            numberRun(numEnd);
            clearInterval(interval);
            return;
        }
        numberRun(num);
        num = num + (numEnd / 100);

    }, 10); // 5ms 增加 1
    // set number function
    function numberRun(e) {
        let strNum = Math.floor(e).toString().padStart(9, "0");
        $(".number span:nth-child(1)").text(strNum.charAt(0));
        $(".number span:nth-child(3)").text(strNum.charAt(1));
        $(".number span:nth-child(4)").text(strNum.charAt(2));
        $(".number span:nth-child(5)").text(strNum.charAt(3));
        $(".number span:nth-child(7)").text(strNum.charAt(4));
        $(".number span:nth-child(8)").text(strNum.charAt(5));
        $(".number span:nth-child(9)").text(strNum.charAt(6));
        $(".number span:nth-child(11)").text(strNum.charAt(7));
        $(".number span:nth-child(12)").text(strNum.charAt(8));
    }

    // click tags 
    $(".tags-box li").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
    })

    $(".nav-bottom li").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
    })

});
