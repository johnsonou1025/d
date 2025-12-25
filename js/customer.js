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