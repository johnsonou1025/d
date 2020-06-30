$(function() {
    console.log("custom.js load success!")
    // 按鈕與文字連結失效
    $("a").each(function() {
        if ($(this).attr('href').length == 0) {
            $(this).attr("href", "javascript: void(0)");
        }
    });

    // 下拉選項
    $(".select").click(function() {
        $(this).children("ul").toggleClass('hide');
    });

    // 彈跳視窗呼叫及動態效果
    $(".popup-btn").click(function() {
        var href = $(this).attr("href");
        $(href).fadeIn(250);
        $(href).children('div').eq(0).removeClass("transform-out").addClass("transform-in");
        $("body").addClass('hidden');
    });

    $(".popup-close").click(function() {
        $(".popup-wrap").fadeOut(200);
        $(".popup-wrap").children('div').eq(0).removeClass("transform-in").addClass("transform-out");
        $("body").removeClass('hidden');
    });

    // 打開更多銀行選項
    $(".openAllList").click(function() {
        $(this).parent().children('.allList').removeClass('hide');
        $(this).remove();
    });


    // 登入
    $(".login-btn").click(function() {
        $(".login-after").removeClass('hide')
        $(".login-before").addClass('hide')
    });
    // 登出
    $(".login-after a:last-child").click(function() {
        $(".login-before").removeClass('hide')
        $(".login-after").addClass('hide')
    });
    //註冊input
    $("#register input").focus(function() {
        $(this).parent().children('.message-wrap').hide();
    });

    // 首頁-大圖輪播
    var kvPlay;
    kvPlay = setInterval(kvAutoRun, 5000);
    $(".kv-page li").click(function(event) {
        clearInterval(kvPlay);
        $(this).addClass('active').siblings().removeClass('active');
        var kvActiveNum = $(this).index();
        $(".kv-item li").eq(kvActiveNum).addClass('active').siblings().removeClass('active');
        kvPlay = setInterval(kvAutoRun, 5000);
    });

    function kvAutoRun() {
        var kvNum = $(".kv-item li").length;
        if ($(".kv-item li.active").index() == (kvNum - 1)) {
            $(".kv-item li").eq(0).addClass('active').siblings().removeClass('active');
            $(".kv-page li").eq(0).addClass('active').siblings().removeClass('active');;
        } else {
            $(".kv-item li.active").removeClass('active').next().addClass('active');
            $(".kv-page li.active").removeClass('active').next().addClass('active');
        }
    }

    // 跑馬燈
    var marqueesPlay = setInterval(marqueesAutoRun, 7000);

    function marqueesAutoRun() {
        var marqueesNum = $(".marquees-info li").length;
        if ($(".marquees-wrap li.active").index() == (marqueesNum - 1)) {
            $(".marquees-wrap li").eq(0).addClass('active').siblings().removeClass('active');
        } else {
            $(".marquees-wrap li.active").removeClass('active').next().addClass('active');
        }
    }

    // 最新優惠-打開更多
    $(".promotion-item .btn-more").click(function() {
        $(this).parent().parent().toggleClass('open');
    });


    // 電子遊戲選單
    $(".games-nav li").click(function() {
        $(this).addClass('active').siblings().removeClass('active');
    });


    // 使用幫助
    $(".help-nav-wrap .prev").click(function(event) {
        $(this).parent().children('.help-nav').children('ul').toggleClass('active');
    });
    $(".help-nav-wrap .next").click(function(event) {
        $(this).parent().children('.help-nav').children('ul').toggleClass('active');
    });

    // 消息公告
    $(".message-item").click(function() {
        $(this).toggleClass("read");
    });


    // 刪除updog的元件
    var deletUpdog = setInterval(deletUpdogRun(), 5000);

    function deletUpdogRun() {
        console.log("deletUpdogRun");
        $(".updog-stamp").remove();
        clearInterval(deletUpdog);
    }

})