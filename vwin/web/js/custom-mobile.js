// JavaScript Document

$(function() {
    //首頁廣告選單
    var heroNavAllNum = $(".adSlider-2 li").length;
    //菜單移入動作
    $(".adSlider-2 li").hoverIntent({
            interval: 500,
            over: function() {
                //取得滑鼠滑入時,被滑入菜單第幾位
                var heroNavNum = $(this).index();
                var heroNavNumActive = $(".adSlider-2 li.heroNavActive").index();
                if (heroNavNum > heroNavNumActive) {
                    //菜單變化
                    $(this).parent().children().removeClass("heroNavActive");
                    $(this).addClass("heroNavActive");
                    //廣告變化
                    $(".hero-kv ul").children(".slide-active").removeClass("slide-active").stop().animate({ left: "-1920px" }, 500,
                        function() {
                            $(this).hide();
                            //移除主視覺文字內容
                            $(this).children("div").eq(0).hide();
                            $(this).children("div").eq(1).children("div").hide();
                        }
                    );
                    $(".hero-kv ul li").eq(heroNavNum).addClass("slide-active").stop().show().css('left', '1920px').animate({ left: "0" }, 500, function() { textIn(heroNavNum); })
                } else {
                    $(this).parent().children().removeClass("heroNavActive");
                    $(this).addClass("heroNavActive");
                    //廣告變化
                    $(".hero-kv ul").children(".slide-active").removeClass("slide-active").stop().animate({ left: "1920px" }, 500,
                        function() {
                            //隱藏主視覺文字內容
                            $(this).hide();
                            //隱藏主視覺文字內容										
                            $(this).children("div").eq(0).hide();
                            $(this).children("div").eq(1).children("div").hide();
                        }
                    );
                    $(".hero-kv ul li").eq(heroNavNum).addClass("slide-active").stop().show().css('left', '-1920px').animate({ left: "0" }, 500, function() { textIn(heroNavNum); })
                }
            },
            timeout: 500,
            out: function() {}
        })
        //下一張按鈕動作
    $(".hero-slide-2 div.next").click(function() {
        var heroNavNum = $(".adSlider-2 li.heroNavActive").index() + 1;
        if (heroNavNum == heroNavAllNum) {
            heroNavNum = 0;
        }
        //菜單變化
        $(".adSlider-2 li").parent().children().removeClass("heroNavActive");
        $(".adSlider-2 li").eq(heroNavNum).addClass("heroNavActive");
        //廣告變化
        $(".hero-kv ul").children(".slide-active").stop().animate({ left: "-1920px" }, 500,
            function() {
                //隱藏主視覺文字內容
                $(this).hide();
                //隱藏主視覺文字內容										
                $(this).children("div").eq(0).hide();
                $(this).children("div").eq(1).children("div").hide();
            }
        );
        $(".hero-kv ul li").eq(heroNavNum).addClass("slide-active").stop().show().css('left', '1920px').animate({ left: "0" }, 500, function() { textIn(heroNavNum); })
    })
    $(".hero-slide-2 div.prev").click(function() {
        var heroNavNum = $(".adSlider-2 li.heroNavActive").index() - 1;
        if (heroNavNum < 0) {
            heroNavNum = heroNavAllNum - 1;
        }
        //菜單變化
        $(".adSlider-2 li").parent().children().removeClass("heroNavActive");
        $(".adSlider-2 li").eq(heroNavNum).addClass("heroNavActive");
        //廣告變化
        $(".hero-kv ul").children(".slide-active").stop().animate({ left: "1920px" }, 500,
            function() {
                //隱藏主視覺文字內容
                $(this).hide();
                //隱藏主視覺文字內容										
                $(this).children("div").eq(0).hide();
                $(this).children("div").eq(1).children("div").hide();
            }
        );
        $(".hero-kv ul li").eq(heroNavNum).addClass("slide-active").stop().show().css('left', '-1920px').animate({ left: "0" }, 500, function() { textIn(heroNavNum); })
    })



    //主視覺文字內容動畫
    textIn(0);

    function textIn(heroNavNum) {
        var time = 0;
        var $text = $(".text" + heroNavNum).children("div");
        if (heroNavNum == 1) {
            $(".hero-point-" + heroNavNum).css({ "bottom": "-52px", "opacity": 0 }).show().animate({ bottom: 25, opacity: 1 }, 800);
            $text.each(function() {
                $(this).delay(time).css({ "left": "45%", "opacity": 0 }).show().animate({ left: "50%", opacity: 1 }, 600);
                time += 200;
            });
        } else {
            $(".hero-point-" + heroNavNum).css({ "bottom": "-52px", "opacity": 0 }).show().animate({ bottom: 0, opacity: 1 }, 800);
            $text.each(function() {
                $(this).delay(time).css({ "left": "45%", "opacity": 0 }).show().animate({ left: "50%", opacity: 1 }, 600);
                time += 200;
            });
        }
    }

    //連結到各介紹區塊	
    $(".mobile-link a").click(function() {
        var hrefName = $(this).attr("href");
        var $hrefTop = ($(hrefName).position()).top - 115;
        $("html,body").animate({
            scrollTop: $hrefTop
        }, 1000);
    })



    //七大優勢動態
    $(".mobile-7 li").mouseenter(
        function() {

            var hoverNum = $(this).index();
            var hoverPreNum = hoverNum - 1;
            var hoverNextNum = hoverNum + 1;
            $(".mobile-7").stop().animate({ width: "972px", marginLeft: "-486px"}, 200)
            $(".mobile-7 li").removeClass("active").stop().animate({ width: "107px", marginTop: "17px", marginLeft: "0" }, 200).children("h4").stop().animate({ fontSize: "16px" }, 200)
            $(".mobile-7 li").eq(hoverNum).addClass("active").stop().animate({ width: "140px", marginTop: 0 }, 200, function() {
                var _height = $(this).height();
                $(this).children('.mobile-msg').stop().css({ "bottom": _height / 1.1, opacity: 0 }).animate({
                    "bottom": _height,
                    opacity: 1
                }, "fast");
            })
            $(".mobile-7 li").eq(hoverNum).children("h4").stop().animate({ fontSize: "20px" }, 200)

        }
        /*
        function(){
        	var hoverNum = $(this).index();
        	var hoverPreNum = hoverNum - 1;
        	var hoverNextNum = hoverNum + 1;
        	$(".mobile-7").stop().animate({width:"972px",marginLeft:"-486px"},200)
        	$(".mobile-7 li").removeClass("active").stop().animate({width:"107px",marginTop:"17px",marginLeft:"0"},200).children("h4").stop().animate({fontSize:"16px"},200)
        	$(".mobile-7 li").eq(hoverNum).addClass("active").stop().animate({width:"140px",marginTop:0},200)
        	$(".mobile-7 li").eq(hoverNum).children("h4").stop().animate({fontSize:"20px"},200)
        	$(this).parent().find(".mobile-msg").removeClass("active").stop().css({"opacity":0,"top":"20px"}).hide();
        	$(this).children(".mobile-msg").addClass("active").show().stop().animate({opacity:1,top:"0px"},500)
        	if(hoverPreNum>=0){
        		$(".mobile-7 li").eq(hoverPreNum).stop().animate({width:"120px",marginTop:"10px"},200)
        		$(".mobile-7 li").eq(hoverPreNum).children("h4").stop().animate({fontSize:"18px"},200)
        	}else{}
        	if(hoverNextNum<=6){
        		$(".mobile-7 li").eq(hoverNextNum).stop().animate({width:"120px",marginTop:"10px"},200)
        		$(".mobile-7 li").eq(hoverNextNum).children("h4").stop().animate({fontSize:"18px"},200)
        	}else{}					
        }*/
    )
    $(".mobile-7 li").mouseleave(
            function() {
            	var _height = $(this).height();
                $(this).children('.mobile-msg').stop().animate({ opacity: 0,"bottom": _height / 1.1 }, "fast");
            }
            /*
            function(){
            	$(".mobile-7 li").removeClass("active").stop().animate({width:"107px",marginTop:"17px",marginLeft:"0"},200).children("h4").stop().animate({fontSize:"16px"},200);
            	$(this).parent().find(".mobile-msg").removeClass("active").stop().css({"opacity":0,"top":"20px"}).hide();
            	$(".mobile-7").stop().animate({width:"902px",marginLeft:"-451px"},200)
            }
            */
        )
        //jquery最後括弧
})
$(window).scroll(function(mobileLinkTop) {
    //文字連結顯示或隱藏	

    //if ($(window).scrollTop()>690){
    //		$(".mobile-link").css("position","fixed");
    //	}else{
    //		$(".mobile-link").css("position","static");
    //	}
    //各介紹區塊位置定位
    var a = ($(".mobileBox-1").position()).top;
    var b = ($(".mobileBox-2").position()).top;
    var c = ($(".mobileBox-3").position()).top;
    var d = ($(".mobileBox-4").position()).top;
    var showPosition = $(window).scrollTop() + $(window).height() / 2;
    if (showPosition > a) {
        $(".mobile-image-ios").animate({ left: 0, opacity: 1 }, 1000)
    };
    if (showPosition > b) {
        $(".mobile-image-poker").animate({ top: 0, opacity: 1 }, 1000)
        $(".mobile-image-android").animate({ bottom: 0, opacity: 1 }, 1000)
    };
    if (showPosition > c) {
        $(".mobile-image-wap").animate({ top: 0, opacity: 1 }, 1000,
            function() {
                $(".magnifier").stop().animate({ width: "65%", marginLeft: "-48%", top: "8%" }, 500, "easeInOutBack")
            }
        )
    };
    if (showPosition > d) {
        $(".mobile-image-casino").animate({ top: 60 }, 2000, "easeOutBounce");
        $(".mobile-image-sport").delay(200).animate({ top: 80 }, 2000, "easeOutBounce");
        $(".mobile-image-dice1").delay(100).animate({ top: 280 }, 2000, "easeOutBounce");
        $(".mobile-image-dice2").delay(500).animate({ top: 60 }, 1500, "easeOutBounce");
        $(".mobile-intro-3").delay(1500).animate({ bottom: "0px", opacity: 1, top: 0 }, 500,
            function() {
                $(".mobile-games").animate({ width: "38%", marginLeft: "13%", top: "-3px" }, 700, "easeInOutBack");
            }
        )
    };









    //window scroll end
});
