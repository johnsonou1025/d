﻿var Current = [
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
$(window).ready(function () {
    $("html").PushMenu("updateSize");
});
$(window).resize(function () {
    $("html").PushMenu("updateSize");
});
$(function () {
    //$(".left-aside ,.aside-title-right").height($(".main-content").height());
    //body scrollbar
    //alert($(window).height() + "," + $("body").height())
    $(".right-aside").height($(window).height()).mCustomScrollbar(
    {
        scrollButtons: { enable: false },
        mouseWheel: true,
        mouseWheel: { deltaFactor: 90 }
    });
	$(".main-content-wrapper").mCustomScrollbar(
    {
        scrollButtons: { enable: false },
        mouseWheel: { deltaFactor: 90 },
		scrollRail: 0,
		//For landingpage
		callbacks:{
			onScroll:function(){
				var scrollTop = this.mcs.top;
				if ( $(window).width() < 1279) {
					if(scrollTop < -350){
					  $('.bet-option4 .wrap').css("z-index", "3");
					  $('.b3')
					  .delay(200)
					  .queue(function (next) { 
						$(this).fadeIn(400);
						next(); 
					  });
					  $('.statistics-select')
					  .delay(2200)
					  .queue(function (next) { 
						$(this).css('z-index', '4');
						next(); 
					  });
					  $('.statistics')
					  .delay(2200)
					  .queue(function (next) { 
						$(this).css('z-index', '3');
						next(); 
					  });
					  $('.b4,.c4_bubble,.c4_04,.btn-close')
					  .delay(2700)
					  .queue(function (next) { 
						$(this).fadeIn(400);
						next(); 
					  });
					}
				}
				
			}
		}
    });
	/*$(".left-aside").mCustomScrollbar(
    {
        scrollButtons: { enable: false },
		alwaysShowScrollbar:0,
        mouseWheel: { deltaFactor: 90 }
    });*/
    /*$(".right-aside").height($(window).height()).mCustomScrollbar(
    {
        theme: "dark",
        scrollButtons: { enable: false },
        mouseWheel: true,
        mouseWheel: { deltaFactor: 90 }
    });*/
    //menu
    /*$("html").PushMenu(); //綁開合按鈕
    $("html").PushMenu("updateSize");*/

    //公告換頁
    $(".page-wrap2").find("a").bind("click", function () {
        $(".page-wrap2 a").removeClass("active");
        var $this = $(this);
        $this.addClass("active");
        var index = $(this).index(),
            newTarget = $('.article').eq(index).slideDown();
        $('.article').not(newTarget).slideUp();
    });

    $("#news_box").bind("click", function () {
        marquee.ShowNewsList(1);
    });
	
	//click to show dropdown
	/*$(".mybet").click(function(){
		$("p").show();
	});
	
	$(".mybet").click(function(){
		$("p").hide();
	});*/
	$(".mybet").click(function(){
		$(this).addClass("on");
		$(".droplist").toggle();
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






