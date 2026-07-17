const API = "https://script.google.com/macros/s/AKfycbwiH2P10Y0He-7WgFtBq_7xswWLWQHVJ8TVWWtaA4i9GGI7sda_cIB6C7wlDmLZfPgW1Q/exec";

$(async function () {
    const $holdingsTable = $('#current-holdings .data-table');

    //執行載入動畫
    const $status = $('p.results'); // 確保有這個元素顯示狀態
    $('body').addClass('loading-view');

    try {
        $status.text('資料載入中…');
        const rawData = await $.getJSON(API);
        if (!rawData.ok) { $status.text('錯誤：' + (rawData.message || '未知錯誤')); return; }

        // 渲染市場指數看板
        if (rawData.marketStatus && typeof renderMarketSummary === 'function') {
            renderMarketSummary(rawData.marketStatus);
        }

        // 渲染外部數據 (匯率、期貨)
        if (typeof renderExternalData === 'function') {
            renderExternalData();
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
            const numRate = parseFloat(rate) || 0;
            const numAvgEntry = parseFloat(avgEntry) || 0;
            const numCurrentPrice = parseFloat(currentPrice) || 0;

            const $tr = $('<div class="table-row"/>').attr({
                'data-price': currentPrice,
                'data-rate': numRate,
                'data-qty': numQty
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

            // 進場均價與進場數量 (套用手機版隱藏 class)
            $('<div class="table-cell hide-on-mobile"/>').append(numAvgEntry).appendTo($tr);
            $('<div class="table-cell hide-on-mobile"/>').append(numQty).appendTo($tr);

            $('<div class="table-cell"/>').append(numCurrentPrice).appendTo($tr);

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
                $('<div class="table-cell"/>').text(benefitDisplay).appendTo($tr);

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

        const negativeTrades = repeatedTrades
            .filter(t => t.totalProfit < 0)
            .sort((a, b) => b.sellCount - a.sellCount || a.totalProfit - b.totalProfit) // 降冪 (結算次數最高在前，若相同則虧損最多在前)
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
        renderRepeatedTable('#top-loss-trades .data-table', negativeTrades, false);

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

        // --- 渲染強勢類股推薦表格 ---
        const renderStrongTable = (selector, strongData) => {
            const $table = $(selector);
            $table.find('.table-body').empty(); // 清空舊資料

            if (!strongData || strongData.length === 0) {
                $table.find('.table-body').append('<div class="table-row"><div class="table-cell" style="grid-column: 1 / -1; justify-content: center; color: var(--text-secondary);">今日無強勢類股推薦</div></div>');
                return;
            }

            // 取得資料中最後一個日期（即最新推薦）
            const latestDate = strongData[strongData.length - 1].date;

            strongData.filter(item => item.date === latestDate).forEach(item => {
                const $tr = $('<div class="table-row"/>');
                $('<div class="table-cell"/>').text(item.date).appendTo($tr);
                $('<div class="table-cell"/>').text(item.sectorName).css('font-weight', '700').appendTo($tr);
                $('<div class="table-cell"/>').text(item.strengthScore).appendTo($tr);
                $table.find('.table-body').append($tr);
            });
        };

        // --- 執行渲染 ---
        if (lastSellDate) renderSellTable('#today-sell .data-table', dailyTrades, lastSellDate);
        if (lastBuyDate) renderBuyTable('#today-buy .data-table', dailyTrades, lastBuyDate);
        // 從 API 回傳的 strongSectors 欄位抓取資料
        const strongStocks = Array.isArray(data.strongSectors) ? data.strongSectors : [];
        renderStrongTable('#today-strong .data-table', strongStocks);


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
