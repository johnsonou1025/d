const API = "https://script.google.com/macros/s/AKfycbwiH2P10Y0He-7WgFtBq_7xswWLWQHVJ8TVWWtaA4i9GGI7sda_cIB6C7wlDmLZfPgW1Q/exec";
const CACHE_KEY = "JOINJO_STOCK_CACHE_V2";
let lastFetchTimestamp = 0;

/**
 * 檢查當前時間是否處於 14:15 ~ 14:30 的即時更新區間
 */
function isLiveUpdateWindow(date = new Date()) {
    const h = date.getHours();
    const m = date.getMinutes();
    // 2:15 PM (14:15) ~ 2:30 PM (14:30)
    return (h === 14 && m >= 15 && m <= 30);
}

/**
 * 檢查快取資料是否仍然有效
 * 1. 若當前處於 14:15 ~ 14:30 即時區間 -> 一律回傳 false (必須發送請求獲取最新數據)
 * 2. 其它時段：
 *    - 若現在已過今天 14:15 -> 最近一次更新時間點為「今天 14:15」
 *    - 若現在尚未到今天 14:15 -> 最近一次更新時間點為「昨天 14:15」
 *    - 如果快取時間 >= 最近一次 14:15 更新點 -> 有效！
 */
function isCacheValid(cacheObj) {
    if (!cacheObj || !cacheObj.data || !cacheObj.timestamp) return false;

    const now = new Date();
    // 處於即時更新時段強制失效，以取得最新盤後數據
    if (isLiveUpdateWindow(now)) {
        return false;
    }

    const todayTarget = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 15, 0, 0);
    let latestTargetTime;

    if (now >= todayTarget) {
        latestTargetTime = todayTarget;
    } else {
        latestTargetTime = new Date(todayTarget);
        latestTargetTime.setDate(latestTargetTime.getDate() - 1);
    }

    return cacheObj.timestamp >= latestTargetTime.getTime();
}

function getCachedData() {
    try {
        const item = localStorage.getItem(CACHE_KEY);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.warn('[JOINJO] 讀取 localStorage 快取失敗:', e);
        return null;
    }
}

function setCachedData(rawData) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: rawData,
            timestamp: Date.now()
        }));
    } catch (e) {
        console.warn('[JOINJO] 寫入 localStorage 快取失敗:', e);
    }
}

/**
 * 載入股票數據：優先使用快取，14:15~14:30 或快取過期時連線抓取
 */
async function loadStockData(forceRefresh = false) {
    const $status = $('p.results');
    const isLive = isLiveUpdateWindow();
    const cached = getCachedData();

    let rawData = null;
    let isFromCache = false;
    let dataTimestamp = Date.now();

    // 判斷是否使用快取
    if (!forceRefresh && !isLive && isCacheValid(cached)) {
        rawData = cached.data;
        isFromCache = true;
        dataTimestamp = cached.timestamp;
        console.log('⚡ [JOINJO] 命中本機快取，免發送 API 請求 (快取建立於: ' + new Date(cached.timestamp).toLocaleString() + ')');
    } else {
        $('body').addClass('loading-view');
        $status.text(isLive ? '2:15 PM 盤後結算即時更新中…' : '資料載入中…');

        try {
            rawData = await $.getJSON(API);
            if (!rawData || !rawData.ok) {
                throw new Error((rawData && rawData.message) || '未知錯誤');
            }
            setCachedData(rawData);
            lastFetchTimestamp = Date.now();
            dataTimestamp = lastFetchTimestamp;
            console.log('🌐 [JOINJO] 已自 API 獲取最新數據並寫入快取');
        } catch (err) {
            console.error('🌐 [JOINJO] API 請求失敗:', err);
            // 異常容錯降級：若網路連線中斷但已有舊快取可用，改用舊快取避免頁面空白
            if (cached && cached.data) {
                console.warn('⚠️ [JOINJO] 網路請求失敗，改以舊快取數據降級呈現');
                rawData = cached.data;
                isFromCache = true;
                dataTimestamp = cached.timestamp;
            } else {
                $status.text('錯誤：' + (err.message || '未知錯誤'));
                return;
            }
        }
    }

    try {
        renderDashboard(rawData, isFromCache, dataTimestamp);
    } catch (renderErr) {
        console.error('渲染儀表板發生錯誤:', renderErr);
        $status.text('渲染錯誤：' + renderErr.message);
    }
}

/**
 * 渲染全站儀表板數據
 */
