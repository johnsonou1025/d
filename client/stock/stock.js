const API = "https://script.google.com/macros/s/AKfycbxGtR8NWam6AzC4-Onb8Jye4q6LKpQqifXIronmQtd0rMMjj4m2nukpX_wVW5MzwAzF3g/exec"; // Web App exec URL[web:184]

$(async function () {
    const $entry = $('.content .entry .card-box');
    const $take = $('.content .take-profit .card-box');
    const $top = $('.top-news .card-box');
    const $status = $('p.results').text('資料載入中，請勿離開…');

    try {
        const data = await $.getJSON(API);          // 後端回 JSON[web:176]
        if (!data.ok) { $status.text('錯誤：' + (data.message || '未知錯誤')); return; }

        const header = data.header || '結果';       // 標題[web:184]
        const dayReport = Array.isArray(data.dayReport) ? data.dayReport : [];
        const finishStock = Array.isArray(data.finishStock) ? data.finishStock : [];
        $status.text(header);


        let i = 0;
        let dayreport = setInterval(() => {             // 用 let 以便清除後設為 null[web:181]
            if (i >= dayReport.length) {
                clearInterval(dayreport);
                dayreport = null;
                return;
            }
            const item = dayReport[i] || {};
            const nameCode = item.sheetName;
            const avgEntry = item.avgEntry;
            const quantity = item.quantity;
            const currentPrice = item.currentPrice;
            const rate = item.rate;

            const $card = $('<div/>', { class: 'card' });
            $card.attr('data-price', String(currentPrice));
            const numRate = Number(item.rate);
            $card.attr('data-rate', String(numRate));
            if (!isNaN(rate) && rate < 0) {
                $card.addClass('down');  // rate < 0 時加上 red 類別
            }
            $('<p/>').append($('<span/>')).append(nameCode).appendTo($card);
            $('<p/>').append(currentPrice).appendTo($card);
            $('<p/>').append(($('<span/>')).text("進場均價")).append(avgEntry).appendTo($card);
            $('<p/>').append(($('<span/>')).text("進場張數")).append(quantity).appendTo($card);
            $('<p/>').append(($('<span/>')).text("報酬率")).append(rate + "%").appendTo($card);

            $entry.append($card);
            i++;
        }, 250);

        let j = finishStock.length - 1;
        let maxShowStockQuantity = 10;
        let finishreport = setInterval(() => {
            if (maxShowStockQuantity <= 0) {
                clearInterval(finishreport);
                finishreport = null;
                return;
            }
            const lastItem = finishStock[finishStock.length - 1] || {};
            const lastTime = lastItem.time;
            const item = finishStock[j] || {};
            const time = item.time;
            const nameCode = item.sheetName;
            const avgEntry = item.avgEntry;
            const quantity = item.quantity;
            const benefit = item.benefit;
            const rate = item.rate;
            const state = item.state;
            // console.log(time + "/" + nameCode + "/" + avgEntry + "/" + quantity + "/" + benefit + "/" + rate + "/" + state);
            const $card = $('<div/>', { class: 'card' });
            const numRate = Number(item.rate);
            if (!isNaN(rate) && rate < 0) {
                $card.addClass('down');  // rate < 0 時加上 red 類別
            }
            $('<p/>').append(($('<span/>')).text(time)).append(nameCode).appendTo($card);
            $('<p/>').append(benefit).appendTo($card);
            $('<p/>').append(($('<span/>')).text("進場均價")).append(avgEntry).appendTo($card);
            $('<p/>').append(($('<span/>')).text("進場張數")).append(quantity).appendTo($card);
            $('<p/>').append(($('<span/>')).text("報酬率")).append(rate + "%").appendTo($card);
            if (state == "sell") {
                $take.append($card);
                if (time == lastTime) {
                    $top.append($card);
                }
                maxShowStockQuantity--;
            } else {
                if (time == lastTime) {
                    $top.append($card);
                }
            }
            j--;
        }, 250);

    } catch (err) {
        $status.text('請求失敗：' + err);
    }
});

$(function () {
    $(".tags li").click(function () {
        $li = $(this);
        $li.addClass("active").siblings().removeClass("active")
        $index = $li.index();
        console.log($index);
        $(".content>div").eq($index).addClass("active").siblings().removeClass("active");
    })
})

// $(function () {
//     $(".filter li").click(function () {
//         if ($(this).hasClass("active")) {
//             $(this).removeClass("active");
//             $(".card").each(function () {
//                 $(this).css('order', '1')
//             })
//         } else {
//             $(this).addClass("active").siblings().removeClass("active");
//             if ($(this).hasClass("rate")) {
//                 $(".card").each(function () {
//                     var cardRate = -(Math.floor(Number($(this).data('rate'))));
//                     $(this).css('order', cardRate);
//                 })
//             } else if ($(this).hasClass("price")) {
//                 $(".card").each(function () {
//                     var cardPrice = Math.floor(Number($(this).data('price')));
//                     $(this).css('order', cardPrice)
//                 })
//             }
//         }

//     })
// })