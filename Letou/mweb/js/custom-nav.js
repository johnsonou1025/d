$(function(){

	// 首頁動態NAV
	// 主要MENU進場
	$("#icon-navhome").click(function() {
			if ($(".header-warp").hasClass("open")) {
				$("#AAA").fadeIn();
				$(".header-warp").removeClass("open");
				$(".navhome-warp").removeClass("open");
				$(".header-warp").addClass("close");
				$(".navhome-warp").addClass("close");
			} else {
				$(".header-warp").addClass("open");
				$(".navhome-warp").addClass("open");
				$(".header-warp").removeClass("close");
				$(".navhome-warp").removeClass("close");
				$("#AAA").delay(300).fadeOut();
			}
		});
	
	$("#navhome-back").click(function() {
		$("#AAA").fadeIn();
		$(".header-warp").removeClass("open");
		$(".navhome-warp").removeClass("open");
		$(".header-warp").addClass("close");
		$(".navhome-warp").addClass("close");
		$(".navhome-warp").find(".sub-menu-warp").removeClass("open");
	});
	// OVER

	// 首頁次選單動態
	$(".has-submenu").click(function() {
		$(this).parent().children('li').removeClass('active');
		$(this).parents(".navhome-warp").find(".sub-menu-warp").removeClass("close");
		$(this).parents(".navhome-warp").find(".sub-menu-warp").addClass("open");
		$(this).addClass('active');
	});
	$(".no-submenu").click(function() {
		$(this).parent().children('li').removeClass('active');
		$(this).parents(".navhome-warp").find(".sub-menu-warp").removeClass("open");
		$(this).parents(".navhome-warp").find(".sub-menu-warp").addClass("close");
	});

	// 第三層選單
	$(".sub-menu-warp ul li").click(function() {
	  if ($(this).hasClass("active")) {} else {
	  	if ($(this).children("div").hasClass("openBox")) {
	  		$(this).toggleClass("active").siblings().removeClass("active").children(".openBox").css("height", 0);
		    liNum = $(this).find(".openBox li").length;
		    liHeight = $(".openBox").find("li").eq(0).outerHeight();
		    $(this).children(".openBox").css("height", liHeight * liNum)
			} else {
	  	}
	    
	  }
	});

});