function renderDashboard(rawData, isFromCache, dataTimestamp) {
    const $holdingsTable = $('#current-holdings .data-table');
    const $status = $('p.results');

    // 渲染市場指數看板
    if (rawData.marketStatus && typeof renderMarketSummary === 'function') {
        renderMarketSummary(rawData.marketStatus);
    }

    // 渲染外部數據 (匯率、期貨)
    if (typeof renderExternalData === 'function') {
        renderExternalData(!isFromCache);
    }

    // 將新版 API 的資料結構映射為原先程式預期的格式
    // 由於新 API 的 dailyTrades 和 strongSectors 預設為倒序(最新在前)，在此反轉回正序以配合原程式的計算邏輯
    const data = {
            todayHoldings: (rawData.todayHoldings || []).map(item => ({
                sheetName: item.stockInfo || item.sheetName,
                avgEntry: item.avgPrice || item.avgEntry,
                quantity: item.quantity,
                currentPrice: item.marketPrice || item.currentPrice,
                rate: item.roi || item.rate,
                firstEntryDate: item.entryDate || item.firstEntryDate
            })),
            dailyTrades: (rawData.dailyTrades || []).map(item => ({
                state: item.action || item.state,
                time: item.date || item.time,
                rate: item.roi || item.rate,
                benefit: item.pnlOrCost || item.benefit,
                quantity: item.shares || item.quantity,
                avgEntry: item.price || item.avgEntry,
                sheetName: item.name || item.sheetName
            })).reverse(),
            strongSectors: (rawData.strongSectors || []).map(item => ({
                date: item.date,
                sectorName: item.sectorName,
                strengthScore: item.strengthScore
            })).reverse()
        };


        /**
         * 持倉數據
         */
        const todayHoldings = Array.isArray(data.todayHoldings) ? data.todayHoldings : [];

        // 1. 清空舊數據
        $holdingsTable.find('.table-body').empty();

        // 1.5 預先計算持有天數並排序 (由小到大)
        todayHoldings.forEach(item => {
            let holdingDays = 0;
            if (item.firstEntryDate) {
                const entryDateObj = new Date(item.firstEntryDate);
                const nowDateObj = new Date();
                entryDateObj.setHours(0, 0, 0, 0);
                nowDateObj.setHours(0, 0, 0, 0);
                const diffTime = nowDateObj.getTime() - entryDateObj.getTime();
                holdingDays = Math.floor(diffTime / (1000 * 3600 * 24));
                if (holdingDays < 0) holdingDays = 0;
            }
            item._holdingDays = holdingDays;
        });
        todayHoldings.sort((a, b) => a._holdingDays - b._holdingDays);

        // 3. 一次性渲染表格與計算
        todayHoldings.forEach(item => {
            const { sheetName, avgEntry, quantity, currentPrice, rate, firstEntryDate } = item;
            const numQty = Number(quantity) || 0;
            const numShares = numQty * 1000; // 1張 = 1000股
            const numRate = parseFloat(rate) || 0;
            const numAvgEntry = parseFloat(avgEntry) || 0;
            const numCurrentPrice = parseFloat(currentPrice) || 0;

            const $tr = $('<div class="table-row"/>').attr({
                'data-price': currentPrice,
                'data-rate': numRate,
                'data-qty': numShares
            });

            if (!isNaN(numRate) && numRate < 0) { $tr.addClass('down'); }

            $('<div class="table-cell"/>').append(sheetName).appendTo($tr);

            // 計算持有天數
            let holdingDays = item._holdingDays;
            const $daysCell = $('<div class="table-cell"/>');
            const $daysBadge = $('<span class="holding-days-badge"/>').text(holdingDays);

            if (holdingDays > 90) {
                $daysBadge.addClass('holding-days-long');
            } else if (holdingDays > 30) {
                $daysBadge.addClass('holding-days-medium');
            } else {
                $daysBadge.addClass('holding-days-short');
            }
            $daysCell.append($daysBadge).appendTo($tr);

            // 進場均價與進場股數 (套用手機版隱藏 class)
            $('<div class="table-cell hide-on-mobile"/>').append(numAvgEntry).appendTo($tr);
            $('<div class="table-cell hide-on-mobile"/>').append(numShares.toLocaleString()).appendTo($tr);

            $('<div class="table-cell"/>').append(numCurrentPrice).appendTo($tr);

            // 針對報酬率獨立上色：若為負數則強制使用紅色
            const $rateCell = $('<div class="table-cell"/>');
            const ratePillClass = numRate < 0 ? 'rate-pill rate-down' : 'rate-pill rate-up';
            const rateSign = numRate > 0 ? '+' : '';
            $('<span/>').addClass(ratePillClass).text(rateSign + numRate + '%').appendTo($rateCell);
            $rateCell.appendTo($tr);

            $holdingsTable.find('.table-body').append($tr);
        });

        // --- 加入「查看全部」邏輯 ---
        $holdingsTable.find('.view-all-btn').remove();
        const $holdingRows = $holdingsTable.find('.table-body .table-row');
        if ($holdingRows.length > 5) {
            $holdingRows.each(function (i) {
                if (i >= 5) $(this).addClass('hidden-row');
            });
            const $viewAllBtn = $('<div class="view-all-btn">查看全部 ▼</div>');
            $viewAllBtn.on('click', function () {
                $holdingsTable.find('.hidden-row').removeClass('hidden-row');
                $(this).remove();
            });
            $holdingsTable.append($viewAllBtn);
        }

        // 4. 更新看板數據

        // 更新進場中股票的持倉總數
        $('#total-holding-count b').text(todayHoldings.length);

        /**
         * 歷史紀錄數據
         */
        const $soldTable = $('#sold-stocks .data-table');
        const dailyTrades = Array.isArray(data.dailyTrades) ? data.dailyTrades : [];

        // --- 操作績效：依照年份動態渲染 ---
        function renderOperationsByYear(year) {
            $('.ops-year-label').text(year + ' '); // 在年份後加上空格

            // 1. 整體數據總覽
            const sellTradesByYear = dailyTrades.filter(item => item.state === "sell" && item.time && String(item.time).includes(year));

            let profitTradesCount = 0;
            let lossTradesCount = 0;
            let totalProfitYear = 0;

            sellTradesByYear.forEach(item => {
                const rate = parseFloat(item.rate);
                // 報酬率 > 0 才算正獲利, 其餘 (<= 0 或無效值) 都計入負獲利, 確保總數相符
                if (rate > 0) {
                    profitTradesCount++;
                } else {
                    lossTradesCount++;
                }
                // 確保文字轉數字時不會因為包含逗號等格式而出錯
                totalProfitYear += (Number(String(item.benefit).replace(/,/g, '')) || 0);
            });

            const totalTrades = sellTradesByYear.length;

            // 更新圖例數據
            $('#overall-profit-count').text(profitTradesCount);
            $('#overall-loss-count').text(lossTradesCount);

            // 更新圖表中心總獲利
            const $profitEl = $('#overall-total-profit');
            $profitEl.text(Math.round(totalProfitYear).toLocaleString());
            $profitEl.css('color', totalProfitYear >= 0 ? 'var(--success-color)' : 'var(--danger-color)');

            // 更新條形圖
            const profitPercentage = totalTrades > 0 ? (profitTradesCount / totalTrades) * 100 : 0;
            const lossPercentage = totalTrades > 0 ? (lossTradesCount / totalTrades) * 100 : 0;
            $('#profit-bar').css('width', profitPercentage + '%');
            $('#loss-bar').css('width', lossPercentage + '%');

            // 2. 獨立計算總覽卡片的賣出定額/定量收益
            function renderSummarySellCard(isQty = false) {
                let sumProfit = 0;
                let sumAmount = 0;

                const yInt = parseInt(year, 10);
                // 計算日期: 依照年份 01-01 ~ 12-31
                const startDate = new Date(yInt, 0, 1, 0, 0, 0, 0);
                const endDate = new Date(yInt, 11, 31, 23, 59, 59, 999);
                const now = new Date();

                let elapsedDays = 365; // 預設整年
                if (now.getFullYear() === yInt) {
                    elapsedDays = Math.max(1, (now - startDate) / (1000 * 60 * 60 * 24)); // 當前年份只計算經過天數
                } else if (now.getFullYear() < yInt) {
                    elapsedDays = 0; // 未來年份防呆
                }

                dailyTrades.filter(item => {
                    if (item.state !== "sell" || !item.time) return false;
                    // 安全轉型為時間物件，精準篩選範圍
                    const tradeDate = new Date(item.time);
                    return tradeDate >= startDate && tradeDate <= endDate;
                }).forEach(item => {
                    const numQty = Number(item.quantity) || 0;     // 個股張數
                    const numRate = parseFloat(item.rate) || 0;    // 報酬率
                    const numAvgEntry = parseFloat(item.avgEntry) || 0;

                    if (isQty) {
                        // 定量操作 (20股):
                        const itemProfit = numAvgEntry * (numQty * 20) * (numRate / 100);
                        sumProfit += itemProfit;
                        sumAmount += numAvgEntry * (numQty * 20);
                    } else {
                        // 定額操作 (2000NT):
                        const itemProfit = numQty * 2000 * numRate / 100;
                        sumProfit += itemProfit;
                        sumAmount += 2000 * numQty;
                    }
                });

                const sumRate = sumAmount > 0 ? (sumProfit / sumAmount * 100) : 0;

                const $invEl = isQty ? $('#sold-investment-amount-qty') : $('#sold-investment-amount');
                $invEl.text(Math.round(sumAmount).toLocaleString());

                const $targetEl = isQty ? $('#sell-month-profit-loss-qty') : $('#sell-month-profit-loss');
                $targetEl.text(Math.round(sumProfit).toLocaleString() + '(' + Math.round(sumRate).toLocaleString() + '%)');
                $targetEl.css('color', sumProfit >= 0 ? 'var(--success-color)' : 'var(--danger-color)');

                // 計算年化報酬率 (IRR)
                let irr = 0;
                if (sumAmount > 0 && elapsedDays > 0) {
                    irr = (Math.pow(1 + (sumProfit / sumAmount), 365 / elapsedDays) - 1) * 100;
                }
                const $irrEl = isQty ? $('#sell-month-irr-qty') : $('#sell-month-irr');
                $irrEl.text(irr.toFixed(2) + '%').css('color', irr >= 0 ? 'var(--success-color)' : 'var(--danger-color)');
            }

            renderSummarySellCard(false); // 定額操作
            renderSummarySellCard(true);  // 定量操作
        }

        // 綁定操作績效年份切換事件 (Tab)
        $('#operations-year-tabs .year-tab').on('click', function () {
            if ($(this).hasClass('active')) return;
            $('#operations-year-tabs .year-tab').removeClass('active');
            $(this).addClass('active');
            renderOperationsByYear($(this).attr('data-year'));
        });

        // 預設載入 2026 年數據
        renderOperationsByYear('2026');

        const $periodSelect = $('#sold-period-select');
        const summaryNow = new Date();

        // --- 動態產生下拉選單選項：近30天 + 近6個單月 ---
        $periodSelect.empty();
        $periodSelect.append('<option value="30days" selected>近30天</option>');
        for (let i = 0; i < 6; i++) {
            const d = new Date(summaryNow.getFullYear(), summaryNow.getMonth() - i, 1);
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const optionHtml = `<option value="${y}-${m}">${y}/${m}</option>`;
            $periodSelect.append(optionHtml);
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
                totalAmount += Number(avgEntry) * numQty * 2000; // 修正為與定額操作一致的計算基準

                const entryDisplay = numQty > 1 ? `${avgEntry}(${numQty})` : avgEntry;
                const benefitDisplay = `${Math.round(benefit).toLocaleString()}(${numRate}%)`;

                const $tr = $('<div class="table-row"/>');
                if (numRate < 0) { $tr.addClass('down'); }

                $('<div class="table-cell"/>').text(time).appendTo($tr);
                $('<div class="table-cell"/>').text(sheetName).appendTo($tr);
                $('<div class="table-cell"/>').text(entryDisplay).appendTo($tr);

                const $soldRateCell = $('<div class="table-cell"/>');
                const soldPillClass = numRate < 0 ? 'rate-pill rate-down' : 'rate-pill rate-up';
                const soldSign = (numRate > 0 && Number(benefit) > 0) ? '+' : '';
                const benefitText = `${soldSign}${Math.round(benefit).toLocaleString()} (${numRate}%)`;
                $('<span/>').addClass(soldPillClass).text(benefitText).appendTo($soldRateCell);
                $soldRateCell.appendTo($tr);

                $soldTable.find('.table-body').append($tr);
            });

            // --- 加入「查看全部」邏輯 ---
            $soldTable.find('.view-all-btn').remove();
            const $soldRows = $soldTable.find('.table-body .table-row');
            if ($soldRows.length > 5) {
                $soldRows.each(function (i) {
                    if (i >= 5) $(this).addClass('hidden-row');
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

        // --- 分析重複交易排行 ---
        const tradeStats = {};
        const sellTradesForRank = dailyTrades.filter(item => item.state === "sell");

        sellTradesForRank.forEach(item => {
            const name = item.sheetName;
            if (!tradeStats[name]) {
                tradeStats[name] = { name: name, sellCount: 0, totalProfit: 0 };
            }
            tradeStats[name].sellCount += 1; // 累加結算次數
            tradeStats[name].totalProfit += (Number(item.benefit) || 0); // 累加總獲利
        });

        // 僅篩選出「重覆出場 (sellCount > 1)」的股票
        const repeatedTrades = Object.values(tradeStats).filter(t => t.sellCount > 1);

        const positiveTrades = repeatedTrades
            .filter(t => t.totalProfit > 0)
            .sort((a, b) => b.sellCount - a.sellCount || b.totalProfit - a.totalProfit) // 降冪 (結算次數最高在前，若相同則獲利最高在前)
            .slice(0, 5);

        const renderRepeatedTable = (selector, trades, isProfit) => {
            const $table = $(selector);
            $table.find('.table-body').empty();

            if (trades.length === 0) {
                $table.find('.table-body').append('<div class="table-row"><div class="table-cell" style="grid-column: 1 / -1; justify-content: center; color: var(--text-secondary);">無符合資料</div></div>');
                return;
            }

            trades.forEach(t => {
                const $tr = $('<div class="table-row"/>');
                $('<div class="table-cell"/>').text(t.name).appendTo($tr);
                $('<div class="table-cell"/>').text(t.sellCount).appendTo($tr);
                const colorClass = isProfit ? 'color: var(--success-color);' : 'color: var(--danger-color);';
                $(`<div class="table-cell" style="${colorClass}"/>`).text(Math.round(t.totalProfit).toLocaleString()).appendTo($tr);
                $table.find('.table-body').append($tr);
            });
        };

        renderRepeatedTable('#top-profit-trades .data-table', positiveTrades, true);

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

        // 取得今天的日期字串 (YYYY-MM-DD)
        const getTodayString = () => {
            const today = new Date();
            const y = today.getFullYear();
            const m = String(today.getMonth() + 1).padStart(2, '0');
            const d = String(today.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        };
        // --- 渲染賣出表格 ---
        const renderSellTable = (selector, trades, targetDate) => {
            const $table = $(selector);
            $table.find('.table-body').empty();

            const filteredTrades = trades.filter(t => t.time === targetDate && t.state === 'sell');

            if (filteredTrades.length === 0) {
                $table.find('.table-body').append('<div class="table-row"><div class="table-cell" style="grid-column: 1 / -1; justify-content: center; color: var(--text-secondary);">今日無建議賣出股票</div></div>');
                return;
            }

            filteredTrades.forEach(item => {
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

            const filteredTrades = trades.filter(t => t.time === targetDate && t.state === 'buy');

            if (filteredTrades.length === 0) {
                $table.find('.table-body').append('<div class="table-row"><div class="table-cell" style="grid-column: 1 / -1; justify-content: center; color: var(--text-secondary);">今日無建議買進股票</div></div>');
                return;
            }

            filteredTrades.forEach(item => {
                const $tr = $('<div class="table-row"/>');
                $('<div class="table-cell"/>').text(item.time).appendTo($tr);
                $('<div class="table-cell"/>').text(item.sheetName).appendTo($tr);
                $('<div class="table-cell"/>').text(item.benefit).appendTo($tr);
                $table.find('.table-body').append($tr);
            });
        };
        // --- 渲染強勢類股推薦卡片 (Slot-Style Stock Grid - 橫向捲軸卡片) ---
        const renderStrongCards = (containerSelector, strongData) => {
            const $container = $(containerSelector);
            $container.empty();

            if (!strongData || strongData.length === 0) {
                $container.html('<div class="w-full py-8 text-center text-slate-400 font-mono text-sm bg-[#151C24] border border-white/10 rounded-2xl">今日無強勢類股推薦</div>');
                return;
            }

            // 取得資料中最後一個日期（即最新推薦）
            const latestDate = strongData[strongData.length - 1].date;
            const items = strongData.filter(item => item.date === latestDate);

            if (items.length === 0) {
                $container.html('<div class="w-full py-8 text-center text-slate-400 font-mono text-sm bg-[#151C24] border border-white/10 rounded-2xl">今日無強勢類股推薦</div>');
                return;
            }

            // 準備隨機不重複的背景圖池 (img/card-bg-1.jpg ~ img/card-bg-10.jpg)
            const getShuffledBgList = (count) => {
                const totalBgs = 10;
                const result = [];
                let pool = [];
                for (let i = 0; i < count; i++) {
                    if (pool.length === 0) {
                        pool = Array.from({ length: totalBgs }, (_, idx) => `img/card-bg-${idx + 1}.jpg`);
                        for (let j = pool.length - 1; j > 0; j--) {
                            const k = Math.floor(Math.random() * (j + 1));
                            [pool[j], pool[k]] = [pool[k], pool[j]];
                        }
                    }
                    result.push(pool.pop());
                }
                return result;
            };

            const bgList = getShuffledBgList(items.length);

            items.forEach((item, index) => {
                const bgImage = bgList[index] || 'img/card-bg-1.jpg';
                const rawName = (item.sectorName || '').trim();
                const parts = rawName.split(/\s+/);
                const stockName = parts[0] || '強勢指標';
                const stockCode = parts.length > 1 ? parts.slice(1).join(' ') : '';
                const scoreNum = parseFloat(item.strengthScore) || 0;
                const scoreDisplay = !isNaN(scoreNum) ? scoreNum.toFixed(2) : (item.strengthScore || '-');

                const $card = $(`
                    <div class="strong-stock-card relative rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between transition-colors duration-200 hover:border-[#00E701] flex-shrink-0 cursor-pointer" 
                         style="background: url('${bgImage}') top center / cover no-repeat;"
                         data-stock="${stockName}" data-code="${stockCode}" title="點擊查看「${stockName}」情報">
                      
                      <!-- 上半部視覺留白區 (展現金牛晶片主視覺) -->
                      <div class="h-24 sm:h-28 w-full"></div>

                      <!-- 下半部純文字排版區 (純背景黑漸層，無模糊) -->
                      <div class="p-3.5 sm:p-4 pt-5 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col items-center text-center">
                        
                        <!-- 1. 股票代碼：增加背景模糊，維持原本底色 -->
                        <span class="inline-flex items-center text-[10px] sm:text-[11px] font-black font-mono px-2.5 py-0.5 rounded-md tracking-wider bg-amber-500/10 backdrop-blur-md text-[#FFB800] border border-amber-500/30 shadow-[0_0_8px_rgba(255,184,0,0.25)]"
                              style="backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);">
                          ${stockCode || 'TW'}
                        </span>

                        <!-- 2. 股票名：置中，大字 Neon 綠呈現大氣感 -->
                        <h3 class="text-2xl sm:text-3xl font-black text-[#00E701] drop-shadow-[0_0_16px_rgba(0,231,1,0.6)] tracking-wide my-1">
                          ${stockName}
                        </h3>

                        <!-- 3. 股價：置中，移除日期，字體放大 -->
                        <div class="text-base sm:text-lg font-mono font-bold text-slate-200 tracking-wider text-center mt-0.5">
                          ${scoreDisplay}
                        </div>

                      </div>
                    </div>
                `);

                $container.append($card);
            });
        };
        const renderStrongTable = (selector, strongData) => {
            renderStrongCards('#today-strong-cards', strongData);
        };

        // --- 執行渲染 ---
        renderSellTable('#today-sell .data-table', dailyTrades, getTodayString());
        renderBuyTable('#today-buy .data-table', dailyTrades, getTodayString());
        // 從 API 回傳的 strongSectors 欄位抓取資料渲染為卡片
        const strongStocks = Array.isArray(data.strongSectors) ? data.strongSectors : [];
        renderStrongCards('#today-strong-cards', strongStocks);

        // 綁定橫向捲軸左右按鈕
        $('#today-strong-prev').off('click').on('click', function () {
            const $scroll = $('.strong-cards-scroll');
            $scroll.animate({ scrollLeft: $scroll.scrollLeft() - 220 }, 250);
            if (window.sounds) window.sounds.playClick();
        });
        $('#today-strong-next').off('click').on('click', function () {
            const $scroll = $('.strong-cards-scroll');
            $scroll.animate({ scrollLeft: $scroll.scrollLeft() + 220 }, 250);
            if (window.sounds) window.sounds.playClick();
        });

        // 支援滑鼠按住拖曳滑動
        const scrollEl = document.querySelector('.strong-cards-scroll');
        if (scrollEl) {
            let isDown = false;
            let startX;
            let initialScrollLeft;
            $(scrollEl).off('mousedown').on('mousedown', function (e) {
                if ($(e.target).closest('button').length) return;
                isDown = true;
                $(this).css('cursor', 'grabbing');
                startX = e.pageX - this.offsetLeft;
                initialScrollLeft = this.scrollLeft;
            });
            $(window).off('mouseup.strongScroll').on('mouseup.strongScroll', function () {
                if (isDown) {
                    isDown = false;
                    $('.strong-cards-scroll').css('cursor', '');
                }
            });
            $(scrollEl).off('mousemove').on('mousemove', function (e) {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - this.offsetLeft;
                const walk = (x - startX) * 1.5;
                this.scrollLeft = initialScrollLeft - walk;
            });
        }

        // 點擊卡片快速搜尋個股
        $(document).off('click', '.strong-stock-card').on('click', '.strong-stock-card', function () {
            const stockName = $(this).data('stock');
            const stockCode = $(this).data('code');
            const target = stockName || stockCode;

            if (window.sounds) window.sounds.playWin();

            if (target) {
                $('#stock-search-input').val(target);
                $('#stock-search-btn').trigger('click');
                const $targetSection = $('#stock-search-input');
                if ($targetSection.length) {
                    $('html, body').animate({
                        scrollTop: Math.max(0, $targetSection.offset().top - 120)
                    }, 350);
                }
            }
        });


        // --- 搜尋功能邏輯 ---
        $('#stock-search-btn').off('click').on('click', function () {
            const keyword = $('#stock-search-input').val().trim();
            const $result = $('#stock-search-result');

            if (!keyword) {
                $result.hide().empty();
                return;
            }

            // 收集所有相關的股票名稱
            const holdingMatches = todayHoldings.filter(item => item.sheetName.includes(keyword));
            const tradeMatches = dailyTrades.filter(item => item.sheetName && item.sheetName.includes(keyword));

            // 整理狀態並去除重複名稱
            const holdingNames = [...new Set(holdingMatches.map(m => m.sheetName))];

            // 取得已賣出紀錄 (限定 state === 'sell'，並排除目前還持有的股票，避免混淆)
            // 將陣列反轉，讓最近賣出的紀錄排在最上面
            const soldMatches = tradeMatches
                .filter(m => m.state === 'sell' && !holdingNames.includes(m.sheetName))
                .reverse();

            // 如果完全沒找到
            if (holdingMatches.length === 0 && soldMatches.length === 0) {
                $result.html(`<span style="color: var(--text-muted);">狀態：</span> 完全沒進場過 (找不到與「${keyword}」相關的紀錄)`).show();
                return;
            }

            let resultHtml = '';

            if (holdingMatches.length > 0) {
                const holdingDetails = holdingMatches.map(m => {
                    const numRate = parseFloat(m.rate) || 0;
                    const rateColor = numRate < 0 ? 'var(--danger-color)' : 'var(--success-color)';
                    return `<div style="margin-top: 4px;">${m.sheetName} <span style="color: var(--text-muted); font-size: 13px; margin-left: 4px;">( 持有 ${m._holdingDays} 天 / 報酬率: <b style="color: ${rateColor};">${numRate}%</b> )</span></div>`;
                }).join('');

                resultHtml += `<div style="margin-bottom: ${soldMatches.length > 0 ? '12px' : '0'};"><span style="color: var(--success-color); font-weight: bold;">[目前進場中]</span>${holdingDetails}</div>`;
            }

            if (soldMatches.length > 0) {
                const soldDetails = soldMatches.map(m => {
                    const numRate = parseFloat(m.rate) || 0;
                    const rateColor = numRate < 0 ? 'var(--danger-color)' : 'var(--success-color)';
                    return `<div style="margin-top: 4px;">${m.sheetName} <span style="color: var(--text-muted); font-size: 13px; margin-left: 4px;">( 賣出時間: ${m.time} / 報酬率: <b style="color: ${rateColor};">${numRate}%</b> )</span></div>`;
                }).join('');

                resultHtml += `<div><span style="color: var(--text-muted); font-weight: bold;">[目前已賣出]</span>${soldDetails}</div>`;
            }

            $result.html(resultHtml).show();
        });

        $('#stock-search-input').off('keypress').on('keypress', function (e) {
            if (e.which === 13) { $('#stock-search-btn').click(); }
        });

        // 載入完成後動作
        $status.text('載入完成');
        // 顯示更新時間與快取狀態
        const $updateTime = $('.data-update-time');
        $updateTime.html(getLastUpdateLabel(dataTimestamp, isFromCache));
        $updateTime
            .css('cursor', 'pointer')
            .attr('title', '每日 14:15 ~ 14:30 自動即時更新；其餘時段啟用本機快取。\n點擊可手動強制重新連線更新數據。')
            .off('click')
            .on('click', function () {
                console.log('🔄 [JOINJO] 使用者手動觸發強制更新');
                loadStockData(true);
            });

        setTimeout(() => {
            $('body').removeClass('loading-view');
        }, isFromCache ? 150 : 600);
}

// --- 頁面初始化與排程定時監聽 ---
$(async function () {
    // 首次進入頁面載入數據 (自動判斷快取有效性)
    await loadStockData(false);

    // --- 背景即時更新排程 (14:15 PM ~ 14:30 PM 監聽) ---
    setInterval(() => {
        const now = new Date();
        if (isLiveUpdateWindow(now)) {
            // 處於 14:15 ~ 14:30 即時區間內，若距離上次拉取已超過 3 分鐘，自動重新抓取
            if (Date.now() - lastFetchTimestamp >= 3 * 60 * 1000) {
                console.log('⏰ [JOINJO] 進入 14:15 ~ 14:30 即時區間，排程自動抓取最新數據...');
                loadStockData(true);
            }
        }
    }, 60 * 1000);

    // 當使用者從其他分頁切回本頁面時，若處於即時區間且超過 2 分鐘未更新，自動重抓
    $(window).on('focus', function () {
        if (isLiveUpdateWindow() && (Date.now() - lastFetchTimestamp >= 2 * 60 * 1000)) {
            console.log('👀 [JOINJO] 視窗重新聚焦且處於即時更新時段，自動刷新數據...');
            loadStockData(true);
        }
    });
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
        let valA = $(a).children('.table-cell').eq(index).text().replace(/[%,\s]/g, '');
        let valB = $(b).children('.table-cell').eq(index).text().replace(/[%,\s]/g, '');
        return isAsc ? (valA - valB || valA.localeCompare(valB)) : (valB - valA || valB.localeCompare(valA));
    });
    $table.find('.table-body').append(rows);

    // 排序後若有「查看全部」按鈕，需重新套用隱藏邏輯 (顯示排序後的前 5 筆)
    if ($table.find('.view-all-btn').length > 0) {
        $table.find('.table-body .table-row').each(function (i) {
            if (i >= 5) {
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
    const $body = $('body');

    function updateThemeUI(isLight) {
        if (isLight) {
            $body.addClass('light-theme');
            $iconSun.hide();
            $iconMoon.show();
            $themeColorMeta.attr('content', '#F4F6F8');
        } else {
            $body.removeClass('light-theme');
            $iconSun.show();
            $iconMoon.hide();
            $themeColorMeta.attr('content', '#131722');
        }
    }

    // 檢查 localStorage 儲存的主題
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        // 如果儲存的是亮色主題，確保 CSS 已載入
        if ($('#theme-light-css').length === 0) {
            $('head').append('<link rel="stylesheet" href="theme-light.css" id="theme-light-css">');
        }
        updateThemeUI(true);
    } else {
        // 預設為暗色主題
        updateThemeUI(false);
    }

    $themeToggle.on('click', function () {
        // 檢查 body 是否有 light-theme class 來判斷當前狀態
        if ($body.hasClass('light-theme')) {
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

// --- 手機版主內容 Tab 切換 ---
$(function () {
    $('.mobile-tab').on('click', function () {
        if ($(this).hasClass('active')) return;
        $('.mobile-tab').removeClass('active');
        $(this).addClass('active');

        const target = $(this).data('target');
        if (target === 'personal') {
            $('.content-wrapper').removeClass('show-main').addClass('show-personal');
        } else {
            $('.content-wrapper').removeClass('show-personal').addClass('show-main');
        }
    });

    // --- 加入手勢滑動 (Swipe) 切換 ---
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const contentWrapper = document.querySelector('.content-wrapper');
    if (contentWrapper) {
        contentWrapper.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        contentWrapper.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;

            const xDiff = touchStartX - touchEndX;
            const yDiff = Math.abs(touchStartY - touchEndY);

            // 判斷是否為有效且明顯的水平滑動 (X位移 > 50px 且 X位移大於Y位移，避免與上下滾動衝突)
            if (Math.abs(xDiff) > 50 && Math.abs(xDiff) > yDiff) {
                if (xDiff > 0 && $('.content-wrapper').hasClass('show-personal')) {
                    // 向左滑動 (Swipe Left)：顯示右側的「市場動態」
                    $('.mobile-tab[data-target="main"]').trigger('click');
                } else if (xDiff < 0 && $('.content-wrapper').hasClass('show-main')) {
                    // 向右滑動 (Swipe Right)：顯示左側的「操作績效」
                    $('.mobile-tab[data-target="personal"]').trigger('click');
                }
            }
        }, { passive: true });
    }
});

// --- Tooltip 功能 ---
$(function () {
    let $tooltip = $('<div class="tooltip"></div>');
    $('body').append($tooltip);

    $(document).on('mouseenter', '[data-tooltip]', function (e) {
        const text = $(this).data('tooltip');
        if (!text) return;

        $tooltip.text(text).addClass('visible');

        const targetRect = this.getBoundingClientRect();
        const tooltipRect = $tooltip[0].getBoundingClientRect();

        let top = targetRect.bottom + window.scrollY + 8; // 預設在下方
        let left = targetRect.left + window.scrollX + (targetRect.width / 2) - (tooltipRect.width / 2);

        // 避免 tooltip 超出視窗右邊界
        if (left + tooltipRect.width > window.innerWidth) {
            left = window.innerWidth - tooltipRect.width - 10;
        }
        // 避免 tooltip 超出視窗左邊界
        if (left < 0) {
            left = 10;
        }

        $tooltip.css({ top: top, left: left });

    }).on('mouseleave', '[data-tooltip]', function () {
        $tooltip.removeClass('visible');
    });
});


// --- 工具函式：計算最後更新時間與顯示標籤 ---
function getLastUpdateLabel(timestamp, isFromCache) {
    const now = new Date();
    const updateTimeToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 15, 0);

    let displayDate = new Date();
    // 如果現在時間還沒到今天的 14:15，則基準日期為昨天
    if (now < updateTimeToday) {
        displayDate.setDate(now.getDate() - 1);
    }

    const y = displayDate.getFullYear();
    const m = String(displayDate.getMonth() + 1).padStart(2, '0');
    const d = String(displayDate.getDate()).padStart(2, '0');

    if (isLiveUpdateWindow(now)) {
        const fetchDate = timestamp ? new Date(timestamp) : now;
        const hh = String(fetchDate.getHours()).padStart(2, '0');
        const mm = String(fetchDate.getMinutes()).padStart(2, '0');
        return `即時數據：${y}-${m}-${d} ${hh}:${mm} <span style="color:#00E701; font-weight:800; text-shadow:0 0 8px rgba(0,231,1,0.6);">● LIVE</span>`;
    }

    const tag = isFromCache
        ? `<span style="color:#38bdf8; font-weight:700;" title="自本機快取快速載入 (每日 14:15 ~ 14:30 自動即時更新)">[⚡已快取]</span>`
        : `<span style="color:#00E701; font-weight:700;">[🟢已更新]</span>`;

    return `最後更新：${y}-${m}-${d} 14:15 ${tag}`;
}
