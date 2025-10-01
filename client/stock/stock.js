const API = "https://script.google.com/macros/s/AKfycbxGtR8NWam6AzC4-Onb8Jye4q6LKpQqifXIronmQtd0rMMjj4m2nukpX_wVW5MzwAzF3g/exec"; // Web App exec URL[web:184]

$(async function () {
    const $wrap = $('div.wrap');
    const $status = $('p.results').text('資料載入中，請勿離開…');
    try {
        const data = await $.getJSON(API);          // 後端回 JSON[web:176]
        if (!data.ok) { $status.text('錯誤：' + (data.message || '未知錯誤')); return; }

        const header = data.header || '結果';       // 標題[web:184]
        const items = Array.isArray(data.results) ? data.results : []; // 陣列[web:181]
        $status.text(header);
        console.log(header);                 // 顯示標題[web:181]

        let i = 0;
        let timer = setInterval(() => {             // 用 let 以便清除後設為 null[web:181]
            if (i >= items.length) {
                clearInterval(timer);
                timer = null;
                return;
            }
            const item = items[i] || {};
            const nameCode = item.sheetName;
            const rate = item.rate;
            const entryPrice = item.avgEntry;
            const currentPrice = item.currentPrice;

            const $card = $('<div/>', { class: 'card' });
            $card.attr('data-price', String(currentPrice));
            const numRate = Number(item.rate);
            $card.attr('data-rate', String(numRate));
            if (!isNaN(numRate) && numRate < 0) {
                $card.addClass('down');  // rate < 0 時加上 red 類別
            }
            const $ul = $('<ul/>').appendTo($card);
            $('<li/>').append($('<span/>', { text: nameCode })).appendTo($ul);
            $('<li/>').append('報酬率').append($('<div/>', { text: rate + "%" })).appendTo($ul);
            $('<li/>').append('進場均價').append($('<div/>', { text: entryPrice })).appendTo($ul);
            $('<li/>').append('目前價格').append($('<div/>', { text: currentPrice })).appendTo($ul);

            $wrap.append($card);
            i++;
        }, 250);
    } catch (err) {
        $status.text('請求失敗：' + err);
    }
});

$(function () {
    $(".filter li").click(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
            $(".card").each(function () {
                $(this).css('order', '1')
            })
        } else {
            $(this).addClass("active").siblings().removeClass("active");
            if ($(this).hasClass("rate")) {
                $(".card").each(function () {
                    var cardRate = -(Math.floor(Number($(this).data('rate'))));
                    $(this).css('order', cardRate);
                })
            } else if ($(this).hasClass("price")) {
                $(".card").each(function () {
                    var cardPrice = Math.floor(Number($(this).data('price')));
                    $(this).css('order', cardPrice)
                })
            }
        }

    })
})