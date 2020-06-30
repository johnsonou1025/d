$(function() {
    console.log("custom.js success!");
    // 按鈕與文字連結失效
    $("a").each(function() {
        if ($(this).attr('href').length == 0) {
            $(this).attr("href", "javascript: void(0)");
        }
    });
    //按連結是到下頁的動態
    $("a").click(function() {
        if ($(this).attr('href') == "javascript: void(0)") {} else if ($(this).hasClass('popup-btn')) {} else {
            var href = $(this).attr('href');
            $("body").addClass('page-out');
            $(this).attr("href", "javascript: void(0)");
            setTimeout(function() { window.location = href }, 800);
        }
    });
    // 左側選單開啟動態
    $(".btn-left-menu").click(function() {
        $(".slide-menu-left").addClass('active');
    })
    $(".slide-menu-left").click(function() {
        $(".btn-left-menu").removeClass('active');
        $(this).removeClass('active');
    });
    // 刪除updog的元件
    setTimeout(function() {
        $("#footer").next("a").remove();
    }, 3000);
    // var deletUpdog = setInterval(deletUpdogRun(), 5000);

    // function deletUpdogRun() {
    //     console.log("deletUpdogRun");
    //     $(".updog-stamp").remove();
    //     clearInterval(deletUpdog);
    // }


    // 打開遊戲介紹動態
    $(".select-item").click(function() {
        $(".select-open-item").addClass('active');
        $("body").addClass('hidden');
    });

    // 關閉遊戲介紹動態
    $(".select-close-btn a").click(function() {
        $(".select-open-item").removeClass('active');
        $("body").removeClass('hidden');
    });
    // 次選單動態
    $(".open-menu-window").click(function() {
        $(".menu-window-item").addClass('active');
        $("body").addClass('hidden');
    });
    $(".sift-condition-action a").click(function() {
        $(".menu-window-item").removeClass('active');
        $("body").removeClass('hidden');
    });
    $(".product-list a").click(function() {
        $(this).toggleClass('active');
    });
    //選項動態
    $(".nav-box li").click(function() {
        $(this).addClass('active').siblings().removeClass('active');
    });
    // 訊息公告顯示動態
    $(".list-item-2 a").click(function() {
        $(this).parent().toggleClass('active').siblings('').removeClass('active');
    });
    // 彈跳視窗呼叫及動態效果
    $(".popup-btn").click(function() {
        var href = $(this).attr("href");
        $(href).fadeIn(250);
        $(href).children('.popup-box').removeClass("transform-out").addClass("transform-in");
    });

    $(".popup-close").click(function() {
        $(".popup-wrap").fadeOut(200);
        $(".popup-box").removeClass("transform-in").addClass("transform-out");
    });
    // 頁首APP下載欄位動態
    $(".close-btn-app").click(function() {
        $("body").removeClass('open-top-message');
    });
    setTimeout(function() { $("body").removeClass('open-top-message'); }, 1000 * 5)
    // 視覺被滑動時的動態
    document.ontouchmove = function() {}

    // 電子遊戲獎池動態
    var num = 14174188823;
    var t;
    var stopTime;
    var runNum2 = setInterval(startRunNum2, 1000 * 1 / 10);
    var stopNum = usefloor(100, 1) + num;

    function startRunNum2() {
        var spanLength = $(".overlayNumbers span").length;
        var numString = num.toString().split("").reverse();
        var numStringLength = numString.length;
        for (s = 1; s <= spanLength; s++) {
            $(".overlayNumbers span").eq(spanLength - s).text(numString[s - 1]);
        }
        if (stopNum && num == stopNum) {
            clearInterval(runNum2)
            setTimeout(function() {
                stopNum = usefloor(100, 1) + num;
                stopTime = usefloor(5000, 1);
                speedTime = usefloor(100, 1);
                runNum2 = setInterval(startRunNum2, 1000 * 1 / speedTime);
            }, stopTime);
        } else {
            num = num + 1;
        }
    }
    // 電子遊戲獎池動態-隨機取整數
    function usefloor(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    // 移除即時訊息
    $(".notifications-wrap").click(function(event) {
        $(this).removeClass('message-in').addClass('message-out');
    });
    setTimeout(notificationAdd, 1000 * 5);

    function notificationAdd() {
        $(".notifications-wrap").removeClass('message-out').addClass('message-in');
    }
    setTimeout(notificationRemove, 1000 * 10);

    function notificationRemove() {
        $(".notifications-wrap").removeClass('message-in').addClass('message-out');
    }

    // 首頁開啟時loading畫面
    setTimeout(function() {
        $(".loading-page").fadeOut().parent("body").css("overflow", "");
    }, 2000);

})