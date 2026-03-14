const API = "https://script.google.com/macros/s/AKfycbxGtR8NWam6AzC4-Onb8Jye4q6LKpQqifXIronmQtd0rMMjj4m2nukpX_wVW5MzwAzF3g/exec";

$(async function () {
    const $holdingsTable = $('.data-holdings table');

    //執行載入動畫
    const $status = $('p.results'); // 確保有這個元素顯示狀態
    $('body').addClass('loading-view');

    try {
        $status.text('資料載入中…');
        const data = await $.getJSON(API);
        if (!data.ok) { $status.text('錯誤：' + (data.message || '未知錯誤')); return; }


        /**
         * 持倉數據
         */

        const todayHoldings = Array.isArray(data.dayReport) ? data.dayReport : [];

        // 1. 清空舊數據
        $holdingsTable.find('tr:gt(0)').remove();

        // 2. 初始化財務加總變數
        let totalInv = 0;
        let totalPL = 0;

        // 3. 一次性渲染表格與計算
        todayHoldings.forEach(item => {
            const { sheetName, avgEntry, quantity, currentPrice, rate } = item;
            const numQty = Number(quantity) || 0;
            const numRate = Number(rate) || 0;

            // 計算財務指標
            totalInv += numQty * 2000;
            totalPL += (numQty * 2000 * (numRate / 100));

            const $tr = $('<tr/>').attr({
                'data-price': currentPrice,
                'data-rate': numRate,
                'data-qty': numQty
            });

            if (!isNaN(numRate) && numRate < 0) { $tr.addClass('down'); }

            $('<td/>').append(sheetName).appendTo($tr);
            $('<td/>').append(currentPrice).appendTo($tr);
            $('<td/>').append(avgEntry).appendTo($tr);
            $('<td/>').append(quantity).appendTo($tr);
            $('<td/>').append(rate + "%").appendTo($tr);

            $holdingsTable.append($tr);
        });

        // 4. 更新看板數據
        $('#holding-shares-count').text(todayHoldings.length);
        $('#holding-investment-amount').text(Math.round(totalInv).toLocaleString());

        const $plEl = $('#holding-profit-loss');
        $plEl.text(Math.round(totalPL).toLocaleString());
        $plEl.css('color', totalPL >= 0 ? '#ff4d4d' : '#2ecc71');

        /**
         * 歷史紀錄數據
         */
        const $soldTable = $('.data-sold table');
        const dailyTrades = Array.isArray(data.finishStock) ? data.finishStock : [];

        // 1. 計算 30 天前的日期 (格式化為 yyyy-MM-dd 以便比較)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        // 轉成字串格式 "yyyy-mm-dd" (需確保與您的 time 欄位格式一致)
        const thresholdDate = thirtyDaysAgo.toISOString().split('T')[0];

        // 2. 先濾出「已結案」且「日期在 30 天內」的資料
        const recentSoldTrades = dailyTrades
            .filter(item => {
                return item.state === "sell" && item.time >= thresholdDate;
            })
            .reverse(); // 最新日期在前

        // 3. 渲染到表格並計算總獲利
        let total30DayProfit = 0; // 用於累加獲利
        let total30DayAmount = 0; // 用於累加報酬率
        let fixedTotal30DayProfit = 0; // 用於定額累加獲利
        let fixedTotal30DayAmount = 0; // 用於定額累加報酬率

        $soldTable.find('tr:gt(0)').remove(); // 清空舊資料

        recentSoldTrades.forEach(item => {
            const { time, sheetName, avgEntry, quantity, benefit, rate, state } = item;
            const numRate = Number(rate) || 0;

            total30DayProfit += Number(benefit); // 累加總額
            // 計算單筆投資金額 (公式: 2000 * 張數)
            // const soldAmonut = 2000 * Number(quantity);
            const soldAmonut = Number(avgEntry) * Number(quantity) * 1000;
            total30DayAmount += soldAmonut; // 累加總額
            // 定額
            // 計算單筆獲利金額 (公式: 2000 * 張數 * 報酬率%)
            fixedTotal30DayProfit += 2000 * Number(quantity) * (numRate / 100); // 定額累加總額
            fixedTotal30DayAmount += 2000 * Number(quantity);

            const $tr = $('<tr/>');
            if (!isNaN(numRate) && numRate < 0) { $tr.addClass('down'); }

            $('<td/>').append(time).appendTo($tr);
            $('<td/>').append(sheetName).appendTo($tr);
            $('<td/>').append(avgEntry).appendTo($tr);
            $('<td/>').append(quantity).appendTo($tr);
            $('<td/>').append(rate + "%").appendTo($tr);
            $('<td/>').append(benefit).appendTo($tr); // 顯示單筆獲利

            $soldTable.append($tr);
        });

        // 4. 將總獲利填入指定欄位
        const total30DayRate = total30DayProfit / total30DayAmount * 100;
        $('.month-profit-loss span').text(Math.round(total30DayProfit).toLocaleString() + '(' + Math.round(total30DayRate).toLocaleString() + '%)');

        // 5. 將定額總獲利更新看板數據
        const fixedTotal30DayRate = fixedTotal30DayProfit / fixedTotal30DayAmount * 100;
        $('#sell-month-profit-loss').text(Math.round(fixedTotal30DayProfit).toLocaleString() + '(' + Math.round(fixedTotal30DayRate).toLocaleString() + '%)');

        /**
         * 今日數據
         */

        // --- 輔助函式：取得該 state 最後一筆的日期 ---
        const getLastDateByState = (trades, state) => {
            const filtered = trades.filter(t => t.state === state);
            if (filtered.length === 0) return null;
            // 假設 time 格式為 yyyy-MM-dd，直接比較字串即可
            return filtered[filtered.length - 1].time;
        };

        // 取得兩個不同的日期
        const lastSellDate = getLastDateByState(dailyTrades, "sell");
        const lastBuyDate = getLastDateByState(dailyTrades, "buy");

        // --- 渲染賣出表格 ---
        const renderSellTable = (selector, trades, targetDate) => {
            const $table = $(selector);
            $table.find('tr:gt(0)').remove();

            trades.filter(t => t.time === targetDate && t.state === 'sell').forEach(item => {
                const $tr = $('<tr/>');
                $('<td/>').text(item.time).appendTo($tr);
                $('<td/>').text(item.sheetName).appendTo($tr);
                $('<td/>').text(item.avgEntry).appendTo($tr);
                $('<td/>').text(item.quantity).appendTo($tr);
                $('<td/>').text(item.rate + "%").appendTo($tr);
                // const soldProfitAmount = 2000 * item.quantity * item.rate / 100;
                // $('<td/>').text(soldProfitAmount).appendTo($tr);
                $('<td/>').text(item.benefit).appendTo($tr);
                $table.append($tr);
            });
        };

        // --- 渲染買進表格 ---
        const renderBuyTable = (selector, trades, targetDate) => {
            const $table = $(selector);
            $table.find('tr:gt(0)').remove();

            trades.filter(t => t.time === targetDate && t.state === 'buy').forEach(item => {
                const $tr = $('<tr/>');
                $('<td/>').text(item.time).appendTo($tr);
                $('<td/>').text(item.sheetName).appendTo($tr);
                $('<td/>').text(item.benefit).appendTo($tr);
                $('<td/>').text(item.avgEntry).appendTo($tr);
                $('<td/>').text(item.quantity).appendTo($tr);
                $('<td/>').text(item.rate + "%").appendTo($tr);
                $table.append($tr);
            });
        };

        // --- 執行渲染 ---
        if (lastSellDate) renderSellTable('.data-today-sell table', dailyTrades, lastSellDate);
        if (lastBuyDate) renderBuyTable('.data-today-buy table', dailyTrades, lastBuyDate);

        //載入完成後動作
        $status.text('載入完成');
        //顯示更新時間
        const $updateTime = $('.data-update-time');
        $updateTime.text(getLastUpdateLabel());
        setTimeout(() => {
            $('body').removeClass('loading-view');
        }, 1000);

    } catch (err) {
        $status.text('請求失敗：' + err);
        console.error(err);
    }
});

