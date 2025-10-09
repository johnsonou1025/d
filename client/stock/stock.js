const API = "https://script.google.com/macros/s/AKfycbxGtR8NWam6AzC4-Onb8Jye4q6LKpQqifXIronmQtd0rMMjj4m2nukpX_wVW5MzwAzF3g/exec"; // Web App exec URL[web:184]

$(async function () {
    const $wrap = $('div.wrap');
    const $section = $('div.section');
    const $status = $('p.results').text('資料載入中，請勿離開…');
    try {
        const data = await $.getJSON(API);          // 後端回 JSON[web:176]
        if (!data.ok) { $status.text('錯誤：' + (data.message || '未知錯誤')); return; }

        const header = data.header || '結果';       // 標題[web:184]
        const dayReport = Array.isArray(data.dayReport) ? data.dayReport : [];
        const finishStock = Array.isArray(data.finishStock) ? data.finishStock : [];
        $status.text(header);

        let i = 0;
        let timer = setInterval(() => {             // 用 let 以便清除後設為 null[web:181]
            if (i >= dayReport.length) {
                clearInterval(timer);
                timer = null;
                return;
            }
            const item = dayReport[i] || {};
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

        let j = finishStock.length - 1;
        let timer2 = setInterval(() => {             // 用 let 以便清除後設為 null[web:181]
            if (j <= 0) {
                clearInterval(timer2);
                timer2 = null;
                return;
            }
            const item = finishStock[j] || {};
            const time = item.time;
            const nameCode = item.sheetName;
            const avgEntry = item.avgEntry;
            const quantity = item.quantity;
            const benefit = item.benefit;
            const rate = item.rate;

            const $cardFinish = $('<div/>', { class: 'card-finish' });
            const $info = $('<div/>', { class: 'info' }).appendTo($cardFinish);
            const $infoUl = $('<ul/>').appendTo($info);
            $('<li/>', { text: time }).appendTo($infoUl);
            $('<li/>', { text: nameCode }).appendTo($infoUl);
            $('<p/>', { text: benefit }).appendTo($info);
            const $detail = $('<div/>', { class: 'detail' }).appendTo($cardFinish);
            const $detailUl = $('<ul/>').appendTo($detail);
            $('<li/>').append('進場均價').append($('<span/>', { text: avgEntry })).appendTo($detailUl);
            $('<li/>').append('進場張數').append($('<span/>', { text: quantity })).appendTo($detailUl);
            $('<li/>').append('報酬率').append($('<span/>', { text: rate + "%" })).appendTo($detailUl);

            $section.append($cardFinish);
            j--;
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