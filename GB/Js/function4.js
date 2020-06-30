var Current = [
    { MultiLangTitle: "网站系统升级中，提款时间暂受影响；已完成３项安全验证的用户，仍可快速提款。网站系统升级中，提款时间暂受影响；已完成３项安全验证的用户" },
    { MultiLangTitle: "六大真人博彩平台官方指定合作" },
    { MultiLangTitle: "网站系统升级中，提款时间暂受影响；已完成３项安全验证的用户，仍可快速提款。网站系统升级中，提款时间暂受影响；已完成３项安全验证的用户" },
    { MultiLangTitle: "六大真人博彩平台官方指定合作" },
    { MultiLangTitle: "网站系统升级中，提款时间暂受影响；已完成３项安全验证的用户，仍可快速提款。网站系统升级中，提款时间暂受影响；已完成３项安全验证的用户" },
    { MultiLangTitle: "六大真人博彩平台官方指定合作" }
];
var marquee = new function () {
    this.vaid = 0;
    this.spanObj = $('span[rel=span_NewsTitle]');
    this.objInterval = null;
    this.interval = function () {
        var vspntxthideFunc = function () {
            marquee.vaid += 1;
            if (marquee.vaid >= Current.length) marquee.vaid = 0;
            marquee.spanObj.html(Current[marquee.vaid].MultiLangTitle);
            marquee.spanObj.fadeIn();
        };
        marquee.spanObj.fadeOut(vspntxthideFunc);
        vspntxthideFunc = null;
    };

    this.ShowNewsList = function (status) {
        if (status == 0) {
            $.unblockUI();
        }
        else {
            $.blockUI({
                message: $("#div_news"),
                css: {
                    cursor: "pointer"
                }
            });
        }
    }
};
window.setInterval(marquee.interval, 5000);

$(window).resize(function () {
    $("html").PushMenu("updateSize");
});
$(function () {
    //$(".left-aside ,.aside-title-right").height($(".main-content-wrapper").height());
    //body scrollbar
    //alert($(window).height() + "," + $("body").height())
    $(".main-content-wrapper").mCustomScrollbar(
    {
        scrollButtons: { enable: false },
        mouseWheel: { deltaFactor: 90 }
    });
	$(".left-aside").mCustomScrollbar(
    {
        scrollButtons: { enable: false },
		alwaysShowScrollbar:0,
        mouseWheel: { deltaFactor: 90 }
    });
    $(".sidemenu").height($(window).height()).mCustomScrollbar(
    {
        theme: "dark",
        scrollButtons: { enable: false },
        mouseWheel: true,
        mouseWheel: { deltaFactor: 90 }
    });
    //menu
    $("html").PushMenu(); //綁開合按鈕
    $("html").PushMenu("updateSize");

    //下拉選單scrollbar
    $(".drop-down-pre-match ol").mCustomScrollbar();

    //下拉選單
    /*$(".btn-wrap-header a").bind("click", function () {
        var $this = $(this).siblings("ol");
        if ($this.is(":hidden")) {
            $this.show();
        }
        else {
            $this.hide();
        }
    });*/

    //公告換頁
    $(".page-wrap").find("li").bind("click", function () {
        $(".page-wrap li").removeClass("active");
        var $this = $(this);
        $this.addClass("active");
        var index = $(this).index(),
            newTarget = $('.article').eq(index).slideDown();
        $('.article').not(newTarget).slideUp();
    });

    //開闔
    $(".pre-match-title , header.header").off("click").on("click", function () {
        var $this = $(this);
        var $item = $this.siblings()
        if ($item.is(":animated")) {
            return;
        }
        $item.slideToggle();
    });

    $("#news_box").bind("click", function () {
        marquee.ShowNewsList(1);
    });

    //i-pad portrait
    $('.device-betslip-btn').click(function () {
        if ($('.right-aside').hasClass('open')) {
            $('.right-aside').toggleClass("open");
        }
        else {
            $('.right-aside').addClass('open');
            //$('.right-aside').css('min-height', '900px');
        }
    });
	
});


//iPad rotate bug fix
if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
    var viewportmeta = document.querySelector('meta[name="viewport"]');
    if (viewportmeta) {
        viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0';
        document.body.addEventListener('gesturestart', function () {
            viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
        }, false);
    }
}