// 排序功能 (點擊 th 觸發)
$(document).on('click', '.data-holdings table th', function () {
    const index = $(this).index();
    const $table = $(this).closest('table');
    const rows = $table.find('tr:gt(0)').toArray();
    const isAsc = !$(this).hasClass('sort-asc');

    $table.find('th').removeClass('sort-asc sort-desc');
    $(this).addClass(isAsc ? 'sort-asc' : 'sort-desc');

    rows.sort((a, b) => {
        let valA = $(a).children('td').eq(index).text().replace('%', '');
        let valB = $(b).children('td').eq(index).text().replace('%', '');
        return isAsc ? (valA - valB || valA.localeCompare(valB)) : (valB - valA || valB.localeCompare(valA));
    });
    $table.append(rows);
});

// --- 工具函式：計算最後更新時間 (每天 14:15) ---
function getLastUpdateLabel() {
    const now = new Date();
    const updateTimeToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 15, 0);

    let displayDate = new Date();
    // 如果現在時間還沒到今天的 14:15，則顯示日期為昨天
    if (now < updateTimeToday) {
        displayDate.setDate(now.getDate() - 1);
    }

    const y = displayDate.getFullYear();
    const m = String(displayDate.getMonth() + 1).padStart(2, '0');
    const d = String(displayDate.getDate()).padStart(2, '0');

    return `最後更新：${y}-${m}-${d} 14:15`;
}


