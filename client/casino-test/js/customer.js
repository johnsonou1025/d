// Copyright 2025 Johnson

$(function () {
    // freezed
    $(window).on('scroll', function () {
        var currentScrollTop = $(this).scrollTop();
        console.log(currentScrollTop);
        if (!$("body").hasClass("freezed")) {
            if (currentScrollTop >= 176) {
                $("body").addClass("freezed");
                // $('html, body').scrollTop(1);
                // $('html, body').animate({ scrollTop: 1 }, 'fast');
            }
        } else {
            if (currentScrollTop < 176) {
                $("body").removeClass("freezed");
                // $('html, body').scrollTop(175);
                // $('html, body').animate({ scrollTop: 175 }, 'fast');
            }
        }
    })

    // **阻止 touchmove 事件，避免手指滑動導致跳動**
    $(document).on('touchmove', function (e) {
        e.preventDefault(); // 禁止滾動
    });

    // jackpot number 

    let num = 0;
    let numEnd = 8888888;
    let interval = setInterval(function () {
        if (num >= numEnd) {
            let strNum = Math.floor(numEnd).toString().padStart(9, "0"); // 用 0 補滿 4 位數
            $(".number span:nth-child(1)").text(strNum.charAt(0));
            $(".number span:nth-child(3)").text(strNum.charAt(1));
            $(".number span:nth-child(4)").text(strNum.charAt(2));
            $(".number span:nth-child(5)").text(strNum.charAt(3));
            $(".number span:nth-child(7)").text(strNum.charAt(4));
            $(".number span:nth-child(8)").text(strNum.charAt(5));
            $(".number span:nth-child(9)").text(strNum.charAt(6));
            $(".number span:nth-child(11)").text(strNum.charAt(7));
            $(".number span:nth-child(12)").text(strNum.charAt(8));
            clearInterval(interval); // 停止動畫
            return;
        }

        let strNum = Math.floor(num).toString().padStart(9, "0"); // 用 0 補滿 4 位數
        $(".number span:nth-child(1)").text(strNum.charAt(0));
        $(".number span:nth-child(3)").text(strNum.charAt(1));
        $(".number span:nth-child(4)").text(strNum.charAt(2));
        $(".number span:nth-child(5)").text(strNum.charAt(3));
        $(".number span:nth-child(7)").text(strNum.charAt(4));
        $(".number span:nth-child(8)").text(strNum.charAt(5));
        $(".number span:nth-child(9)").text(strNum.charAt(6));
        $(".number span:nth-child(11)").text(strNum.charAt(7));
        $(".number span:nth-child(12)").text(strNum.charAt(8));

        num = num + (numEnd / 100);

    }, 10); // 5ms 增加 1

    // click tags 
    $(".tags-box li").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
    })

    $(".nav-bottom li").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
    })

});
