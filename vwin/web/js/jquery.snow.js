$(function(){
	documentHeight=$(document).height();
	documentWidth=$(document).width();
	minSize=20;//雪最小尺寸
	maxSize=40;//雪最大尺寸
	newOn=300;//每顆雪間隔時間
	flakeColor="#FFFFFF";//雪的顏色
	var autoSnow= setInterval(snow,newOn);	 //不停下雪
	$(".snowOn").click(function(){
		if($(this).hasClass("snowOff")){//開始下雪
			$(this).stop().animate({top:5}).animate({top:0},"fast").removeClass("snowOff");		
			autoSnow= setInterval(snow,500);					
		}
		else{//停止下雪
			$(this).stop().animate({top:5}).animate({top:-20},"fast").addClass("snowOff");			
			clearInterval(autoSnow);	
		}		
	})
	//jQuery結束點
})
//下雪
function snow(){	
		var $flake=$('<div id="flake" />').css({'position':'absolute','top':'-50px'}).html('.');
		var startPositionLeft=Math.random()*documentWidth-100;
		var startOpacity=0.5+Math.random();
		var sizeFlake=minSize+Math.random()*maxSize;
		var endPositionTop=650-40;
		var endPositionLeft=startPositionLeft-100+Math.random()*200;
		var durationFall=documentHeight*5+Math.random()*1000;
		$flake.clone().appendTo("body").css({left:startPositionLeft,opacity:startOpacity,'font-size':sizeFlake,color:flakeColor}).animate({top:endPositionTop,left:endPositionLeft,opacity:0},durationFall,'linear',function(){$(this).remove()})
}