$(function() {
    // header animation
    var navWrapLength = $(".header .nav-wrap>ul>li").length;
    var windowWidth = $(window).width();
    $(".header .nav-wrap>ul>li").show();
    $(".header .nav-more>ul>li").hide();
    for (i = 0; i < navWrapLength; i++) {
        var navLi = $(".header .nav-wrap>ul>li").eq(i);
        var navLiRight = (navLi.offset()).left + navLi.width();
        if (navLiRight + 360 >= windowWidth && i != navWrapLength - 1) {
            for (n = i; n < navWrapLength; n++) {
                $(".header .nav-wrap>ul>li").eq(n).hide();
                $(".header .nav-more>ul>li").eq(n).show();
            }
        }
    }
    if ($(".nav-wrap>ul>li:visible").next().is(":hidden") == true) {
        $(".header span.more").show();
    } else {
        $(".header span.more").hide();
    }
    // header animation end

    // mobile slide animation
    
    $(".slide-nav-hamburger").click(function() {
        $(".mobile-slide-wrap").addClass('active');
        $("body").css({ "overflow": "hidden" });
    });
    $(".mobile-slide-close").click(function(event) {
        $(".mobile-slide-wrap").removeClass('active');
        $("body").css({ "overflow": "auto" });
    });
    
    // mobile slide animation end

    // news animation
    var newsListLength = $(".news-list li").length;
    var newsListWidth = 0;
    for (i = 0; i < newsListLength; i++) {
        newsListWidth = newsListWidth + $(".news-list li").eq(i).width();
    }
    $(".news-list ul").css({ width: newsListWidth });
    // news animation end


    // slide-menu animation
    $(function() {
        // banner slide animation
        setInterval(function() {
            var slideLength = $(".banner-wrap .slide-menu li").length;
            if ($(".banner-wrap .slide-menu li.active").index()< slideLength-1) {
                $(".banner-wrap .slide-menu li.active").next().trigger('click');
            }else{
                $(".banner-wrap .slide-menu li").eq(0).trigger('click');
            }
        }, 5000);
        $(".banner-wrap .slide-menu li").click(function() {
            $(this).addClass('active').siblings().removeClass('active');
            var ilEq = $(this).index();
            $(".banner-wrap .slide-banner li").eq(ilEq).addClass('active').siblings().removeClass('active');
        });



        // $('.mobile-game-list-wrap .block-list').addClass('hide');
        // $('.mobile-game-list-wrap .block-list:first').removeClass('hide');
        // mobile live casino and slot slide animation
        $(".mobile-game-list-wrap .slide-menu li").click(function(event) {
            $(this).addClass('active').siblings().removeClass('active');
            var ilEq = $(this).index();
            console.log(ilEq);
            $(this).parent().parent().parent().children('.block-list').addClass('hide').eq(ilEq).removeClass('hide');
        });
    })



})
$(window).resize(function() {
    var navWrapLength = $(".header .nav-wrap>ul>li").length;
    var windowWidth = $(window).width();
    $(".header .nav-wrap>ul>li").show();
    $(".header .nav-more>ul>li").hide();
    for (i = 0; i < navWrapLength; i++) {
        var navLi = $(".header .nav-wrap>ul>li").eq(i);
        var navLiRight = (navLi.offset()).left + navLi.width();
        if (navLiRight + 360 >= windowWidth && i != navWrapLength - 1) {
            for (n = i; n < navWrapLength; n++) {
                $(".header .nav-wrap>ul>li").eq(n).hide();
                $(".header .nav-more>ul>li").eq(n).show();
            }
        }
    }
    if ($(".nav-wrap>ul>li:visible").next().is(":hidden") == true) {
        $(".header span.more").show();
    } else {
        $(".header span.more").hide();
    }
    //news animation
    var newsListLength = $(".news-list li").length;
    var newsListWidth = 0;
    for (i = 0; i < newsListLength; i++) {
        newsListWidth = newsListWidth + $(".news-list li").eq(i).width();
    }
    $(".news-list ul").css({ width: newsListWidth });
    // news animation end
});