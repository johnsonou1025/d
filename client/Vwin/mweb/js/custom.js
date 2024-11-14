// JavaScript Document

$(function(){
		//首頁選單;
		// $(".menuBoxBtn").click(function(){
		// 	if($(".menuBoxBtn").hasClass("open")){
		// 		$(".menuBoxBtn").removeClass("open");
		// 		//$(".menuBox").animate({ marginTop: '-150px'},500,function(){$(".menuArea").hide()});
		// 		$(".menuArea").slideUp('fast');
		// 	}
		// 	else{
		// 		$(".menuBoxBtn").addClass("open");
		// 		//$(".menuArea").show();
		// 		//$(".menuBox").animate({ marginTop: '0px'},500);
		// 		$(".menuArea").slideDown('fast');
		// 	}				
		// })
		$(".menuBoxBtn").click(function(){
				$(".menuArea").slideDown('fast');		
		})
		$(".menuBoxBtn-on").click(function(){
				$(".menuArea").slideUp('fast');		
		})
		//銀行勾選
		$(".tick li").click(function(){
			$(this).parent().find("li a.tick_on").removeClass("tick_on");
			$(this).children("a").addClass("tick_on");
		})	
		//流水百分比	
		$(".progress-demo").click(function(){
			$(".progress-bar-demo").animate({width:"100%"},5000)		
		})				
		//input 輸入框點擊後，預設文子移除	
		$("input").click(function(){ 
				$(this).val("")
		})
		$("textarea").click(function(){ 
				$(this).val("")
		})
		//點擊生日輸入欄位
		$("#birthday2DateSelect").find("#birthdayDate").parent().css({"display":"none","position":"absolute","top":"0","z-index":"-1"});
		$("#birthday2DateSelect").click(function(){
			$(this).find("#birthdayDate").parent().css('display','block');
			$(this).find("#birthdayDate").focus();	
		})
		$("#birthdayDate").focusout(function(){
			$("#birthday2DateSelect").find("#birthdayDateShow").html($(this).val());
			$(this).parent().css('display','none');
		})
		//點擊後focus在下拉選單
		$(".selectBtn").css('cursor','pointer');
		$(".selectHide").css({"position":"absolute","z-index":"-1","top":"0"});
		$(".selectBtn").click(function(){			
			$(".selectHide select").focus();
		})
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
		//vip內容顯示
		$(".toggleMenu li").next("div").hide();
		$(".toggleMenu li").click(function(){
			if($(this).hasClass("open")){}else{
				$(this).parent().children(".open").removeClass("open").next("div").slideUp("fast");
				$(this).addClass("open").next("div").slideDown("fast");				
			}			
		})

		
		//table開合
		var $tr = $(".table_style3 tr");
		var _count = $tr.length;	
		$tr.eq(0).siblings().hide();	
		$tr.eq(_count-1).show();	
		var tableOpen = false;
		$(".betting-detail").click(function(){					
				if(tableOpen==true)	{					
					i=0;						
					for(p=_count-2; p>0; p--){		
							$tr.eq(p).delay(50*i).fadeOut(100);									
							i++;									
					}
					//$tr.eq(_count-1).find("span").removeClass("active");
					tableOpen = false;
				}else{					
					for(i=0; i<_count; i++){
						$tr.eq(i).delay(50*i).fadeIn(100);
					}
					//var $open =$tr.eq(_count-1).find("span").addClass("active");
					tableOpen = true;					
				}				
		})
		
		//首頁輪播
		/*
		var _bannerNum=$(".heroBanner_box").find("li").length;
		var _bannerEq=0;
		var t;
		bannerPlay();
		function bannerPlay(){			
			if(_bannerEq+1>=_bannerNum){
				if(_bannerEq>=_bannerNum){
					_bannerEq=0;
					_bannerNextEq=_bannerEq+1;
				}else{
					_bannerNextEq=0
				}				
			}else{
				_bannerNextEq=_bannerEq+1
			};
			console.log("_bannerEq="+_bannerEq+"_bannerNextEq="+_bannerNextEq);
			$(".heroBanner_box li").eq(_bannerEq).animate({left:"-430"},function(){
				$(this).hide();
			})
			$(".heroBanner_box li").eq(_bannerNextEq).css("left","430px").show().animate({left:"0"})
			_bannerEq++;
			setTimeout(bannerPlay,5000);
		}		
		*/






		//jquery最後括弧
	})
	