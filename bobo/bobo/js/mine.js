$(function(){
  /*手機登入展開*/
   $("#OpenLogin").click(function(){
    $(".MobileLoginBoxMain").addClass("Active");
    $(".MobileLoginBoxBg").fadeIn();
   });
    $(".MobileLoginBoxBg").click(function(){
    $(".MobileLoginBoxMain").removeClass("Active");
    $(".MobileLoginBoxBg").fadeOut();
   });
  /*小遊戲固定*/
  if($(window).width() < 1080)
  {
     $(window).scroll(function(){
            if($(window).scrollTop() >= $(".Banner").height() - 45 ){
                $(".GamesNav").addClass('Active');
            }else{
                $(".GamesNav").removeClass('Active');
            }
    });
  } else {
     $(window).scroll(function(){
            if($(window).scrollTop() >= $(".Banner").height() - 145 ){
                $(".GamesNav").addClass('Active');
            }else{
                $(".GamesNav").removeClass('Active');
            }
    });
  }
  /*小遊戲固定*/
  if($(window).width() < 1080)
  {
     $(window).scroll(function(){
            if($(window).scrollTop() >= $(".Banner").height() - 45 ){
                $(".PromotionNav").addClass('Active');
            }else{
                $(".PromotionNav").removeClass('Active');
            }
    });
  } else {
     $(window).scroll(function(){
            if($(window).scrollTop() >= $(".Banner").height() - 145 ){
                $(".PromotionNav").addClass('Active');
            }else{
                $(".PromotionNav").removeClass('Active');
            }
    });
  }
  /*選擇金額*/
  $(".MemberChoiseMoney.First ul li").click(function(){
    $(".MemberChoiseMoney ul li").removeClass("Active");
    $( ".MemberChoiseMoney.Second" ).css("display","none");
    $(this).addClass("Active");
  });
  $(".MemberChoiseMoney.Second ul li").click(function(){
    $(".MemberChoiseMoney ul li").removeClass("Active");
    $(".MemberChoiseMoney ul li.Open").addClass("Active");
    $(this).addClass("Active");
  });
  $( ".MemberChoiseMoney .Open" ).click(function() {
    $( ".MemberChoiseMoney.Second" ).toggle();
  });
  /*篩選銀行*/
  $(".SelectBankMain").click(function(){
    $(".SelectBank").addClass("Active");
  });
  $(".SelectBankBg,.SelectBankOpen ul li").click(function(){
    $(".SelectBank").removeClass("Active");
  });
  /*手機選單*/
  $(".NavBtn").click(function(){
    $(".Menu.Right").addClass("Active");
    $(".MenuBg").fadeIn();
  });
  $(".MenuBg").click(function(){
    $(".Menu.Right").removeClass("Active");
    $(".MenuBg").fadeOut();
  });
  /*手機次選選單*/
  $(".MenuNav div.More").click(function(){
    $(this).toggleClass("Active");
    $(this).children("ol").slideToggle();
  });
  /*交易紀錄篩選開關*/
  $(".MemberTransationSelectBtn").on("click" ,function(){
           if($(this).parent().children(".MemberCalendar").hasClass("Active")){
               $(".MemberCalendar").removeClass("Active");
               $(this).removeClass("Active");

           }else{
              $(".MemberTransationSelectBtn").removeClass("Active");
              $(this).addClass("Active");
              $(".MemberCalendar").removeClass("Active");
              $(this).parent().children(".MemberCalendar").addClass("Active");
           }
   });
   /*代理人輸贏*/
   $(".LightBoxAffiliateBox ul li").click(function(){
    $(this).toggleClass("Active");
   });
   /*代理人頁首*/
   $(window).scroll(function(){
            if($(window).scrollTop() >= 10){
                $(".affiliate-header").addClass('Active');
            }else{
                $(".affiliate-header").removeClass('Active');
            }
        });
   /*首頁頁尾*/
      $(".FooterMain h2").on("click" ,function(){
           if($(this).parent().children(".FooterBoxMain").hasClass("Active")){
               $(this).parent().children(".FooterBoxMain").removeClass("Active");
               $(this).removeClass("Active");

           }else{
              $(this).parent().children(".FooterBoxMain").addClass("Active");
              $(this).addClass("Active");
           }
   });
      /*首頁頁首*/
   $(window).scroll(function(){
            if($(window).scrollTop() >= 10){
                $(".HeaderBottom").addClass('Active');
            }else{
                $(".HeaderBottom").removeClass('Active');
            }
        });

      /*首頁輪播*/
      $(window).load(function() {
        $('.Banner .flexslider').flexslider({
        animation: "slide",
        direction: "horizontal",
        slideshowSpeed: 5000,
        animationSpeed: 1000,
        pauseOnHover:"false",
        mousewheel: false, 
        controlNav: true, 
        directionNav: false, 
        touch:true,

        });
      });

       /*首頁輪播*/
      $(window).load(function() {
        $('.IndexPromotion .flexslider').flexslider({
        animation: "slide",
        direction: "horizontal",
        slideshowSpeed: 10000,
        animationSpeed: 1000,
        pauseOnHover:"false",
        mousewheel: false, 
        controlNav: false, 
        directionNav: false, 
        touch:true,

        });
      });
      //首頁選單
      $(".MobileNavBtn").click(function(){
        $(".MobileMainNav").addClass("Active");
      });
      $(".MobileMainNav .Back").click(function(){
        $(".MobileMainNav").removeClass("Active");
      });


      /*手機次選選單*/
      $(".HelpcenterNavBtn").on("click" ,function(){
           if($(this).hasClass("Active")){
               $(this).removeClass("Active");
               $(".HelpcenterNavBtn ul").removeClass("Active");
           }else{
              $(".HelpcenterNavBtn ul").removeClass("Active");
              $(".HelpcenterNavBtn").removeClass("Active");
              $(this).addClass("Active");
              $(this).children("ul").addClass("Active");
           }
      });

      $(".HelpcenterSecondNav ul li").click(function(){
        $(".HelpcenterSecondNav ul li").removeClass();
        $(this).addClass("Active");
      });




});







