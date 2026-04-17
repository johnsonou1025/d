$(".next").click(function () {
    $(this).removeClass("active").siblings().addClass("active");
    $(".services ul").css("transform", "translateX(-50%)");
})
$(".prev").click(function () {
    $(this).removeClass("active").siblings().addClass("active");
    $(".services ul").css("transform", "translateX(0%)");
})

// new fullpage('.page', {
//     sectionSelector: '.section'
// });

$(window).on('scroll load', function() {
    $('.intro .headline, .card-box li, .services li').each(function() {
        var elementTop = $(this).offset().top;
        var windowBottom = $(window).scrollTop() + $(window).height();
        
        if (elementTop < windowBottom - 100) {
            $(this).addClass('is-visible');
        }
    });
});

