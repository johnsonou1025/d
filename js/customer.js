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

function checkVideoSource() {
    var video = $('#kv-video');
    var source = video.find('source');
    var windowWidth = $(window).width();
    var currentSrc = source.attr('src');
    var targetSrc = (windowWidth <= 768) ? 'img/kv-mobile.mp4' : 'img/kv.mp4';

    // 只有當目標來源與當前來源不同時，才執行切換
    if (currentSrc !== targetSrc) {
        source.attr('src', targetSrc);
        video[0].load(); // 必須呼叫 load() 讓瀏覽器重新讀取來源
        video[0].play(); // 重新播放
    }
}

$(document).ready(function() {
    // 1. 初始化檢查
    checkVideoSource();

    // 2. 監聽視窗縮放 (加入 debounce 避免過度消耗效能)
    var resizeTimer;
    $(window).on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            checkVideoSource();
        }, 250); 
    });
});
