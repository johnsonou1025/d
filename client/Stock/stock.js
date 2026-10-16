const API = "https://script.google.com/macros/s/AKfycbwiH2P10Y0He-7WgFtBq_7xswWLWQHVJ8TVWWtaA4i9GGI7sda_cIB6C7wlDmLZfPgW1Q/exec";
const CACHE_KEY = "JOINJO_STOCK_CACHE_V2";
const STRONG_SECTORS_CACHE_KEY = "JOINJO_STRONG_SECTORS_CACHE_V2";
let lastFetchTimestamp = 0;
let twGlobalStrongStocks = [];



/**
 * 準備隨機不重複的卡片背景圖 pool
 */
function getShuffledBgList(count) {
    const totalBgs = 20;
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
}

/**
 * 格式化日期：去除年份，只保留月和日 (例如 2026-10-14 -> 10/14)
 */
function formatMonthDay(dateStr) {
    if (!dateStr) return '';
    const str = String(dateStr).trim();
    const match = str.match(/(?:^\d{4}[-/.]\s*)?(\d{1,2})[-/.](\d{1,2})$/);
    if (match) {
        return `${match[1].padStart(2, '0')}/${match[2].padStart(2, '0')}`;
    }
    return str.replace(/^\d{4}[-/.]\s*/, '').replace(/[-.]/, '/');
}

/**
 * 通用滑鼠拖曳橫向捲動綁定
 */
function enableHorizontalDrag(selector) {
    const scrollEl = document.querySelector(selector);
    if (!scrollEl) return;
    let isDown = false;
    let startX;
    let scrollLeft;

    const eventNamespace = selector.replace(/[^a-zA-Z0-9]/g, '');

    $(scrollEl).off('mousedown').on('mousedown', function (e) {
        if ($(e.target).closest('button').length) return;
        isDown = true;
        startX = e.pageX - scrollEl.offsetLeft;
        scrollLeft = scrollEl.scrollLeft;
        $(this).css({ 'cursor': 'grabbing', 'scroll-behavior': 'auto' });
    });

    $(window).off('mouseup.' + eventNamespace).on('mouseup.' + eventNamespace, function () {
        if (isDown) {
            isDown = false;
            $(scrollEl).css({ 'cursor': '', 'scroll-behavior': '' });
            updateCarouselButtons(scrollEl);
        }
    });

    $(scrollEl).off('mousemove').on('mousemove', function (e) {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollEl.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollEl.scrollLeft = scrollLeft - walk;
    });
}

// 用於記錄每個輪播容器當前的動畫狀態與目標位置
const carouselStateMap = new WeakMap();

/**
 * 取得輪播容器對應的前後控制按鈕
 */
function getCarouselButtons(scrollEl) {
    if (!scrollEl) return { prev: null, next: null };
    if (scrollEl.id === 'today-strong-scroll-wrapper') {
        return {
            prev: document.getElementById('today-strong-prev'),
            next: document.getElementById('today-strong-next')
        };
    }
    return { prev: null, next: null };
}

/**
 * 更新輪播按鈕禁用狀態 (到頭禁用上一頁，到底禁用下一頁，嚴格防止無限循環)
 */
function updateCarouselButtons(scrollEl, customPos = null) {
    if (!scrollEl) return;
    const { prev, next } = getCarouselButtons(scrollEl);
    if (!prev && !next) return;

    // 若容器處於隱藏狀態 (例如 loading-view 期間，clientWidth 或 scrollWidth 為 0)，切勿誤判為無卡片而將 Next 按鈕鎖死
    if (scrollEl.clientWidth === 0 || scrollEl.scrollWidth === 0) {
        if (prev) {
            prev.disabled = true;
            prev.classList.add('is-disabled');
        }
        if (next) {
            const cardCount = scrollEl.querySelectorAll('.strong-stock-card').length;
            const canScroll = cardCount > 1;
            next.disabled = !canScroll;
            if (canScroll) {
                next.classList.remove('is-disabled');
            } else {
                next.classList.add('is-disabled');
            }
        }
        return;
    }

    const maxScroll = Math.max(0, scrollEl.scrollWidth - scrollEl.clientWidth);
    const currentLeft = customPos !== null ? customPos : scrollEl.scrollLeft;

    const isAtStart = currentLeft <= 4;
    // 只有在真正可捲動且當前位置已接近末端時才禁用；若尚未能算出有效捲動範圍，不輕易禁用 Next
    const isAtEnd = maxScroll > 0 ? (currentLeft >= maxScroll - 4) : false;

    if (prev) {
        prev.disabled = isAtStart;
        if (isAtStart) {
            prev.classList.add('is-disabled');
        } else {
            prev.classList.remove('is-disabled');
        }
    }

    if (next) {
        next.disabled = isAtEnd;
        if (isAtEnd) {
            next.classList.add('is-disabled');
        } else {
            next.classList.remove('is-disabled');
        }
    }
}

