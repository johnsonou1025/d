// JavaScript Document

$(function(){
	//input 密碼欄位從文字變成數字
	$("#text2number").focus(function(){$(this).attr('type','number')})
	$("#text2number").focusout(function(){$(this).attr('type','text')})
	/*$("#input-password").click(function(){
		$(this).attr('type','number');
	})*/
	//eye 隱藏或顯示密碼
	$(".eye").click(function(){ 
		if($(this).hasClass("eye_close")){ 
			$(this).parent().find("input").attr('type','text');
			$(this).removeClass("eye_close")
		}else{
			$(this).parent().find("input").attr('type','password');
			$(this).addClass("eye_close")
		}			
	})	
})

// pop overlay 開關
$(function() {
    //----- OPEN
    $('[data-popup-open]').on('click', function(e)  {
        var targeted_popup_class = jQuery(this).attr('data-popup-open');
        $('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);

        e.preventDefault();
    });

    //----- CLOSE
    $('[data-popup-close]').on('click', function(e)  {
        var targeted_popup_class = jQuery(this).attr('data-popup-close');
        $('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);

        e.preventDefault();
    });
});


// section1 註冊pop overlay 成功後切換訊息
// $(function() {
// $('#reg-btn').click(function() {
// 	  $('#reg1').animate({opacity:'hide'},400);
// 	  $('#reg2').animate({opacity:'show'},400);
// 	  $(".regedit").children('p').animate({opacity:'hide'},400);
// 	  $(".regedit").children('span').animate({opacity:'hide'},400);

// });
// });
