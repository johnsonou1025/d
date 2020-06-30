$(function() {
    var sectionHeight = $(window).height();
    $(".section").css({ "height": sectionHeight });
    $(".content").css({ "height": sectionHeight });
    $(".section-wrap").css({ "transform": "translate3d(0px,-" + sectionHeight * ($(".section-menu li.active").index()) + "px,0px)" })

    //左側頁面滾動動態
    $(".section-menu li").click(function() {
        $(this).addClass('active').siblings('').removeClass('active');
        $(".section-wrap").css({ "transform": "translate3d(0px,-" + sectionHeight * ($(this).index()) + "px,0px)" })
        $(".section").eq($(this).index()).addClass('active').siblings('').removeClass('active');
        // page1
	    if($(".section.page1").hasClass('active')){
	    	$(".page1-select-wrap>div:first-child").addClass('active');
	    }else{
	    	$(".page1-select-wrap>div").removeClass('active');
	    }
	    //goNext 顯示與隱藏
	    if($(".section.active").index()>=$(".section").length-1){
	    	$(".section-goNext").hide();
	    }else{
	    	$(".section-goNext").show();
	    }
    });

    //回到頂點
    $(".side-menu .goTop").click(function() {
        $(".section-menu li:first-child").addClass('active').siblings('').removeClass('active');
        $(".section-wrap").css({ "transform": "translate3d(0px,0px,0px)" })
    });

    //page4
    var page4SelectWidth = $(".page4-select-wrap").width();
    $(".page4-select").css({"width":page4SelectWidth*3})
    $(".page4-select>div").css({"width":page4SelectWidth});
    $(".page4-menu li").click(function(event) {
    	$(this).addClass('active').siblings('').removeClass('active');
    	var page4MenuEq = $(".page4-menu li.active").index();
    	$(".page4-select").css({ "transform": "translate3d(-"+page4SelectWidth*page4MenuEq+"px,0px,0px)" });
    	$(".page4-select>div").eq(page4MenuEq).addClass('active').siblings('').removeClass('active');
    });

    //page2
    var page2SelectWidth = $(".page2-select-wrap").width();
    $(".page2-select>div").css({"width":page2SelectWidth});
    var page2Num = $(".page2-select .grid").length;
    $(".page2-select").css({"width":page2SelectWidth*page2Num});
    $(".prev").click(function() {
    	if($(".page2-select>.active").index() != 0){
    		$(".page2-select>.active").prev().addClass('active').siblings('').removeClass('active');
    		$(".page2-select").css({ "transform": "translate3d(-" + page2SelectWidth * ($(".page2-select>.active").index()) + "px,0px,0px)" })
    		console.log("prev");
    	}
    });
    $(".next").click(function() {
    	if($(".page2-select>.active").index() < $(".page2-select>.grid").length-1){
    		$(".page2-select>.active").next().addClass('active').siblings('').removeClass('active');
    		$(".page2-select").css({ "transform": "translate3d(-" + page2SelectWidth * ($(".page2-select>.active").index()) + "px,0px,0px)" })
    		console.log("next");
    	}
    });

    // page1
    if($(".section.page1").hasClass('active')){
    	$(".page1-select-wrap>div:first-child").addClass('active');
    };
    setInterval(function(){
    	if($(".page1-select-wrap>.active").index()>=$(".page1-select-wrap>div").length-1){
    		$(".page1-select-wrap>div").eq(0).addClass('active').siblings('').removeClass('active');
    	}else{
    		$(".page1-select-wrap>.active").next().addClass('active').siblings('').removeClass('active');
    	}
    	
    },3000);

    //goNext 到下一頁的按鈕行為
    $(".section-goNext").click(function() {
    	$(".section-menu li.active").next().trigger('click');
    	if($(".section-menu li.active").index()>=$(".section-menu li").length-1){
    		$(this).hide();
    	}else{
    		$(this).show();
    	}
    });



    // console.log();
})



$(window).resize(function(event) {
    var sectionHeight = $(window).height();
    $(".section").css({ "height": sectionHeight });
    $(".content").css({ "height": sectionHeight });
    $(".section-wrap").css({ "transform": "translate3d(0px,-" + sectionHeight * ($(".section-menu li.active").index()) + "px,0px)" })
    //滾動動態
    $(".section-menu li").click(function() {
        $(this).addClass('active').siblings('').removeClass('active');
        $(".section-wrap").css({ "transform": "translate3d(0px,-" + sectionHeight * ($(this).index()) + "px,0px)" })
    });
    //page4
    $(".page4-select>div").css({"width":$(".page4-select-wrap").width()});
});