/**
 * 廣告輪播般流暢的平滑滑動 (RAF + easeOutQuart 減速曲線，不循環翻頁)
 * @param {string|HTMLElement} wrapperSelector - 滾動容器 selector 或元素
 * @param {number} direction - -1 為上一頁 (向左)，1 為下一頁 (向右)
 */
function scrollCardCarousel(wrapperSelector, direction = 1) {
    const scrollEl = typeof wrapperSelector === 'string' ? document.querySelector(wrapperSelector) : wrapperSelector;
    if (!scrollEl) return;

    let state = carouselStateMap.get(scrollEl);
    if (!state) {
        state = { targetLeft: scrollEl.scrollLeft, animId: null };
        carouselStateMap.set(scrollEl, state);

        // 綁定原生滾動事件，當手指滑動或拖曳時隨時同步按鈕狀態
        scrollEl.addEventListener('scroll', () => {
            if (!state.animId) {
                updateCarouselButtons(scrollEl);
            }
        }, { passive: true });
    }

    const maxScroll = Math.max(0, scrollEl.scrollWidth - scrollEl.clientWidth);
    if (maxScroll <= 0) {
        updateCarouselButtons(scrollEl);
        return;
    }

    // 動態取得單張卡片寬度 (含 gap)
    const card = scrollEl.querySelector('.strong-stock-card');
    const gap = 16;
    const cardWidth = card ? (card.getBoundingClientRect().width + gap) : 210;

    // 計算可視寬度內能容納幾張卡片，以「一頁」為單位翻動 (至少 1 張)
    const visibleWidth = scrollEl.clientWidth || 800;
    const cardsPerPage = Math.max(1, Math.floor(visibleWidth / cardWidth));
    const pageSize = cardsPerPage * cardWidth;

    // 連續點擊時以目標位置累加，否則以目前實際位置為準
    const baseLeft = state.animId ? state.targetLeft : scrollEl.scrollLeft;
    let newTarget = baseLeft + (direction * pageSize);

    // 嚴格限制於 [0, maxScroll] 區間，徹底避免無限循環
    newTarget = Math.max(0, Math.min(newTarget, maxScroll));
    state.targetLeft = newTarget;

    if (state.animId) {
        cancelAnimationFrame(state.animId);
        state.animId = null;
    }

    const startLeft = scrollEl.scrollLeft;
    const distance = newTarget - startLeft;

    if (Math.abs(distance) < 1) {
        updateCarouselButtons(scrollEl, newTarget);
        return;
    }

    // 520ms 廣告輪播級流暢滑動時間與 4 次方減速曲線 (easeOutQuart)
    const duration = 520;
    const startTime = performance.now();

    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeOutQuart(progress);

        scrollEl.scrollLeft = startLeft + (distance * ease);

        if (progress < 1) {
            state.animId = requestAnimationFrame(step);
        } else {
            scrollEl.scrollLeft = newTarget;
            state.animId = null;
            updateCarouselButtons(scrollEl);
        }
    }

    state.animId = requestAnimationFrame(step);
    // 點擊當下即提前更新按鈕狀態，避免到達邊界時連續無效觸發
    updateCarouselButtons(scrollEl, newTarget);
}

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
        const cached = getCachedData();
        // 如果新拉取的資料中 strongSectors 為空，但舊快取或持久快取中有昨日推薦數據，則予以保留，避免在今日盤後更新前被覆蓋抹除
        if (!rawData.strongSectors || rawData.strongSectors.length === 0) {
            if (cached && cached.data && Array.isArray(cached.data.strongSectors) && cached.data.strongSectors.length > 0) {
                rawData.strongSectors = cached.data.strongSectors;
            } else {
                try {
                    const saved = localStorage.getItem(STRONG_SECTORS_CACHE_KEY);
                    if (saved) {
                        const parsed = JSON.parse(saved);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            rawData.strongSectors = parsed;
                        }
                    }
                } catch (e) { }
            }
        } else if (rawData.strongSectors && rawData.strongSectors.length > 0) {
            // 有最新推薦數據時，同步更新至獨立持久快取
            localStorage.setItem(STRONG_SECTORS_CACHE_KEY, JSON.stringify(rawData.strongSectors));
        }

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

    // 若 rawData 中的 strongSectors 為空，嘗試自獨立持久快取恢復昨日數據
    if (!rawData.strongSectors || rawData.strongSectors.length === 0) {
        try {
            const saved = localStorage.getItem(STRONG_SECTORS_CACHE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    rawData.strongSectors = parsed;
                }
            }
        } catch (e) { }
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
        const { sheetName, avgEntry, quantity, currentPrice, rate } = item;
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

        const $nameCell = $('<div class="table-cell"/>');
        $nameCell.append(`
                <div class="flex flex-col min-w-0">
                    <span class="truncate font-bold text-white">${sheetName}</span>
                    <span class="mobile-sub-info md:hidden text-[10px] text-slate-400 font-mono mt-0.5">均 ${numAvgEntry} · ${(numShares / 1000).toFixed(0)}張</span>
                </div>
            `);
        $nameCell.appendTo($tr);

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

        if (period === '30days') {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(now.getDate() - 30);
            const y = thirtyDaysAgo.getFullYear();
            const m = String(thirtyDaysAgo.getMonth() + 1).padStart(2, '0');
            const d = String(thirtyDaysAgo.getDate()).padStart(2, '0');
            startDate = `${y}-${m}-${d}`;
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

            const numAvg = Number(avgEntry);
            const avgDisplay = isNaN(numAvg) ? (avgEntry || '-') : (Number.isInteger(numAvg) ? numAvg : Number(numAvg.toFixed(2)));
            const numShares = numQty * 1000;
            const numSheets = numShares / 1000;
            const sheetsDisplay = numSheets > 0 ? (Number.isInteger(numSheets) ? numSheets : numSheets.toFixed(1)) + '張' : (numQty ? numQty + '張' : '-');
            const qtyDisplay = numShares > 0 ? numShares.toLocaleString() : (quantity ? (Number(quantity) * 1000).toLocaleString() : '-');

            const $tr = $('<div class="table-row"/>');
            if (numRate < 0) { $tr.addClass('down'); }

            // 1. 賣出日期
            $('<div class="table-cell"/>').text(time).appendTo($tr);

            // 2. 名稱 (參考 #current-holdings，手機端整合呈現股名、均價與進場張數)
            const $nameCell = $('<div class="table-cell"/>');
            $nameCell.append(`
                <div class="flex flex-col min-w-0">
                    <span class="truncate font-bold text-white">${sheetName}</span>
                    <span class="mobile-sub-info md:hidden text-[10px] text-slate-400 font-mono mt-0.5">均 ${avgDisplay} · ${sheetsDisplay}</span>
                </div>
            `);
            $nameCell.appendTo($tr);

            // 3. 進場均價 (手機版隱藏)
            $('<div class="table-cell hide-on-mobile"/>').text(avgDisplay).appendTo($tr);

            // 4. 進場股數 (手機版隱藏)
            $('<div class="table-cell hide-on-mobile"/>').text(qtyDisplay).appendTo($tr);

            // 5. 獲利金額與報酬率
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

        // 填入總獲利與報酬率 (精準更新數值 span，避免覆寫前面標籤文字)
        const totalRate = totalAmount > 0 ? (totalProfit / totalAmount * 100) : 0;
        const totalProfitRounded = Math.round(totalProfit);
        const totalSign = (totalProfitRounded > 0) ? '+' : '';
        const totalRateRounded = Math.round(totalRate);
        const profitColor = totalProfitRounded >= 0 ? '#00E701' : '#FF3366';
        const profitGlow = totalProfitRounded >= 0 ? 'rgba(0,231,1,0.4)' : 'rgba(255,51,102,0.4)';
        const formattedProfitText = `${totalSign}${totalProfitRounded.toLocaleString()} (${totalRateRounded}%)`;

        $('#sold-month-profit-loss-val').text(formattedProfitText).css({
            'color': profitColor,
            'filter': `drop-shadow(0 0 8px ${profitGlow})`
        });
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

    const renderRepeatedTable = (selector, trades) => {
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
            $('<div class="table-cell" style="color: var(--success-color);"/>').text(Math.round(t.totalProfit).toLocaleString()).appendTo($tr);
            $table.find('.table-body').append($tr);
        });
    };

    renderRepeatedTable('#top-profit-trades .data-table', positiveTrades);

    /**
     * 今日數據
     */

    // --- 輔助函式：取得該 state 最後一筆的日期 ---
    const getLastDateByState = (trades, state) => {
        const filtered = trades.filter(t => t.state === state && t.time);
        if (filtered.length === 0) return null;
        // 取得該狀態最新的一筆日期 (以日期字串最大者或陣列末尾為準)
        return filtered.reduce((latest, t) => (!latest || t.time > latest ? t.time : latest), filtered[filtered.length - 1].time);
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
            const emptyMsg = targetDate === getTodayString() ? '今日無建議賣出股票' : '無建議賣出股票';
            $table.find('.table-body').append(`<div class="table-row"><div class="table-cell" style="grid-column: 1 / -1; justify-content: center; color: var(--text-secondary);">${emptyMsg}</div></div>`);
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
            const emptyMsg = targetDate === getTodayString() ? '今日無建議買進股票' : '無建議買進股票';
            $table.find('.table-body').append(`<div class="table-row"><div class="table-cell" style="grid-column: 1 / -1; justify-content: center; color: var(--text-secondary);">${emptyMsg}</div></div>`);
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
    // --- 渲染強勢類股推薦卡片與區塊 (直接顯示近5天推薦) ---
    const renderStrongSection = (strongStocks) => {
        const $container = $('#today-strong-cards');
        const $pill = $('#today-strong-date-pill');

        if (!Array.isArray(strongStocks) || strongStocks.length === 0) {
            $container.html('<div class="w-full py-8 text-center text-slate-400 font-mono text-sm bg-[#151C24] border border-white/10 rounded-2xl">今日無強勢類股推薦</div>');
            if ($pill.length) $pill.text('無推薦資料');
            return;
        }

        // 取得所有不同日期 (降冪排序，最新在前)
        const distinctDates = [...new Set(strongStocks.map(s => s.date).filter(Boolean))].sort().reverse();
        const recent5Dates = distinctDates.slice(0, 5);

        // 將近 5 天的所有強勢推薦股全部放入，依最新日期排在最前 (同日依評分降冪排序)
        const displayList = [...strongStocks]
            .filter(s => s.date && recent5Dates.includes(s.date))
            .sort((a, b) => {
                if (b.date !== a.date) return b.date.localeCompare(a.date);
                const scoreA = parseFloat(a.strengthScore) || 0;
                const scoreB = parseFloat(b.strengthScore) || 0;
                return scoreB - scoreA;
            });

        if ($pill.length) $pill.text(`近5日推薦: 共 ${displayList.length} 檔`);

        renderStrongCards('#today-strong-cards', displayList);
    };

    /**
     * 渲染強勢台股卡片 DOM (卡片上半部僅呈現月日時間標籤)
     */
    const renderStrongCards = (containerSelector, strongData) => {
        const $container = $(containerSelector);
        $container.empty();

        if (!strongData || strongData.length === 0) {
            $container.html('<div class="w-full py-8 text-center text-slate-400 font-mono text-sm bg-[#151C24] border border-white/10 rounded-2xl">今日無強勢類股推薦</div>');
            return;
        }

        const bgList = getShuffledBgList(strongData.length);

        strongData.forEach((item, index) => {
            const bgImage = bgList[index] || 'img/card-bg-1.jpg';
            const rawName = (item.sectorName || '').trim();
            const parts = rawName.split(/\s+/);
            let stockName = parts[0] || '強勢指標';
            let stockCode = parts.length > 1 ? parts.slice(1).join(' ') : '';

            if (/^\d{4,5}$/.test(stockName) && parts.length > 1) {
                stockCode = parts[0];
                stockName = parts.slice(1).join(' ');
            }

            const scoreNum = parseFloat(item.strengthScore);
            const scoreDisplay = !isNaN(scoreNum) ? scoreNum.toFixed(2) : (item.strengthScore || item.closePrice || '-');
            const date = item.date || '';
            const shortDate = formatMonthDay(date);

            const dateBadgeHtml = shortDate
                ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-black/60 backdrop-blur-md text-slate-200 shadow-sm">${shortDate}</span>`
                : '';

            const $card = $(`
                <div class="strong-stock-card relative rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between transition-colors duration-200 hover:border-[#00E701] flex-shrink-0 cursor-pointer" 
                     style="background: url('${bgImage}') top center / cover no-repeat;"
                     data-stock="${stockName}" data-code="${stockCode}" data-symbol="${stockCode}" title="點擊查看「${stockName}${stockCode ? ' (' + stockCode + ')' : ''}」詳細情報">
                  
                  <!-- 上半部視覺區：頂部時間標籤 (時間靠左，僅保留月日，無外框線，佔卡面 1/4) -->
                  <div class="strong-card-visual h-1/4 w-full flex items-start justify-start p-2.5">
                    ${dateBadgeHtml}
                  </div>

                  <!-- 下半部純文字排版區 (佔卡面 3/4) -->
                  <div class="strong-card-text h-3/4">
                    <!-- 1. 股票代碼 (無時間標籤) -->
                    <span class="strong-code-badge inline-flex items-center text-[10px] sm:text-[11px] font-black font-mono px-2.5 py-0.5 rounded-md tracking-wider bg-amber-500/10 backdrop-blur-md text-[#FFB800] border border-amber-500/30 shadow-[0_0_8px_rgba(255,184,0,0.25)]">
                      ${stockCode || 'TW'}
                    </span>

                    <!-- 2. 股票名稱 -->
                    <h3 class="text-lg sm:text-xl font-black text-[#00E701] drop-shadow-[0_0_16px_rgba(0,231,1,0.6)] tracking-wide my-1 truncate max-w-full px-1" title="${stockName}">
                      ${stockName}
                    </h3>

                    <!-- 3. 強度評分 / 股價 -->
                    <div class="text-base sm:text-lg font-mono font-bold text-slate-100 tracking-wider text-center mt-0.5">
                      ${scoreDisplay}
                    </div>
                  </div>
                </div>
            `);

            $container.append($card);
        });

        setTimeout(() => {
            updateCarouselButtons(document.getElementById('today-strong-scroll-wrapper'));
        }, 50);
    };

    // --- 取得操作建議的目標日期 (在今天更新最新數據前，保留昨天的最新數據) ---
    const todayStr = getTodayString();
    const isTodayUpdated = dailyTrades.some(t => t.time === todayStr) ||
        (typeof rawData !== 'undefined' && rawData && rawData.marketStatus && rawData.marketStatus.date === todayStr);

    const buyTargetDate = isTodayUpdated
        ? todayStr
        : (getLastDateByState(dailyTrades, 'buy') || todayStr);

    const sellTargetDate = isTodayUpdated
        ? todayStr
        : (getLastDateByState(dailyTrades, 'sell') || todayStr);

    // --- 執行渲染 ---
    renderSellTable('#today-sell .data-table', dailyTrades, sellTargetDate);
    renderBuyTable('#today-buy .data-table', dailyTrades, buyTargetDate);

    // 從 API 回傳的 strongSectors 欄位抓取資料渲染為卡片
    // 若今日數據尚未更新且為空，嘗試由持久快取取回昨日數據
    let strongStocks = Array.isArray(data.strongSectors) ? data.strongSectors : [];
    if (strongStocks.length === 0 && !isTodayUpdated) {
        try {
            const saved = localStorage.getItem(STRONG_SECTORS_CACHE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    strongStocks = parsed.map(item => ({
                        date: item.date,
                        sectorName: item.sectorName,
                        strengthScore: item.strengthScore
                    })).reverse();
                }
            }
        } catch (e) { }
    }
    twGlobalStrongStocks = strongStocks;
    renderStrongSection(twGlobalStrongStocks);

    // 綁定橫向捲軸左右按鈕 (廣告輪播級流暢滑動，不循環)
    $('#today-strong-prev').off('click').on('click', function () {
        const scrollEl = document.getElementById('today-strong-scroll-wrapper');
        if (scrollEl && scrollEl.scrollLeft > 4) {
            $(this).prop('disabled', false).removeClass('is-disabled');
        }
        if ($(this).prop('disabled') || $(this).hasClass('is-disabled')) return;
        scrollCardCarousel('#today-strong-scroll-wrapper', -1);
    });
    $('#today-strong-next').off('click').on('click', function () {
        const scrollEl = document.getElementById('today-strong-scroll-wrapper');
        const maxScroll = scrollEl ? Math.max(0, scrollEl.scrollWidth - scrollEl.clientWidth) : 0;
        // 若容器尚未滾動到真正的最末端，防呆解除按鈕誤鎖定
        if (scrollEl && (maxScroll === 0 || scrollEl.scrollLeft < maxScroll - 4)) {
            $(this).prop('disabled', false).removeClass('is-disabled');
        }
        if ($(this).prop('disabled') || $(this).hasClass('is-disabled')) return;
        scrollCardCarousel('#today-strong-scroll-wrapper', 1);
    });

    // 初始更新按鈕狀態
    updateCarouselButtons(document.getElementById('today-strong-scroll-wrapper'));

    // 支援滑鼠按住拖曳滑動
    enableHorizontalDrag('#today-strong-scroll-wrapper');

    // --- 核心搜尋渲染函式 (以視窗中央 Popup 呈現) ---
    function executeStockSearch(keyword, $result) {
        if (!keyword) {
            $result.hide().empty();
            return;
        }

        const closeBtnHtml = '<button type="button" class="search-close-btn" title="關閉搜尋結果">✕</button>';

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
            $result.html(`${closeBtnHtml}<span style="color: var(--text-muted);">狀態：</span> 完全沒進場過 (找不到與「${keyword}」相關的紀錄)`).fadeIn(150);
            return;
        }

        let resultHtml = closeBtnHtml;

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

        $result.html(resultHtml).fadeIn(150);
    }

    // 點擊卡片快速彈出搜尋結果 (不捲動畫面、不聚焦輸入框，維持原視窗位置與比例)
    $(document).off('click', '.strong-stock-card').on('click', '.strong-stock-card', function (e) {
        e.stopPropagation();
        const stockName = $(this).data('stock');
        const stockCode = $(this).data('code');
        const target = stockName || stockCode;
        const $result = $('#mobile-stock-search-result');

        if ($result.is(':visible')) {
            $result.fadeOut(150);
            return;
        }

        if (target) {
            executeStockSearch(target, $result);
        }
    });

    // 點擊彈窗右上角關閉按鈕 (✕)
    $(document).off('click', '.search-close-btn').on('click', '.search-close-btn', function (e) {
        e.stopPropagation();
        $('#mobile-stock-search-result').fadeOut(150);
    });

    // 搜尋按鈕與 Enter 鍵綁定
    $('#mobile-stock-search-btn').off('click').on('click', function (e) {
        e.stopPropagation();
        const keyword = ($('#mobile-stock-search-input').val() || '').trim();
        $('#mobile-stock-search-input').blur();
        executeStockSearch(keyword, $('#mobile-stock-search-result'));
    });

    $('#mobile-stock-search-input').off('keypress').on('keypress', function (e) {
        if (e.which === 13) { $('#mobile-stock-search-btn').click(); }
    });

    // 搜尋切換展開/收合 (全螢幕通用)
    $('#mobile-search-toggle').off('click').on('click', function (e) {
        e.stopPropagation();
        const $container = $('#mobile-search-container');
        if ($container.hasClass('hidden')) {
            $container.removeClass('hidden').hide().slideDown(200, function () {
                $('#mobile-stock-search-input').focus();
            });
        } else {
            $container.slideUp(200, function () {
                $(this).addClass('hidden');
            });
        }
    });

    // 點擊彈窗或搜尋框外部自動關閉
    $(document).off('click.searchPopup').on('click.searchPopup', function (e) {
        const $result = $('#mobile-stock-search-result');
        if ($result.is(':visible') && !$(e.target).closest('#mobile-stock-search-result').length) {
            $result.fadeOut(150);
        }
        if (!$(e.target).closest('#mobile-search-toggle, #mobile-search-container, #mobile-stock-search-result').length) {
            const $container = $('#mobile-search-container');
            if (!$container.hasClass('hidden')) {
                $container.slideUp(200, function () {
                    $(this).addClass('hidden');
                });
            }
        }
    });

    // 按下 Esc 鍵關閉彈窗與搜尋列
    $(document).off('keydown.searchPopup').on('keydown.searchPopup', function (e) {
        if (e.key === 'Escape') {
            $('#mobile-stock-search-result').fadeOut(150);
            $('#mobile-search-container').slideUp(200).addClass('hidden');
        }
    });

    // 載入完成後動作
    $status.text('載入完成');
    // 顯示更新時間 (樣式統一簡化，縮小寬度，附帶重新整理 icon)
    const $updateTime = $('.data-update-time');
    $updateTime.html(getLastUpdateLabel());
    $updateTime
        .css('cursor', 'pointer')
        .attr('title', '台股每日 14:15 ~ 14:30 自動即時更新；點擊可強制重新連線載入數據。')
        .off('click')
        .on('click', function () {
            console.log('🔄 [JOINJO] 使用者手動觸發強制更新');
            loadStockData(true);
        });

    setTimeout(() => {
        $('body').removeClass('loading-view');
        setTimeout(() => {
            updateCarouselButtons(document.getElementById('today-strong-scroll-wrapper'));
        }, 50);
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

        if (window.innerWidth <= 1024) {
            window.scrollTo({ top: 0, behavior: 'instant' });
            $('.main-content, #personal-operations-section').scrollTop(0);
        }

        if (target !== 'personal') {
            setTimeout(() => {
                updateCarouselButtons(document.getElementById('today-strong-scroll-wrapper'));
            }, 50);
        }
    });

    $(window).on('resize', function () {
        updateCarouselButtons(document.getElementById('today-strong-scroll-wrapper'));
    });
});

// --- 工具函式：計算最後更新時間與顯示標籤 ---
function getLastUpdateLabel() {
    const now = new Date();
    const updateTimeToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 15, 0);

    let displayDate = new Date();
    // 如果現在時間還沒到今天的 14:15，則基準日期為昨天
    if (now < updateTimeToday) {
        displayDate.setDate(now.getDate() - 1);
    }

    const m = String(displayDate.getMonth() + 1).padStart(2, '0');
    const d = String(displayDate.getDate()).padStart(2, '0');
    const isLive = isLiveUpdateWindow(now);

    const timeStr = isLive
        ? `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
        : '14:15';

    const dotHtml = isLive
        ? '<span class="w-1.5 h-1.5 rounded-full bg-[#00E701] animate-ping flex-shrink-0"></span>'
        : '<span class="w-1.5 h-1.5 rounded-full bg-[#00E701] flex-shrink-0"></span>';

    return `
        <span class="inline-flex items-center gap-1.5 text-slate-300 font-mono text-xs">
            ${dotHtml}
            <span>台股: ${m}/${d} ${timeStr}</span>
            <svg class="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:rotate-180 transition-transform duration-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
        </span>
    `;
}
