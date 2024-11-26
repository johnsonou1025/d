$(document).ready(function () {
    // mobile header
    $(".nav-switch").click(function () {
        $("body").addClass("lock");
        $(".nav-menu").addClass("open");
    })
    $(".nav-close").click(function () {
        $("body").removeClass("lock");
        $(".nav-menu").removeClass("open");
    })
    // menu dropdown anime
    $(".nav-dropdown>span").click(function () {
        $(".nav-dropdown").toggleClass("open");
    })
    $(".nav-dropdown a").click(function () {
        $(".nav-dropdown").removeClass("open")
    })
    // menu a anime
    // $('.nav-menu').on('click', 'a', function (event) {
    $(".nav-menu a[href^='#']").on('click', function (event) {
        // $(".nav-dropdown").unbind('mouseenter mouseleave');
        $(".nav-dropdown").unbind();
        $("body").removeClass("lock");
        $(".nav-menu").removeClass("open");
        var _headerHeight = $("header").height();
        event.preventDefault();
        var _href = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(_href).offset().top - _headerHeight
        }, 800);
    });
    // language
    $(".lang>span").click(function () {
        $(this).parent().toggleClass("en");
    })

    // slider card
    $(".card-slider i:first-child").click(function () {
        $(".card-group li:last-child").insertBefore($(".card-group li:first-child"));
    });
    $(".card-slider i:last-child").click(function () {
        $(".card-group li:first-child").insertAfter($(".card-group li:last-child"));
    });

    // contact
    $('#sendEmail').click(function () {
        // 取得每個欄位的值
        var name = $('#name').val();
        var email = $('#email').val();
        var message = $('#message').val();
        var errorMessage;
        var isValid = true; // 表示驗證通過

        $(".form-text").removeClass("error")

        // 檢查email
        var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            isValid = false;
            $(this).parent().find("#email").parent().addClass("error");
            errorMessage = "please check for the correct email format."
        }

        // 檢查textarea不是空白
        $('textarea').each(function () {
            if ($(this).val().trim() === "") {
                isValid = false;
                $(this).parent().addClass("error");
                errorMessage = "Please fill in this field."
            }
        });

        // 檢查input不是空白
        $('input').each(function () {
            if ($(this).val().trim() === "") {
                isValid = false;
                $(this).parent().addClass("error");
                errorMessage = "Please fill in this field."
            }
        });

        if (!isValid) {
            $('#error').show().text(errorMessage);
        } else {
            // 將欄位值插入到 mailto 字串
            var mailtoLink = "mailto:" + "johnsonou1025@gmail.com" +
                "?subject=" + encodeURIComponent(name) +
                "&body=" + encodeURIComponent("姓名: " + name + "\n\n信箱:" + email + "\n\n訊息:\n" + message);
            // 開啟郵件客戶端
            window.location.href = mailtoLink;
        }

    });
});
// anime
$(window).scroll(function () {
    $(".fadePlay").each(function (i) {
        var $div = $(this).children("");
        var bottom_of_object = $(this).offset().top;
        var bottom_of_window = $(window).scrollTop() + $(window).height() * 0.9;
        if (bottom_of_window > bottom_of_object) {
            $div.each(function (index) {
                setTimeout(function () {
                    $($div[index]).addClass("fadeIn");
                }, index * 300);
            });
        }
    });
    $(".case-demo-box").each(function () {
        var bottom_of_object = $(this).offset().top;
        var bottom_of_window = $(window).scrollTop() + $(window).height() * 0.5;
        if (bottom_of_window > bottom_of_object) {
            $(this).children().addClass("anime");
        }
    })
});
// language
// function setLanguage(lang) {
//     fetch('../language.json') // 載入 JSON 文件
//         .then(response => response.json())
//         .then(data => {
//             const translations = data[lang];
//             document.querySelectorAll('[data-lang]').forEach(element => {
//                 const key = element.getAttribute('data-lang');
//                 if (translations[key]) {
//                     element.textContent = translations[key];
//                 }
//             });
//         });
// }

function setLanguage(lang) {
    $loading = '<div class="loading"><span>Loading pleass wait</span></div>'
    $('body').append($loading);
    fetch('../language.json') // 載入 JSON 文件
        .then(response => {
            if (!response.ok) {
                throw new Error('載入失敗');
            }
            return response.json();
        })
        .then(data => {
            const translations = data[lang];
            document.querySelectorAll('[data-lang]').forEach(element => {
                const key = element.getAttribute('data-lang');
                if (translations[key]) {
                    element.textContent = translations[key];
                }
            });
        })
        .finally(() => {
            // 隱藏載入圖示並顯示內容
            $(".loading").remove();
            // setTimeout(function () {
            //     $('.loading').fadeOut(300, function () {
            //         $(".loading").remove();
            //     });
            // }, 1000); // 模擬 2 秒後完成
        });
}

document.addEventListener("DOMContentLoaded", function () {
    setLanguage('en');
});