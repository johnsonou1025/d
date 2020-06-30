// JavaScript Document

$(function(){
		//熱門推薦
		$(".game-recom").find("li").hide();
			rcmd();
		function rcmd(){
			$(".game-recom li:hidden:first").fadeIn();
			setTimeout(rcmd,200);
		}
	
	//遊戲選單
	
//	$(".game-list-menu li").mouseenter(function(){ 
//		if($(this).hasClass("active")){}else{
//			$(this).stop().animate({ 'background-color': 'rgba(255, 255, 255, 0.3)' },"fast")}
//		}		
//	)
//	$(".game-list-menu li").mouseleave(function(){
//		if($(this).hasClass("active")){}else{
//			$(this).stop().animate({ 'background-color': 'rgba(0, 0, 0, 0.6)' },"fast")}
//		}		
//	)
	
	$(".game-list-menu li").click(function(){
		//$(this).parent().children(".active").stop().animate({ 'background-color': 'rgba(0, 0, 0, 0.6)' },"fast").removeClass("active");
		//$(this).addClass("active").stop().animate({ 'background-color': 'rgba(255, 255, 255,.3)' },"fast");
		$(this).parent().children(".active").removeClass("active");
		$(this).addClass("active");		
	})
	
	$(".game-list-menu li").mouseenter(function(){
		if($(this).hasClass("active")){}
		else{
			$(this)	.children("p").counterUp({
				delay: 10, // the delay time in ms
				time: 200 // the speed time in ms
			});	
		}		
	})
	
	//按鈕動畫
	// $(".game-btn-try").css("opacity","0");
	// $(".game-img-black").css("opacity","0");
	$(".game-list li").mouseenter(function(){				
		var $this = $(this);
		var goodsWidth = $this.find(".game-img-black").width();
		var goodsHeight = $this.find(".game-img-black").height();
		//$this.find(".game-img-goods").css({"width":goodsWidth,"height":goodsHeight});
		$this.find(".game-img-black").stop().animate({opacity:1},"fast");		
		if($this.find(".game-btn-play").parent().children().hasClass("game-btn-try")){
			$this.find(".game-btn-play").stop().show().delay(100).animate({top:"15px",opacity:1},"fast");
		}
		else{
			$this.find(".game-btn-play").stop().show().delay(100).animate({top:"25px",opacity:1},"fast");
		}
		$this.find(".game-btn-try").stop().delay(100).animate({top:"92px",opacity:1},"fast");
	})
	$(".game-list li").mouseleave(function(){
		var $this = $(this);
		$this.find(".game-img-black").stop().animate({opacity:0});
		$this.find(".game-btn-play").stop().animate({"top":"30px","opacity":"0"},"fast",function(){$(this).hide()});
		$this.find(".game-btn-try").stop().animate({top:"108px","opacity":"0"},"fast");
		//$this.find(".game-img-goods").css({"width":"auto","height":"auto"});
	})	
	
	//遊戲排列樣式
	var $gameListMany = $("#gameList li").size();
	var $windowWidth = $(window).width();
	if($windowWidth>=1200){
		for(n=4;n<$gameListMany;n=n+5){
			//$("#gameList li").parent().find(".last").removeClass("last");		
			$("#gameList li").eq(n).addClass("last");		
		}		
	}
	else if($windowWidth<1200){
		for(n=3;n<$gameListMany;n=n+4){
			//$("#gameList li").parent().find(".last").removeClass("last");	
			$("#gameList li").addClass("cols4").eq(n).addClass("last");	
		}		
	}
	//隨視窗尺寸變化遊戲排列樣式
	$(window).resize(function(){
		var $windowWidth = $(window).width();
		if($windowWidth>=1200){
			if($("#gameList li").eq(4).hasClass("last")){}
			else{
				$("#gameList li.cols4").removeClass("cols4");	
				$("#gameList li.last").removeClass("last");		
				for(n=4;n<$gameListMany;n=n+5){					
					$("#gameList li").eq(n).addClass("last");		
				}
			}					
		}
		else if($windowWidth<1200){
			if($("#gameList li").eq(2).hasClass("last")){}			
			else{
				$("#gameList li.last").removeClass("last");	
				for(n=3;n<$gameListMany;n=n+4){
					$("#gameList li").addClass("cols4").eq(n).addClass("last");						
				}		
			}			
		}	
	})
	
	
	//搜尋功能
	$(".game-search").click(function(){
		$(this).children("input").focus().val("");
		$(this).children("input").eq(0).val("");
		$(this).children("ul").fadeIn();
	})
	$(".game-search input").blur(function(){
		$(this).parent().children("ul").fadeOut();
		$(".game-search").children("input").eq(0).val("快速搜尋");
	})	
	//累計奬池
	var jackpotsEq = -1;	
	var jackpotsLenght = $(".jackpots-goods li").size();	
	jackpots()
	function jackpots(){
		//呼叫拉霸
		slotBar()	;		
		
		//獎池遊戲輪播
		if(jackpotsEq+1>=jackpotsLenght){jackpotsEq = -1}
		$(".jackpots-goods li").eq(jackpotsEq).show().animate({top:"92px"},800,"easeOutElastic");
		$(".jackpots-money li").eq(jackpotsEq).hide();
		$(".jackpots-goods li").eq(jackpotsEq+1).show().css("top","-92px").animate({top:"0px"},800,"easeOutElastic");	
		$(".jackpots-money li").eq(jackpotsEq+1).show().find("span").counterUp({
			delay: 10, // the delay time in ms
			time: 500 // the speed time in ms
		});
		jackpotsEq++		
		var jackpotsTime = setTimeout(jackpots,5000);
	}	
	//拉霸動畫
	var slotBarX=0;
	function slotBar(){
			slotBarX = slotBarX-22;
			$(".slot-bar").css("background-position",slotBarX+"px 0px");
			var slotBarTime=setTimeout(slotBar,16);
			if(slotBarX<=-22*16){
				slotBarX=0;
				clearTimeout(slotBarTime);
			}
		}
	
	//最新幸運星動畫
	var n = 0;
	var winnersLenght = $(".winners-list li").size();		
	winner()			
	function winner(){	
			n1=n;
			n2=n+1;
			n3=n+2;
			n4=n+3;
		if(n>=winnersLenght){	
			n=0;	
			n1=n;
			n2=n+1;
			n3=n+2;
			n4=n+3;
		}
		else if(n+1>=winnersLenght){
			n2=0;
			n3=1;
			n4=2;
		}		
		else if(n+2>=winnersLenght){
			n3=0;
			n4=1;
		}	
		else if(n+3>=winnersLenght){
			n4=0;			
		}		
		$(".winners-list").children("li").hide();		
		$(".winners-list").children("li").eq(n1).show().css("top","124px");		
		$(".winners-list").children("li").eq(n2).show().css("top","62px");	
		$(".winners-list").children("li").eq(n3).show().css("top","0");	
		$(".winners-list").children("li").eq(n4).show().css("top","-62px");
		//$(".winners-list").children("li").eq(n1).animate({left:"282px"},500,function(){$(this).hide().css("left",0)})		
		//$(".winners-list").children("li").eq(n2).delay(500).animate({top:"124px"},500,"easeOutBounce")	
		$(".winners-list").children("li").eq(n2).delay(100).animate({top:"124px"},500,"easeOutBounce",function(){$(".winners-list").children("li").eq(n1).hide()})
		$(".winners-list").children("li").eq(n3).delay(200).animate({top:"62px"},500,"easeOutBounce")
		$(".winners-list").children("li").eq(n4).delay(300).animate({top:"0px"},500,"easeOutBounce")
		n++
		//$(".winners-list").children("li").eq(2).delay(1000).animate({top:"-124px"},1000,"easeOutBounce")	
		setTimeout(winner,5000);
	}
	//排行榜
	$(".game-list li").hover(
		function(){
			$(this).children(".goods-intro").fadeIn(200);	
		},
		function(){
			$(this).children(".goods-intro").fadeOut(200);		
		}	
	)
	
		
	//jquery最後括弧
})
//HTML載完後執行
$(window).load(function(){
		//game-block最小高度為game-block-right
		//var rightBlockTop = ($(".game-block-right").position()).top;
//		var rightBlockHeight = $(".game-block-right").height();
//		$(".game-block").css("min-height",rightBlockTop+rightBlockHeight)
})

							
