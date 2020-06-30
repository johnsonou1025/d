$(function(){
	// input 消除動態
	$("input").focus(function() {
		$(".icon-clear").addClass('invisible');
		$(this).parents(".field").children('.icon-clear').removeClass('invisible');
	 // 當input被點擊.找他的父輩叫field.在從父輩找子輩叫icon-clear.接著移除invisible 
	});
	$("input").focusout(function() {
		// $(this).parents(".field").children('.icon-clear').addClass('invisible');
	});
	// OVER

	// input 密碼開啟關閉
	$(".pass-input").focus(function() {
		$(this).attr('type', 'text');
		$(this).parents(".field").find("a .pwd-icon i").addClass("icon-pwd-show");
	});
	$(".pass-input").focusout(function() {
		$(this).attr('type', 'password');
		$(this).parents(".field").find("a .pwd-icon i").removeClass("icon-pwd-show");
	});
	$(".pwd-icon i").click(function() {
		if ($(this).hasClass("icon-pwd-show")) {
			$(this).removeClass("icon-pwd-show");
			$(this).parents(".field").find(".field-control input").attr('type', 'password');
		} else {
			$(this).addClass("icon-pwd-show");
			$(this).parents(".field").find(".field-control input").attr('type', 'text');
		}
	});
	// OVER

	// input 清除欄位
	$(".icon-clear").click(function() {
		// alert("123");
		$(this).parents(".field").find(".field-control input").val("");
	});
	// OVER

	var b = document.documentElement;
	b.setAttribute('data-useragent',  navigator.userAgent);
	b.setAttribute('data-platform', navigator.platform );
	b.className += ((!!('ontouchstart' in window) || !!('onmsgesturechange' in window))?' touch':'');
	
});