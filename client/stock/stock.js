const API = "https://script.google.com/macros/s/AKfycbxGtR8NWam6AzC4-Onb8Jye4q6LKpQqifXIronmQtd0rMMjj4m2nukpX_wVW5MzwAzF3g/exec";

$(async function () {
    const $holdingsTable = $('#current-holdings .data-table');

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
        const todayHoldings = Array.isArray(data.todayHoldings) ? data.todayHoldings : [];

        // 1. 清空舊數據
        $holdingsTable.find('.table-body').empty();

        // 2. 初始化財務加總變數
        let totalInv = 0;
        let totalPL = 0;

        // 3. 一次性渲染表格與計算
        todayHoldings.forEach(item => {
            const { sheetName, avgEntry, quantity, currentPrice, rate, firstEntryDate } = item;
            const numQty = Number(quantity) || 0;
            const numRate = parseFloat(rate) || 0;

            // 計算財務指標 (1. 個股損益 = 進場張數 * 2000 * 報酬率)
            const itemProfit = numQty * 2000 * (numRate / 100);
            totalInv += numQty * 2000;
            totalPL += itemProfit; // (2. 持倉損益 = 全部進場中股票的個股損益相加)

            const $tr = $('<div class="table-row"/>').attr({
                'data-price': currentPrice,
                'data-rate': numRate,
                'data-qty': numQty
            });

            if (!isNaN(numRate) && numRate < 0) { $tr.addClass('down'); }

            // --- 新增：處理進場價格與張數合併邏輯 ---
            // 如果張數大於 1，顯示為 "價格(張數)"；否則只顯示 "價格"
            const entryDisplay = numQty > 1 ? `${avgEntry}(${numQty})` : avgEntry;

            $('<div class="table-cell"/>').append(sheetName).appendTo($tr);
            $('<div class="table-cell" style="justify-content: flex-end; text-align: right;"/>').append(currentPrice).appendTo($tr);

            // 計算持有天數
            let holdingDays = 0;
            if (firstEntryDate) {
                const entryDateObj = new Date(firstEntryDate);
                const nowDateObj = new Date();
                // 將時間歸零以計算純天數差異
                entryDateObj.setHours(0, 0, 0, 0);
                nowDateObj.setHours(0, 0, 0, 0);
                const diffTime = nowDateObj.getTime() - entryDateObj.getTime();
                holdingDays = Math.floor(diffTime / (1000 * 3600 * 24));
                if (holdingDays < 0) holdingDays = 0;
            }
            $('<div class="table-cell" style="justify-content: flex-end; text-align: right;"/>').append(holdingDays).appendTo($tr);

            // 合併後的 TD
            $('<div class="table-cell"/>').append(entryDisplay).appendTo($tr);

            // 針對報酬率獨立上色：若為負數則強制使用紅色
            const $rateCell = $('<div class="table-cell"/>').append(numRate + '%');
            if (numRate < 0) {
                $rateCell.css('color', 'var(--danger-color)');
            }
            $rateCell.appendTo($tr);

            $holdingsTable.find('.table-body').append($tr);
        });

        // --- 加入「查看全部」邏輯 ---
        $holdingsTable.find('.view-all-btn').remove();
        const $holdingRows = $holdingsTable.find('.table-body .table-row');
        if ($holdingRows.length > 10) {
            $holdingRows.each(function (i) {
                if (i >= 10) $(this).addClass('hidden-row');
            });
            const $viewAllBtn = $('<div class="view-all-btn">查看全部 ▼</div>');
            $viewAllBtn.on('click', function () {
                $holdingsTable.find('.hidden-row').removeClass('hidden-row');
                $(this).remove();
            });
            $holdingsTable.append($viewAllBtn);
        }

        // 4. 更新看板數據
        $('#holding-shares-count').text(todayHoldings.length);
        $('#holding-investment-amount').text(Math.round(totalInv).toLocaleString());

        const $plEl = $('#holding-profit-loss');
        const totalPLRate = totalInv > 0 ? (totalPL / totalInv * 100) : 0;
        $plEl.text(Math.round(totalPL).toLocaleString() + '(' + Math.round(totalPLRate).toLocaleString() + '%)');
        $plEl.css('color', totalPL >= 0 ? '#66BB6A' : '#EF5350');

        /**
         * 歷史紀錄數據
         */
        const $soldTable = $('#sold-stocks .data-table');
        const dailyTrades = Array.isArray(data.dailyTrades) ? data.dailyTrades : [];

        // --- 獨立計算總覽卡片的「近30天累計」賣出定額收益 ---
        const summaryNow = new Date();
        const summary30DaysAgo = new Date();
        summary30DaysAgo.setDate(summaryNow.getDate() - 30);
        const sumY = summary30DaysAgo.getFullYear();
        const sumM = String(summary30DaysAgo.getMonth() + 1).padStart(2, '0');
        const sumD = String(summary30DaysAgo.getDate()).padStart(2, '0');
        const summaryStartDate = `${sumY}-${sumM}-${sumD}`;

        let sum30Profit = 0;
        let sum30Amount = 0;
        dailyTrades.filter(item => item.state === "sell" && item.time >= summaryStartDate).forEach(item => {
            const numQty = Number(item.quantity) || 0;
            const numRate = parseFloat(item.rate) || 0;
            sum30Profit += 2000 * numQty * (numRate / 100);
            sum30Amount += 2000 * numQty;
        });
        const sum30Rate = sum30Amount > 0 ? (sum30Profit / sum30Amount * 100) : 0;
        $('#sell-month-profit-loss').siblings('span').text('賣出收益(近30天累計)');
        $('#sell-month-profit-loss').text(Math.round(sum30Profit).toLocaleString() + '(' + Math.round(sum30Rate).toLocaleString() + '%)');

        // --- 動態產生下拉選單選項：近30天 + 近6個單月 ---
        const $periodSelect = $('#sold-period-select');
        $periodSelect.empty();
        $periodSelect.append('<option value="30days" selected>近30天</option>');
        for (let i = 0; i < 6; i++) {
            const d = new Date(summaryNow.getFullYear(), summaryNow.getMonth() - i, 1);
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            $periodSelect.append(`<option value="${y}-${m}">${y}/${m}</option>`);
        }

        function renderSoldTable(period) {
            const now = new Date();
            let startDate = '';
            let endDate = '9999-12-31';
            let periodLabel = '';

            if (period === '30days') {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(now.getDate() - 30);
                const y = thirtyDaysAgo.getFullYear();
                const m = String(thirtyDaysAgo.getMonth() + 1).padStart(2, '0');
                const d = String(thirtyDaysAgo.getDate()).padStart(2, '0');
                startDate = `${y}-${m}-${d}`;
                periodLabel = '近30天';
            } else {
                // 處理 YYYY-MM 格式
                const [yStr, mStr] = period.split('-');
                const year = parseInt(yStr, 10);
                const month = parseInt(mStr, 10) - 1;

                const firstDay = new Date(year, month, 1);
                const lastDay = new Date(year, month + 1, 0);

                const y1 = firstDay.getFullYear();
                const m1 = String(firstDay.getMonth() + 1).padStart(2, '0');
                const d1 = String(firstDay.getDate()).padStart(2, '0');
                const y2 = lastDay.getFullYear();
                const m2 = String(lastDay.getMonth() + 1).padStart(2, '0');
                const d2 = String(lastDay.getDate()).padStart(2, '0');
                startDate = `${y1}-${m1}-${d1}`;
                endDate = `${y2}-${m2}-${d2}`;
                periodLabel = `${yStr}/${mStr}`;
            }

            // 濾出「已結案」且「符合日期區間」的資料
            const recentSoldTrades = dailyTrades
                .filter(item => item.state === "sell" && item.time >= startDate && item.time <= endDate)
                .reverse();

            let totalProfit = 0;
            let totalAmount = 0;

            $soldTable.find('.table-body').empty(); // 清空舊資料

            recentSoldTrades.forEach(item => {
                const { time, sheetName, avgEntry, quantity, benefit, rate } = item;
                const numRate = parseFloat(rate) || 0;
                const numQty = Number(quantity) || 0;

                totalProfit += Number(benefit);
                totalAmount += Number(avgEntry) * numQty * 1000;

                const entryDisplay = numQty > 1 ? `${avgEntry}(${numQty})` : avgEntry;
                const benefitDisplay = `${benefit}(${numRate}%)`;

                const $tr = $('<div class="table-row"/>');
                if (numRate < 0) { $tr.addClass('down'); }

                $('<div class="table-cell"/>').text(time).appendTo($tr);
                $('<div class="table-cell"/>').text(sheetName).appendTo($tr);
                $('<div class="table-cell"/>').text(entryDisplay).appendTo($tr);
                $('<div class="table-cell"/>').text(benefitDisplay).appendTo($tr);

                $soldTable.find('.table-body').append($tr);
            });

            // --- 加入「查看全部」邏輯 ---
            $soldTable.find('.view-all-btn').remove();
            const $soldRows = $soldTable.find('.table-body .table-row');
            if ($soldRows.length > 10) {
                $soldRows.each(function (i) {
                    if (i >= 10) $(this).addClass('hidden-row');
                });
                const $viewAllBtn = $('<div class="view-all-btn">查看全部 ▼</div>');
                $viewAllBtn.on('click', function () {
                    $soldTable.find('.hidden-row').removeClass('hidden-row');
                    $(this).remove();
                });
                $soldTable.append($viewAllBtn);
            }

            // 填入總獲利與報酬率
            const totalRate = totalAmount > 0 ? (totalProfit / totalAmount * 100) : 0;
            $('#sold-stocks .month-profit-loss span').text(Math.round(totalProfit).toLocaleString() + '(' + Math.round(totalRate).toLocaleString() + '%)');
        }

        // 綁定下拉選單變更事件
        $('#sold-period-select').on('change', function () {
            renderSoldTable($(this).val());
        });

        // 預設載入近30天
        renderSoldTable('30days');

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
            $table.find('.table-body').empty();

            trades.filter(t => t.time === targetDate && t.state === 'sell').forEach(item => {
                const $tr = $('<div class="table-row"/>');
                $('<div class="table-cell"/>').text(item.time).appendTo($tr);
                $('<div class="table-cell"/>').text(item.sheetName).appendTo($tr);
                const numRate = parseFloat(item.rate) || 0;
                $('<div class="table-cell"/>').text(numRate + "%").appendTo($tr);
                $table.find('.table-body').append($tr);
            });
        };

        // --- 渲染買進表格 ---
        const renderBuyTable = (selector, trades, targetDate) => {
            const $table = $(selector);
            $table.find('.table-body').empty();

            trades.filter(t => t.time === targetDate && t.state === 'buy').forEach(item => {
                const $tr = $('<div class="table-row"/>');
                $('<div class="table-cell"/>').text(item.time).appendTo($tr);
                $('<div class="table-cell"/>').text(item.sheetName).appendTo($tr);
                $('<div class="table-cell"/>').text(item.benefit).appendTo($tr);
                $table.find('.table-body').append($tr);
            });
        };

        // --- 渲染強勢股推薦表格 ---
        const renderStrongTable = (selector, strongData) => {
            const $table = $(selector);
            $table.find('.table-body').empty(); // 清空舊資料

            if (!strongData || strongData.length === 0) {
                $table.find('.table-body').append('<div class="table-row"><div class="table-cell" style="grid-column: 1 / -1; justify-content: center; color: var(--text-secondary);">今日無強勢股推薦</div></div>');
                return;
            }

            // 取得資料中最後一個日期（即最新推薦）
            const latestDate = strongData[strongData.length - 1].日期;

            strongData.filter(item => item.日期 === latestDate).forEach(item => {
                const $tr = $('<div class="table-row"/>');
                $('<div class="table-cell"/>').text(item.日期).appendTo($tr);
                $('<div class="table-cell"/>').text(item["股票代號"]).css('font-weight', '700').appendTo($tr);
                $('<div class="table-cell"/>').text(item["進場價格"]).appendTo($tr);
                $table.find('.table-body').append($tr);
            });
        };

        // --- 執行渲染 ---
        if (lastSellDate) renderSellTable('#today-sell .data-table', dailyTrades, lastSellDate);
        if (lastBuyDate) renderBuyTable('#today-buy .data-table', dailyTrades, lastBuyDate);
        // 從 API 回傳的 strongMomentum 欄位抓取資料
        const strongStocks = Array.isArray(data.strongMomentum) ? data.strongMomentum : [];
        renderStrongTable('#today-strong .data-table', strongStocks);

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

// 排序功能 (點擊 header cell 觸發)
$(document).on('click', '#current-holdings .table-header .table-cell', function () {
    const index = $(this).index();
    const $table = $(this).closest('.data-table');
    const rows = $table.find('.table-body .table-row').toArray();
    const isAsc = !$(this).hasClass('sort-asc');

    $table.find('.table-header .table-cell').removeClass('sort-asc sort-desc');
    $(this).addClass(isAsc ? 'sort-asc' : 'sort-desc');

    rows.sort((a, b) => {
        let valA = $(a).children('.table-cell').eq(index).text().replace('%', '');
        let valB = $(b).children('.table-cell').eq(index).text().replace('%', '');
        return isAsc ? (valA - valB || valA.localeCompare(valB)) : (valB - valA || valB.localeCompare(valA));
    });
    $table.find('.table-body').append(rows);

    // 排序後若有「查看全部」按鈕，需重新套用隱藏邏輯 (顯示排序後的前 10 筆)
    if ($table.find('.view-all-btn').length > 0) {
        $table.find('.table-body .table-row').each(function (i) {
            if (i >= 10) {
                $(this).addClass('hidden-row');
            } else {
                $(this).removeClass('hidden-row');
            }
        });
    }
});

// --- 主題切換功能 ---
$(function () {
    const $themeToggle = $('#theme-toggle');
    const $iconSun = $themeToggle.find('.icon-sun');
    const $iconMoon = $themeToggle.find('.icon-moon');
    const $themeColorMeta = $('meta[name="theme-color"]');

    function updateThemeUI(isLight) {
        if (isLight) {
            $iconSun.hide();
            $iconMoon.show();
            $themeColorMeta.attr('content', '#F4F6F8');
        } else {
            $iconSun.show();
            $iconMoon.hide();
            $themeColorMeta.attr('content', '#121212');
        }
    }

    // 初始化 Icon 與 Meta Color
    updateThemeUI($('#theme-light-css').length > 0);

    $themeToggle.on('click', function () {
        let isLight = $('#theme-light-css').length > 0;

        if (isLight) {
            $('#theme-light-css').remove();
            localStorage.setItem('theme', 'dark');
            updateThemeUI(false);
        } else {
            $('head').append('<link rel="stylesheet" href="theme-light.css" id="theme-light-css">');
            localStorage.setItem('theme', 'light');
            updateThemeUI(true);
        }
    });
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
