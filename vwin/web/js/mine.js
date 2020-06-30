$(function() {
    /*VWIN榮耀殿堂選單*/
    $(".LbBtnbox p.LbBtn").mouseenter(function() {
        $(".LbBtnbox p.LbBtn").removeClass("Active");
        $(this).addClass("Active");
        $(".Lbname").css("display", "none");
        var N = this.id.substr(4);
        $("#J-Nb" + N).stop().fadeIn(300).css("display", "block");
    });

});
