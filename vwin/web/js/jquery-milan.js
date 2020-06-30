// JavaScript Document

$(function(){
		//真人娛樂場
		//真人娛樂場-館切換
		var  lpNum=0;
		csn_loop();	
		$(".csn_mn").children("li").click(function(){
				bfAft(1);
				$(this).parent().parent().children(".active").animate({opacity:'0', width:'hide'});	
				$(this).parent().find(".active").removeClass("active");
				$(this).addClass("active");
				if($(this).hasClass("mil")){			
					$(".csn_kv1").show().addClass("active").animate({opacity:'1'});	
					bfAft(0.618);
					lpNum=1;			
				}else if($(this).hasClass("bir")){					
					$(".csn_kv2").show().addClass("active").animate({opacity:'1'});
					lpNum=2;	
				}else if($(this).hasClass("eme")){
					$(".csn_kv3").show().addClass("active").animate({opacity:'1'});
					lpNum=0;	
					}				
		})
		//循環
		function csn_loop(){
			bfAft(1);
			$(".csn_mn li").parent().parent().children(".active").animate({opacity:'0', width:'hide'});	
			$(".csn_mn li").parent().find(".active").removeClass("active");
			$(".csn_mn li").eq(lpNum).addClass("active").animate({opacity:'1'});
			if($(".csn_mn li.active").hasClass("mil")){		
					$(".csn_kv1").show().addClass("active").animate({opacity:'1'});							
			}else if($(".csn_mn li.active").hasClass("bir")){					
					$(".csn_kv2").show().addClass("active").animate({opacity:'1'});
			}else if($(".csn_mn li.active").hasClass("eme")){
					$(".csn_kv3").show().addClass("active").animate({opacity:'1'});
			}	
			lpNum++;
			if(lpNum==3){
				lpNum=0;
				}
			setTimeout(csn_loop,7000);
		}		
	function bfAft(introPosition){
		$('.csn_kv1').beforeAfter({
			animateIntro:true,
			introDelay:1000,
			introDuration : 1000,
			introPosition : introPosition,
			showFullLinks : false,
			beforeLinkText: '1080P',
			afterLinkText: '480P',
			cursor: 'e-resize',
			enableKeyboard: true,
			dividerColor: '#070'
		}).css({"left":"50%","margin-left":"-960px"});		
	}	
	
	









})