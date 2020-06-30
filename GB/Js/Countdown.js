$(document).ready(function(){
	var SS = 120;//等待開獎時間
	var YY = 120;//等待開獎時間
	var TT = 0;
	var PP = 360/SS;
	
	var HH = SS/2;
	
	$(".CountDownArea .Background .Number span").html(SS);
	
	function COUNTDOWN (){
		XX = YY-=1;
		TT += 1;
		
		if(TT > SS){
			
		}else{
			var DD = TT*PP;
			//console.log(DD);
			ZZ = DD-180;
			$(".CountDownArea .Background .BB").css({"transform": "rotate(" + DD + "deg)"});
			$(".CountDownArea .Background .Number span").html(XX);
			if(TT <= HH){
				$(".CountDownArea .Background .sideRight .fill").css({"transform": "rotate(" + DD + "deg)"});
			}else if(HH >= TT <= YY){
				$(".CountDownArea .Background .sideRight .fill").css({"transform": "rotate(" + 180 + "deg)"});
				$(".CountDownArea .Background .sideLeft .fill").css({"transform": "rotate(" + ZZ + "deg)"});
			}else{
			};
			
		};
	};
	setInterval(COUNTDOWN,1000);//每秒倒數
	
/*----------------------------------------------開獎動畫-------------------------------------------*/

	var LL = 0;

	function BallIn (){	
		
		var N0 = $(".Keno_box ul.Keno_ball li").eq(0).find("span").html();
		var N1 = $(".Keno_box ul.Keno_ball li").eq(1).find("span").html();
		var N2 = $(".Keno_box ul.Keno_ball li").eq(2).find("span").html();
		var N3 = $(".Keno_box ul.Keno_ball li").eq(3).find("span").html();
		var N4 = $(".Keno_box ul.Keno_ball li").eq(4).find("span").html();
		var N5 = $(".Keno_box ul.Keno_ball li").eq(5).find("span").html();
		var N6 = $(".Keno_box ul.Keno_ball li").eq(6).find("span").html();
		var N7 = $(".Keno_box ul.Keno_ball li").eq(7).find("span").html();
		var N8 = $(".Keno_box ul.Keno_ball li").eq(8).find("span").html();
		var N9 = $(".Keno_box ul.Keno_ball li").eq(9).find("span").html();
		var N10 = $(".Keno_box ul.Keno_ball li").eq(10).find("span").html();
		var N11 = $(".Keno_box ul.Keno_ball li").eq(11).find("span").html();
		var N12 = $(".Keno_box ul.Keno_ball li").eq(12).find("span").html();
		var N13 = $(".Keno_box ul.Keno_ball li").eq(13).find("span").html();
		var N14 = $(".Keno_box ul.Keno_ball li").eq(14).find("span").html();
		var N15 = $(".Keno_box ul.Keno_ball li").eq(15).find("span").html();
		var N16 = $(".Keno_box ul.Keno_ball li").eq(16).find("span").html();
		var N17 = $(".Keno_box ul.Keno_ball li").eq(17).find("span").html();
		var N18 = $(".Keno_box ul.Keno_ball li").eq(18).find("span").html();
		var N19 = $(".Keno_box ul.Keno_ball li").eq(19).find("span").html();
		
		var NN0 = parseInt(N0); 
		var NN1 = parseInt(NN0)+ parseInt(N1);
		var NN2 = parseInt(NN1)+ parseInt(N2);
		var NN3 = parseInt(NN2)+ parseInt(N3);
		var NN4 = parseInt(NN3)+ parseInt(N4);
		var NN5 = parseInt(NN4)+ parseInt(N5);
		var NN6 = parseInt(NN5)+ parseInt(N6);
		var NN7 = parseInt(NN6)+ parseInt(N7);
		var NN8 = parseInt(NN7)+ parseInt(N8);
		var NN9 = parseInt(NN8)+ parseInt(N9);
		var NN10 = parseInt(NN9)+ parseInt(N10);
		var NN11 = parseInt(NN10)+ parseInt(N11);
		var NN12 = parseInt(NN11)+ parseInt(N12);
		var NN13 = parseInt(NN12)+ parseInt(N13);
		var NN14 = parseInt(NN13)+ parseInt(N14);
		var NN15 = parseInt(NN14)+ parseInt(N15);
		var NN16 = parseInt(NN15)+ parseInt(N16);
		var NN17 = parseInt(NN16)+ parseInt(N17);
		var NN18 = parseInt(NN17)+ parseInt(N18);
		var NN19 = parseInt(NN18)+ parseInt(N19);
		
		
		if(LL<20){
			$(".Keno_box ul.Keno_ball li").eq(LL).find("span").animate({left:0, opacity:1},200);

			if(LL == 0){
				var TN = NN0;
			}else if(LL == 1){
				var TN = NN1;
			}else if(LL == 2){
				var TN = NN2;
			}else if(LL == 3){
				var TN = NN3;
			}else if(LL == 4){
				var TN = NN4;
			}else if(LL == 5){
				var TN = NN5;
			}else if(LL == 6){
				var TN = NN6;
			}else if(LL == 7){
				var TN = NN7;
			}else if(LL == 8){
				var TN = NN8;
			}else if(LL == 9){
				var TN = NN9;
			}else if(LL == 10){
				var TN = NN10;
			}else if(LL == 11){
				var TN = NN11;
			}else if(LL == 12){
				var TN = NN12;
			}else if(LL == 13){
				var TN = NN13;
			}else if(LL == 14){
				var TN = NN14;
			}else if(LL == 15){
				var TN = NN15;
			}else if(LL == 16){
				var TN = NN16;
			}else if(LL == 17){
				var TN = NN17;
			}else if(LL == 18){
				var TN = NN18;
			}else{
				var TN = NN19;
			};
			
			var BB = $(".Keno_box ul.Keno_ball li").eq(LL).find("span").html();

			$(".Keno_total span").html(TN);
			
			//console.log(EDE);
			
			LL += 1;
		}else{
			clearInterval(BallIn);
		};
	};
	setInterval(BallIn,100);//每0.1秒帶入一個球
	
});