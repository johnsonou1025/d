$(document).ready(function () {
    // change language
    $(".lang").click(function () {
        let currentUrl = window.location.href;
        let newUrl = currentUrl.replace("joinjo.studio/", "joinjo.studio/tw/");
        // let newUrl = currentUrl.replace("5501/", "5501/tw/");
        window.location.href = newUrl;
        console.log(newUrl)
    })
})
document.addEventListener("DOMContentLoaded", function () {
    setLanguage('en');
});