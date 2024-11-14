// JavaScript Document

$(function(){		
			
		//密碼強度指針動畫，需載入jQueryRotateCompressed 2.1.js
		$(".pit").rotate({angle:80,animateTo:-80});
		//按鍵入數量指派指針位置
		$("#psw").change(function(){
			var pswNum =$('input[name="psw"]').val()
			if(pswNum.length<=6){
					$(".pit").rotate({duration:2000,animateTo:-80})
				}else if(pswNum.length<=9){
					$(".pit").rotate({duration:2000,animateTo:-40})
				}else if(pswNum.length<=12){
					$(".pit").rotate({duration:2000,animateTo:0})
				}else if(pswNum.length<=15){
					$(".pit").rotate({duration:2000,animateTo:40})
				}else{
					$(".pit").rotate({duration:2000,animateTo:80})
				}
			})			
			
			
			//密碼強度指針動畫2，需載入jQueryRotateCompressed 2.1.js
		$(".pit2").rotate({angle:230,animateTo:-50});
		//按鍵入數量指派指針位置
		$("#psw2").change(function(){
			var pswNum =$('input[name="psw2"]').val()
			if(pswNum.length<=6){
					$(".pit2").rotate({duration:2000,animateTo:-50})
				}else if(pswNum.length<=9){
					$(".pit2").rotate({duration:2000,animateTo:20})
				}else if(pswNum.length<=12){
					$(".pit2").rotate({duration:2000,animateTo:90})
				}else if(pswNum.length<=15){
					$(".pit2").rotate({duration:2000,animateTo:160})
				}else{
					$(".pit2").rotate({duration:2000,animateTo:230})
				}
			})		
			
		//jquery最後括弧
	})