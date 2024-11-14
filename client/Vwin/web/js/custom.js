// JavaScript Document

$(function(){
	//語系選擇視窗	
		$(".lg").click(function(){
			if($(this).children(".lg-select:hidden").length){
				$(this).children(".lg-select").slideDown();
				clsarea2($(this).children(".lg-select"));
			}else{
				$(this).children(".lg-select").slideUp();	
				removeclsarea();//移除"收起選單區塊"			
			}
		})
	
	//菜單欄動作
	$(".nav-items ul li").click(function(){
			$(this).parents().find("li a").removeClass("active");
			$(this).children("a").addClass("active");
			})	
			
		//圖型漸變效果		
		$(".ahover").bind("mouseover",function(){
				$(this).stop().animate({
					opacity:"1"
				});
			})
		$(".ahover").bind("mouseout",function(){
				$(this).stop().animate({
					opacity:".5"
				});
			})
			
		//按鈕圓角，需載入jquery.corner.js
		$(".btn1").corner("left 20px");
		$(".btn2").corner("right 20px");
		$(".btn3").corner("16px");
		$(".btn4").corner("20px");
		$(".btn5").corner("20px");
		$(".newText").corner("10px");
		$(".help").corner("10px");
		
		//check圖片改變
		$(".check").click(function(){
			if($(this).hasClass("checked")){
				$(this).removeClass('checked')
				}else{
					$(this).addClass('checked')
					}
			})
		
		//下拉選單效果	
		$(".slt").find(".slt-ct").hide();	
		$(".slt").click(function(){
			if($(this).children(".slt-ct:hidden").length){
				$(this).children(".slt-ct").slideDown();
				clsarea2($(this).children(".slt-ct"));
			}else{
				$(this).children(".slt-ct").slideUp();	
				removeclsarea();//移除"收起選單區塊"			
			}
		})
		//下拉選單選擇事件
		$(".slt-ct ul li").click(function(){
			$(this).parents(".slt").children(".slt-text").text($(this).children("span").text())
			
		})
		
		
		//input按下事件
		$(".wrongMsg").css('display','none');
		$("input").mousedown(function(){
			$(".wrongMsg").css('display','none');
			$(this).parent().find(".wrongMsg").css('display','block');	
			$(this).val("");	
			$(this).parent().find(".test").css('display','none');//測試用		
			});		
		
		//登入會員資訊欄變化
		var userNameWith=$(".icon_cls").outerWidth(true)+$(".psl-name").outerWidth()+$(".lgo").outerWidth();
		var userContrlWith=$(".icon_cls").outerWidth(true)+$(".psl-info").outerWidth()+$(".lgo").outerWidth();	
		$(".psl-name").css('display','none');
		$(".info-customer").find(".icon_cls").addClass("icon_opn")
		$(".info-customer").click(function(){
			if($(".psl-name:hidden").length){
				$(this).children(".btn4").animate({width:userNameWith});
				$(".icon_cls").removeClass('icon_opn');				
				$(".psl-info").css('display','none');
				$(".psl-name").css('display','block');
				}else{
				$(this).children(".btn4").animate(
				{width:userContrlWith},
				{complete: function () {$(".psl-info").css('display','block');}}//執行完動畫才跑出欄位
				);
				$(".icon_cls").addClass('icon_opn');	
				$(".psl-name").css('display','none');
				}			
			})
			
		//會員中心選單按鈕
		//第一次判斷時
		
		if($(".menu").height()>$(".mc-rtct").height()){
			$(".mc-rtct").addClass("absl");
		}else{
			$(".menu").addClass("absl");
		}
		$(".menu").children(".active").find("ul").show();	
				
		//按下mn1按鈕後判斷
		$(".mn1").click(function(){
				$(".mc-rtct").addClass("absl");				
				if($(this).hasClass("active")){	
						$(".mc-rtct").removeClass("absl");						
						}
				else{
						$(".menu").removeClass("absl");
						$(this).parent().find(".mn1").removeClass("active").find("ul").slideUp();
						$(this).addClass("active").find("ul").hide();
						$(this).addClass("active").find("ul").slideDown("fast",function(){
								//會員中心選單與內容高度	
								$(".menu").removeClass("absl");
								$(".mc-rtct").removeClass("absl");					
								if($(".menu").height()>$(".mc-rtct").height()){
										$(".mc-rtct").addClass("absl");
								}else{
										$(".menu").addClass("absl");
								}										
						});			
				}				
		})	
		
		//會員中心-提款密碼提示視窗	
		$(".spBox1").hide();
		$(".spBtn1").click(function(){
				$(".spBox1").show();	
				clsarea($(".spBox1"));	
		});
		
		
		//小遊戲-熱門遊戲推薦
		$(".rcmd").find(".ggd").hide();
		 rcmd();
		function rcmd(){
			$(".ggd:hidden:first").fadeIn();
			setTimeout(rcmd,200);
			}
/*		
		//小遊戲選單，需載入jquery.easing.min.js
		$(".gmn").find("li").mousedown(function(){
			$(this).parent().find(".active").stop().animate({width:'15.33%'},500, "easeOutBounce").removeClass("active");
			$(this).stop().animate({width:'23%'},500, "easeOutBounce").addClass("active");
			})
*/						
		//分頁效果
		$(".pgnt").find("li").click(function(){
			$(this).parent().find(".active").removeClass("active");
			$(this).addClass("active");
			})
		
		//驗證碼重新發送
		$(".wrongMsg2").hide();	
		var rsdNum = 2;
		$(".re-send").click(function(){				
			if(rsdNum <= 0){
				$(this).find(".wrongMsg2").hide();		
				$(this).find(".rsd-text").text("已達發送上限");	
				$(this).find(".icon_enter3").addClass('icon_dsab').removeClass("icon_enter3");
				$(this).addClass('dsab');
				}else{
					$(this).find(".wrongMsg2").show();			
					$(this).find(".rsd-text").text("剩於發送次數x"+rsdNum);	
					rsdNum--;
				}			
			})
					
		//推薦朋友
		$(".gtbns").find("h5").hide();
		$(".gtbns").hover(
			function(){
				$(".gtbns").find("h5").css('display','inline-block');	
			},function(){
				$(".gtbns").find("h5").hide();	
			}
		)		
				
		$(".ivt_iframe").hide();		
		$(".ivt_btn").click(function(){			
			if($(this).find(".ivt_iframe").is(":visible")){
				$(".ivt_iframe").hide();
				$(".clsarea").hide();
				removeclsarea();//移除"收起選單區塊"
				}else{
					$(".ivt_iframe").show();
					$(".clsarea").show();
					clsarea($(".ivt_iframe"));//增加"收起選單區塊"								
				}		
			})	
			
		
						
		//最新優惠-內容縮放效果
		var pmt_info_height=$(".pmt_info_ct").outerHeight();
		$(".pmt_info_ct").css('overflow','hidden').css('height','324px');
	$(".opnBtn a.btn4").click(function(){			
			var info_original_height=$(this).parent().parent().children(".pmt_info_ct").css('height','100%');
			var info_height=info_original_height.outerHeight();			
			if($(this).parent().parent().children(".pmt_info_ct").hasClass("active")){				
				$(this).parent().parent().children(".pmt_info_ct").animate({height:'324px'}).removeClass("active");
				$(this).find(".icon_cls").removeClass("icon_opn")
			}else{
				$(this).parent().parent().children(".pmt_info_ct").css('height','324px');
				$(this).parent().parent().children(".pmt_info_ct").animate({height: info_height}).addClass("active");				
				$(this).find(".icon_cls").addClass("icon_opn")
			}
		})
		
		
		//資金管理
		$(".fd-mn2").find("div").css("width","0");
		$(".fd-mn2").find("div").each(function(i) {
				var fd_mn2_sec = 2000 / 100;						
				$(this).delay((fd_mn2_sec*9)/2*i).animate({"width":"11.11%"},fd_mn2_sec*9);            
        });

		//radio選取功能
		$(".radio").click(function(){
			if($(this).parent().hasClass(".radioed")){
				$(this).parent(".radioBox").find(".radioed").removeClass("radioed");
				$(this).addClass("radioed");	
			}else{
				$(this).parent().parent().parent().children().children().children(".radioed").removeClass("radioed");
				$(this).addClass("radioed");	
			}				
		}) 		
		
		//系統錯誤訊息依按鈕長度向右移動
		$(".btn4").click(
			function(){
				var wml = $(this).outerWidth()+20;
				$(".wrongMsg2").css("left",wml);
			}
		);	
			
		//自動彈跳視窗
		$(function(){
				$(".autoBtn").trigger("click");	
			})
		//銀行提款選擇其它銀行時動作
		$(".jqtst1").click(function(){
			$(".jqtst1-1").children("input").prop('disabled',false).val("").focus();	
			$(".jqtst1-1").children("div").hide();				
		})
				
		//回到頁面最頂端
/*		$("body").append("<div class='goTop'></div>");
		$(".goTop").hover(function(){$(this).stop().animate({opacity:"1"})},function(){$(this).stop().animate({opacity:".75"})})
		$(".goTop").click(function(){
				$("html, body").animate({
					scrollTop:"0"
				},1000);				
		})			
		$(window).scroll(function(){
				var window_scrollTop = $(this).scrollTop();
				if(window_scrollTop >300){
					$(".goTop").fadeIn("fast");	
				}else{
					$(".goTop").fadeOut("fast");	
				}
		})
*/		//首頁hover動畫
		$(".con_safe").mouseover(
				function(){
          			$(this).children("img").attr("src", "css/images/con1_safe.gif");
				}
		)
		$(".con_fast").mouseover(
				function(){
          			$(this).children("img").attr("src", "css/images/con1_fast.gif");
				}
		)
		$(".con_experience").mouseover(
				function(){
          			$(this).children("img").attr("src", "css/images/con1_experience.gif");
				}
		)

		
		//141203_存款_網銀轉帳+銀行存款
	var windowWidth = $(window).width();		
		if(windowWidth<=1280&&windowWidth>1024){
			$("label.label3").children(".DivBank:eq(3)").find(".radio").removeClass("mglft10");
		}
		else if(windowWidth<=1024){
			$("label.label3").children(".DivBank:eq(2)").find(".radio").removeClass("mglft10");
			$("label.label3").children(".DivBank:eq(3)").find(".radio").addClass("mglft10");
			}
		$(window).resize(function() { 			
			var windowWidth = $(window).width();	        
			if(windowWidth<=1280&&windowWidth>1024){
				$("label.label3").children(".DivBank:eq(3)").find(".radio").removeClass("mglft10");
			}
			else if(windowWidth<=1024){
				$("label.label3").children(".DivBank:eq(2)").find(".radio").removeClass("mglft10");
				$("label.label3").children(".DivBank:eq(3)").find(".radio").addClass("mglft10");
			}else{
				$("label.label3").children(".DivBank").find(".radio:not(.mglft10)").addClass("mglft10");	
				$("label.label3").children(".DivBank:eq(0)").find(".radio").removeClass("mglft10");
			}
        });
		//支付寶 by Chien
		$(".alipay .qrCodeBox .situation").mouseenter(function(){
			var Y = $(this).children('.qrcode').position().left + 20;
			$(".alipay .qrCodeBox .phone").css('left',Y);
			TweenMax.to($(".alipay .qrCodeBox .phone"), 2, {opacity:1, ease:Expo.easeOut});
			TweenMax.to($(this).children('.qrcode'),0.6,{left:'32%' , ease:Expo.easeOut});				
		}).mouseleave(function(){
			TweenMax.to($(this).children('.qrcode'),0.6,{left:'50%',ease:Expo.easeOut});
			TweenMax.to($(".alipay .qrCodeBox .phone"), 2, {opacity:0, ease:Expo.easeOut});
		});		
		$('.alipay .copylinkbtn').mouseenter(function(){
				var Y = $(this).position().left + 40;				
				$(this).parent().children('.hintMsg').css({'display':'block'});
				$(this).parent().children('.hintMsg').css('left', Y);
		}).mouseleave(function(){
				$(this).parent().children('.hintMsg').css('display','none');
		});
		$('.checkdata .alipay_enter').mouseenter(function(){
				var Y = $(this).position().left + 40;
				$(this).parent().children('.hintMsg').css('display','block');
				$(this).parent().children('.hintMsg').css('left', Y);
		}).mouseleave(function(){
				$(this).parent().children('.hintMsg').css('display','none');
		});

/*		//小遊戲顯示新樣式
		var time=200;//按鈕逐秒出現原始設定秒數
		$(".ggd").hover(
			function(){//滑鼠移入
				$(this).children(".buttonsContainer").stop().animate({bottom:"0"},"fast")//顯示黑色遮罩
				$(this).find(".buttonsContainer a.btn4").stop().each(function() {//找到按鈕
                    $(this).hide().delay(time).fadeIn();//讓按鈕每0.5秒逐個出現
					time+=200;
                });			
			},
			function(){
				$(this).children(".buttonsContainer").stop().animate({bottom:"-137"},"fast")
				time=200;//當滑鼠移出時,讓按鈕逐秒出現回到原始設定秒數
			}
		)
*/
		//小遊戲選單
		$(".gmnBrand li").click(function(){
			if($(this).hasClass("active")){
			}
			else{
				$(this).parent().children(".active").removeClass("active");
				$(this).addClass("active")
			}		
		})
		$(".gmnBrand li").click(function(){
			if($(this).hasClass("active")){
			}
			else{
				$(this).parent().children(".active").removeClass("active").children(".cisBox").animate({width:"0px","margin-left":"0px"});
				$(this).addClass("active").children(".cisBox").animate({width:"140px","margin-left":"-70px"});
			}
		
		})
		

		
		//首頁廣告輪播
			//var	timer = setTimeout(heroLoop,6000);		
			$(".hero-slide .next").click(function(){	
				clearTimeout(timer);				
				kvNextActive()
				heroNavActive();
				timer = setTimeout(heroLoop,6000); 	
			});
			$(".hero-slide .prev").click(function(){
				clearTimeout(timer);		
				kvPrevActive();		
				heroNavActive();
				timer = setTimeout(heroLoop,6000); 		
			});
			//首頁廣告選單
			var heroNavWidth = $("#hero_nav").width();
			$("#hero_nav").css("margin-left",-heroNavWidth/2);	
			$(".adSlider li").hover(
				function(){						
					var heroNavEq=$(this).index();
					var heroKvActive=$(".hero-kv ul li.slide-active");
					var heroKvActiveEq=heroKvActive.index();
					if(heroNavEq>heroKvActiveEq){
						$(".adSlider li").eq(heroNavEq).parent().children().removeClass("heroNavActive");
						$(".adSlider li").eq(heroNavEq).addClass("heroNavActive");	
						heroKvActive.removeClass("slide-active").stop().animate({left:"-1920px"},500,function(){$(this).hide();})
						$(".hero-kv ul li").eq(heroNavEq).addClass("slide-active").stop().show().css('left','1920px').animate({left:"0"},500)							
					}else if(heroNavEq<heroKvActiveEq){
						$(".adSlider li").eq(heroNavEq).parent().children().removeClass("heroNavActive");
						$(".adSlider li").eq(heroNavEq).addClass("heroNavActive");	
						heroKvActive.removeClass("slide-active").stop().animate({left:"1920px"},500,function(){$(this).hide();})
						$(".hero-kv ul li").eq(heroNavEq).addClass("slide-active").stop().show().css('left','-1920px').animate({left:"0"},500)							
					}else{}					
					//clearTimeout(timer);	
				},
				function(){
					//timer = setTimeout(heroLoop,6000); 
				}
			)									
			//首頁廣告輪播自動播放	
			/*heroLoop(heroLoopAuto);*/
			function heroLoop(_heroLoopAuto){
				kvNextActive();
				heroNavActive();			
				timer = setTimeout(heroLoop,6000); 
			}
			
			//呼叫套件-首頁廣告上一則播放
			function kvPrevActive(){
				var kvNum = $(".hero-kv ul").find(".slide-active");
				if($(".hero-kv ul li.slide-active").index()==$(".hero-kv ul li").length+1){
					kvNum.removeClass("slide-active").animate({left:"1920px"},500,function(){$(this).hide();})
					$(".hero-kv ul li").eq(0).addClass("slide-active").show().css('left','-1920px').animate({left:"0"},500)				
				}else{
					kvNum.removeClass("slide-active").animate({left:"1920px"},500,function(){$(this).hide();})
					$(".hero-kv ul li").eq(kvNum.index() - 1).addClass("slide-active").show().css('left','-1920px').animate({left:"0"},500)								
				}
			}
			//呼叫套件-首頁廣告下一則播放
			function kvNextActive(){
				var kvNum = $(".hero-kv ul").find(".slide-active");
				if($(".hero-kv ul li.slide-active").index()==$(".hero-kv ul li").length-1){
					kvNum.removeClass("slide-active").animate({left:"-1920px"},500,function(){$(this).hide();});
					$(".hero-kv ul li").eq(0).addClass("slide-active").show().css('left','1920px').animate({left:"0"},500);
				}else{
					kvNum.removeClass("slide-active").animate({left:"-1920px"},500,function(){$(this).hide();});
					$(".hero-kv ul li").eq(kvNum.index() + 1).addClass("slide-active").show().css('left','1920px').animate({left:"0"},500);					
				}	
			}
		
			//呼叫套件-當點擊下一個廣告時,判斷廣告選單(asSliderNum)被打開或關閉
			function heroNavActive(){
				var kvNum = $(".hero-kv ul").find(".slide-active");	
				var kvNumEq=kvNum.index();
				var heroNavLength = $(".adSlider li").length;
				if(kvNumEq>=heroNavLength){
					kvNumEq =0;
				}					
				if($(".adSlider li").eq(kvNumEq).hasClass("heroNavActive")){}
				else{
					$(".adSlider li").eq(kvNumEq).parent().children().removeClass("heroNavActive").children("img").stop().animate({bottom:"-56px"},'fast');
					$(".adSlider li").eq(kvNumEq).children("img").stop().animate({bottom:"0"},'fast').parent().addClass("heroNavActive");											
				}		
			}			
			
		//端午節LOGO動畫
		/*
		var logo_heignt=0;
		var logoAutoPlay;		
		$(".hd-logo").hover(function(){
				logoPlay();
			},
			function(){
				clearTimeout(logoAutoPlay);
			}
		)			
		function logoPlay(){
			if(logo_heignt<=-1690){logo_heignt=0;}		
			$(".hd-logo").css('background-position','0px'+' '+logo_heignt+'px');	
			logo_heignt=logo_heignt-65;				
			logoAutoPlay = setTimeout(logoPlay,30);
		}	
		*/		
		
		
		
		
		
		
		
		//收起選單區塊，點擊下拉選單以外區塊直接隱藏選單 optionClassName為欲關閉之class名
			function clsarea(optionClassName){
				$("body").append("<div class='clsarea'></div>");		
					$(".clsarea").click(function(){
						$(optionClassName).hide();
						$(".clsarea").remove();
					})		
				}
			function removeclsarea(){
				$(".clsarea").remove();		
			}			
		//收起選單區塊2，點擊下拉選單以外區塊由下向上收起選單 optionClassName為欲關閉之class名
			function clsarea2(optionClassName){
				$("body").append("<div class='clsarea'></div>");		
					$(".clsarea").click(function(){
						$(optionClassName).slideUp();
						$(".clsarea").remove();
				})		
			}
			function removeclsarea(){
				$(".clsarea").remove();		
			}		


		//fancybox彈跳視窗(會影响其它jquery事件,建議放最後)
		$('.fancybox').fancybox({			
					    autoHeight:true,
						fitToView:false,
						type:'iframe',
		});		
		//fancybox彈跳視窗-紅利領取-活動說明
		$('.fancybox-bns').fancybox({			
					    height:868,
						fitToView:false,
						type:'iframe',
		});		
		//fancybox彈跳視窗-紅利領取-領取狀態
		$('.fancybox-bns2').fancybox({			
					    height:276,
						fitToView:false,
						type:'iframe',												
		});				
		
		
		//jquery最後括弧
})