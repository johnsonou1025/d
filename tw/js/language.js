$(document).ready(function () {
    // change language
    $(".lang").click(function () {
        let currentUrl = window.location.href;
        let newUrl = currentUrl.replace("joinjo.studio/tw/", "joinjo.studio/");
        // let newUrl = currentUrl.replace("5501/tw/", "5501/");
        window.location.href = newUrl;
        console.log(newUrl)
    })
})
document.addEventListener("DOMContentLoaded", function () {
    setLanguage('zh');
});
