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
        
            // --- 新增：處理進場價格與張數合併邏輯 ---
            // 如果張數大於 1，顯示為 "價格(張數)"；否則只顯示 "價格"
            const entryDisplay = numQty > 1 ? `${avgEntry}(${numQty})` : avgEntry;
        
            $('<td/>').append(sheetName).appendTo($tr);
            $('<td/>').append(currentPrice).appendTo($tr);
            
            // 合併後的 TD
            $('<td/>').append(entryDisplay).appendTo($tr); 
            
            // 移除原本的 $('<td/>').append(quantity).appendTo($tr); 這一行
            
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
        
        // 1. 計算 30 天前的日期
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thresholdDate = thirtyDaysAgo.toISOString().split('T')[0];
        
        // 2. 濾出「已結案」且「日期在 30 天內」
        const recentSoldTrades = dailyTrades
            .filter(item => {
                return item.state === "sell" && item.time >= thresholdDate;
            })
            .reverse();
        
        // 3. 渲染到表格並計算總獲利
        let total30DayProfit = 0;
        let total30DayAmount = 0;
        let fixedTotal30DayProfit = 0;
        let fixedTotal30DayAmount = 0;
        
        $soldTable.find('tr:gt(0)').remove(); // 清空舊資料
        
        recentSoldTrades.forEach(item => {
            const { time, sheetName, avgEntry, quantity, benefit, rate } = item;
            const numRate = Number(rate) || 0;
            const numQty = Number(quantity) || 0;
        
            // 數據累加計算
            total30DayProfit += Number(benefit);
            const soldAmonut = Number(avgEntry) * numQty * 1000;
            total30DayAmount += soldAmonut;
            
            fixedTotal30DayProfit += 2000 * numQty * (numRate / 100);
            fixedTotal30DayAmount += 2000 * numQty;
        
            // --- 格式化顯示內容 ---
            
            // 進場均價(張數): 如果張數 > 1 才顯示括號
            const entryDisplay = numQty > 1 ? `${avgEntry}(${numQty})` : avgEntry;
            
            // 獲利金額(報酬率): 例如 19800(20%)
            const benefitDisplay = `${benefit}(${rate}%)`;
        
            const $tr = $('<tr/>');
            // 如果報酬率小於 0，加入 down class
            if (numRate < 0) { $tr.addClass('down'); }
        
            // 依照新的格式 append 欄位
            $('<td/>').text(time).appendTo($tr);
            $('<td/>').text(sheetName).appendTo($tr);
            $('<td/>').text(entryDisplay).appendTo($tr); // 合併後的均價與張數
            $('<td/>').text(benefitDisplay).appendTo($tr); // 合併後的獲利與報酬率
        
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
                // $('<td/>').text(item.avgEntry).appendTo($tr);
                // $('<td/>').text(item.quantity).appendTo($tr);
                $('<td/>').text(item.rate + "%").appendTo($tr);
                // const soldProfitAmount = 2000 * item.quantity * item.rate / 100;
                // $('<td/>').text(soldProfitAmount).appendTo($tr);
                // $('<td/>').text(item.benefit).appendTo($tr);
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
                // $('<td/>').text(item.avgEntry).appendTo($tr);
                // $('<td/>').text(item.quantity).appendTo($tr);
                // $('<td/>').text(item.rate + "%").appendTo($tr);
                $table.append($tr);
            });
        };

        // --- 渲染強勢股推薦表格 ---
        const renderStrongTable = (selector, strongData) => {
            const $table = $(selector);
            $table.find('tr:gt(0)').remove(); // 清空舊資料
        
            if (!strongData || strongData.length === 0) {
                $table.append('<tr><td colspan="4" style="text-align:center;">今日無強勢股推薦</td></tr>');
                return;
            }
        
            // 取得資料中最後一個日期（即最新推薦）
            const latestDate = strongData[strongData.length - 1].日期;
        
            strongData.filter(item => item.日期 === latestDate).forEach(item => {
                const $tr = $('<tr/>');
                $('<td/>').text(item.日期).appendTo($tr);
                $('<td/>').text(item["股票代號"]).css('font-weight', '700').appendTo($tr);
                $('<td/>').text(item["進場價格"]).appendTo($tr);
                $table.append($tr);
            });
        };

        // --- 執行渲染 ---
        if (lastSellDate) renderSellTable('.data-today-sell table', dailyTrades, lastSellDate);
        if (lastBuyDate) renderBuyTable('.data-today-buy table', dailyTrades, lastBuyDate);
        // 從 API 回傳的 strongMomentum 欄位抓取資料
        const strongStocks = Array.isArray(data.strongMomentum) ? data.strongMomentum : [];
        renderStrongTable('.data-today-strong table', strongStocks);

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


