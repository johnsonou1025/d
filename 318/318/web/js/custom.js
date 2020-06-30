$(function() {
    // 按鈕與文字連結失效
    $("a").each(function() {
        if ($(this).attr('href').length == 0) {
            $(this).attr("href", "javascript: void(0)");
        }
    });
    //登入行為
    $(".btn-login").click(function() {
        $(".login-info").hide();
        $(".account-info").show();
    });
    // 導航欄行為
    $(".nav dl").click(function() {
        $(this).addClass('active').siblings().removeClass('active');
    });
    // 跑馬燈
    var marqueesPlay = setInterval(marqueesAutoRun, 7000);

    function marqueesAutoRun() {
        var marqueesNum = $(".marquees-info li").length;
        if ($(".marquees-info li.active").index() == (marqueesNum - 1)) {
            $(".marquees-info li").eq(0).addClass('active').siblings().removeClass('active');
        } else {
            $(".marquees-info li.active").removeClass('active').next().addClass('active');
        }
    }
    // 會員中心選項
    $(".content .mc-left a").click(function() {
        $(this).addClass('active').siblings().removeClass('active');
    });
    // 拖拉吧行為
    // $(".slider-bar").slider({
    //     value: 50,
    //     slide: function(event, ui) {
    //         $(this).children('.slider-box').css("width", ui.value + "%");
    //     }
    // });
    // 二級表格
    $(".secTable").click(function() {
        if ($(this).parent().parent().next().hasClass('hide')) {
            $(this).parent().parent().next().removeClass('hide')
        } else {
            $(this).parent().parent().next().addClass('hide');
        }
    });
    // 選擇銀行卡行為
    $(".bankcard").click(function() {
        $(".from-card").find('.bankcard').removeClass('active');
        $(this).addClass('active');
    });
    // 頁籤行為
    $(".nav-tabs li").click(function() {
        $(this).addClass('active').siblings().removeClass('active');
    });
    //下拉選單行為
    $(".select").click(function() {
        $(this).toggleClass('active');
        $(this).children("ul").toggleClass('hide');
    });
    // 最新優惠-優惠詳情行為
    $(".promo-get-info").click(function() {
        $(this).parent().parent().toggleClass('active');
    });
    //最新優惠選單行為
    $(".nav-box li").click(function() {
        $(this).addClass('active').siblings().removeClass('active');
    });
    // 電子遊戲選單
    $(".game-nav li").click(function() {
        $(this).addClass('active').siblings().removeClass('active');
    });
    // 電子遊戲次選單
    $(".game-list").click(function() {
        $(this).toggleClass('active');
        $(".game-list-box").toggleClass('active');
    });
    // 電子遊戲次選單選項行為
    $(".game-list-menu a").click(function() {
        $(this).toggleClass('active');
    });

    // 電子遊戲風雲榜動態
    var winnderLinstPlay = setInterval(winnerLinstAutoRun, 4000);
    var winnerListLenght = $(".winner-animation").length;
    function winnerLinstAutoRun() {
        
        if ($(".winner-animation.active").index() == (winnerListLenght)) {
            $(".winner-animation").eq(0).addClass('active').siblings().removeClass('active');
        } else {
            $(".winner-animation.active").removeClass('active').next().addClass('active');
        }
    }



    // var winnerEqNum = 0;
    // autoWinnerAnimation();
    // function autoWinnerAnimation() {
    //     console.log(winnerEqNum);
    //     winnerEqLenght = $(".winner-animation > div").length;
    //     $(".winner-animation > div").eq(winnerEqNum).addClass('fadeIn');
    //     winnerEqNum++;
    //     if (winnerEqNum < winnerEqLenght) {
    //         setTimeout(autoWinnerAnimation, 200);
    //     }
    // }

    // 首頁廣告動態
    var itemLength = $(".index-banner .item").length;
    setInterval(indexBannerRun, 7000);

    function indexBannerRun() {
        if ($(".index-banner .item.active").index() == itemLength - 1) {
            $(".index-banner .item").eq(0).addClass('active').siblings().removeClass('active');
        } else {
            $(".index-banner .item.active").removeClass('active').next().addClass('active');
        }
    }
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

    // 即時通知訊息動態
    $(".notification-close").click(function() {
        $(this).parent().slideUp(function() {
            $(this).remove()
            if ($(".notification-info").length == 1) {
                $(".notification-closer").remove();
            }
        });

    });
    $(".notification-closer").click(function() {
        $(this).parent().slideUp();
    });
    var autonotification = setInterval(function() {
        if ($(".notification-info").length < 1) {
            clearInterval(autonotification);
        } else {
            $(".notification-info:first-child").slideUp(function() {
                $(this).remove();
                if ($(".notification-info").length == 1) {
                    $(".notification-closer").remove();
                }
            })
        }
    }, 5000);

    // 百分比條動態
    $(".item-progress").each(function() {
        var getWidth = $(this).find("h5").text();
        $(this).find(".progress-percent").css("width", getWidth);
    });

    // 首頁開啟時loading畫面
    setTimeout(function() {
        $(".loading-page").fadeOut().parent("body").css("overflow", "");
    }, 1000);

    // 真人娛樂館各館動態
    $(".nav-box li").click(function() {
        $(".casino-box").hide();
        autoPlayCasinoBox();
    });
    $(".casino-box").hide();

    function autoPlayCasinoBox() {
        if ($(".casino-box:hidden:first").length == 1) {
            $(".casino-box:hidden:first").fadeIn();
            setTimeout(autoPlayCasinoBox, 200);
        }
    }
    autoPlayCasinoBox();



    // 刪除updog的元件
    var deletUpdog = setInterval(deletUpdogRun(), 5000);

    function deletUpdogRun() {
        console.log("deletUpdogRun");
        $(".updog-stamp").remove();
        clearInterval(deletUpdog);
    }

})