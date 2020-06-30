$(function(){
	// 首頁彩色按鈕動態 開始	
	$("#sb-1 li").click(function() {
		n=$(this).index()+1;
		var shiconAnimation = anime({
		    targets: ".sh-icon.icon"+n,
		    scale: {
		    value: 0.85,
		    delay: 0,
		    duration: 150,
		    easing: 'easeInBack',
		    },
		    complete: function() {
		        anime({
		            targets: ".sh-icon.icon"+n,
		            scale: {
		                value: 1,
		                delay: 10,
		                duration: 150,
		                easing: 'easeOutBack',
		            },
		        });
		    },
		    autoplay: false,
		});
		shiconAnimation.play();
	});
	$("#sb-2 li").click(function() {
		n=$(this).index()+6;
		var shiconAnimation2 = anime({
		    targets: ".sh-icon.icon"+n,
		    scale: {
		    value: 0.8,
		    delay: 0,
		    duration: 150,
		    easing: 'easeInBack',
		    },
		    complete: function() {
		        anime({
		            targets: ".sh-icon.icon"+n,
		            scale: {
		                value: 1,
		                delay: 10,
		                duration: 150,
		                easing: 'easeOutBack',
		            },
		        });
		    },
		    autoplay: false,
		});
		shiconAnimation2.play();
	});
	// 首頁彩色按鈕動態 結束

});

/*首頁輪播*/
    $(window).load(function() {
      $('.flexslider').flexslider({
        animation: "fade",/*fade or slide 動態淡入淡出或是滑動*/
        direction: "horizontal", /*horizontal or vertical 垂直水平*/   
        slideshowSpeed: 3000,/*輪播速度*/
        pauseOnHover:"true",/*true or false 移入內容是否停止*/
        mousewheel: true, 
        controlNav: false, 
        directionNav: false, 
        touch:true, 
      });
    });