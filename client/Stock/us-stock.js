/**
 * JOINJO 美股量化智慧分析系統 (US Stock Quantitative Analytics)
 * 數據來源：與台股統一使用「全自動多策略綜合數據接口」(GAS Web App)
 * 整合取得：
 * 1. usDailyTrades: 美股每日進出場歷史記錄 (autoTradingDaily)
 * 2. usStrongStocks: 美股強勢推薦歷史排行 (DailyStrongMomentum)
 */

const API = "https://script.google.com/macros/s/AKfycbwiH2P10Y0He-7WgFtBq_7xswWLWQHVJ8TVWWtaA4i9GGI7sda_cIB6C7wlDmLZfPgW1Q/exec";
const CACHE_KEY = "JOINJO_US_STOCK_CACHE_V2";
const STRONG_SECTORS_CACHE_KEY = "JOINJO_US_STRONG_CACHE_V2";

/// 美股標的對照字典 (代碼 -> 中文名稱 & 英文公司縮寫)
const US_STOCK_META = {
    // 科技巨頭 & 雲端
    'NVDA': { name: '輝達', enName: 'NVIDIA' },
    'AAPL': { name: '蘋果', enName: 'Apple' },
    'TSLA': { name: '特斯拉', enName: 'Tesla' },
    'MSFT': { name: '微軟', enName: 'Microsoft' },
    'AMZN': { name: '亞馬遜', enName: 'Amazon' },
    'GOOGL': { name: '谷歌', enName: 'Alphabet' },
    'GOOG': { name: '谷歌', enName: 'Alphabet' },
    'META': { name: 'Meta', enName: 'Meta' },
    'AMD': { name: '超微', enName: 'AMD' },
    'AVGO': { name: '博通', enName: 'Broadcom' },
    'TSM': { name: '台積電 ADR', enName: 'TSMC' },
    'ASML': { name: '艾司摩爾', enName: 'ASML' },
    'ARM': { name: '安謀', enName: 'ARM' },
    'MU': { name: '美光', enName: 'Micron' },
    'SMCI': { name: '美超微', enName: 'Supermicro' },
    'INTC': { name: '英特爾', enName: 'Intel' },
    'QCOM': { name: '高通', enName: 'Qualcomm' },
    'ORCL': { name: '甲骨文', enName: 'Oracle' },
    'CRM': { name: '賽富時', enName: 'Salesforce' },
    'NOW': { name: 'ServiceNow', enName: 'ServiceNow' },
    'UBER': { name: '優步', enName: 'Uber' },
    'NFLX': { name: '網飛', enName: 'Netflix' },
    'DIS': { name: '迪士尼', enName: 'Disney' },
    // 熱門動能 / 軟體 / 數據
    'PLTR': { name: '帕蘭提爾', enName: 'Palantir' },
    'SNAP': { name: 'Snap', enName: 'Snap' },
    'INFY': { name: '印孚瑟斯', enName: 'Infosys' },
    'HOOD': { name: 'Robinhood', enName: 'Robinhood' },
    'ROKU': { name: 'Roku', enName: 'Roku' },
    'IONQ': { name: 'IonQ', enName: 'IonQ' },
    'MSTR': { name: '微策略', enName: 'MicroStrategy' },
    'MARA': { name: 'MARA', enName: 'MARA' },
    'CIFR': { name: 'Cipher', enName: 'Cipher' },
    'HPE': { name: '慧與科技', enName: 'HPE' },
    'HPQ': { name: '惠普', enName: 'HP' },
    'UMC': { name: '聯電 ADR', enName: 'UMC' },
    'FSLY': { name: 'Fastly', enName: 'Fastly' },
    'RXRX': { name: 'Recursion', enName: 'Recursion' },
    'NVAX': { name: '諾瓦瓦克斯', enName: 'Novavax' },
    'IBRX': { name: 'ImmunityBio', enName: 'ImmunityBio' },
    'SPCX': { name: 'SpaceX 概念', enName: 'SpaceX' },
    'SMR': { name: 'NuScale', enName: 'NuScale' },
    'WBD': { name: '華納兄弟', enName: 'Warner Bros' },
    'AMC': { name: 'AMC 院線', enName: 'AMC' },
    'CCL': { name: '嘉年華郵輪', enName: 'Carnival' },
    'NCLH': { name: '挪威郵輪', enName: 'Norwegian' },
    'PBR': { name: '巴西石油', enName: 'Petrobras' },
    'PBR-A': { name: '巴西石油 ADR', enName: 'Petrobras' },
    'ITUB': { name: '伊塔烏聯合', enName: 'Itaú' },
    'BBD': { name: '布拉德斯科', enName: 'Bradesco' },
    'ABEV': { name: '安貝夫', enName: 'Ambev' },
    'CTVA': { name: '科迪華', enName: 'Corteva' },
    'MAT': { name: '美泰兒', enName: 'Mattel' },
    'BB': { name: '黑莓', enName: 'BlackBerry' },
    'CCC': { name: 'CCC 科技', enName: 'CCC' },
    'V': { name: 'Visa', enName: 'Visa' },
    'BAC': { name: '美國銀行', enName: 'Bank of America' },
    'WMT': { name: '沃爾瑪', enName: 'Walmart' },
    'KO': { name: '可口可樂', enName: 'Coca-Cola' },
    'F': { name: '福特', enName: 'Ford' },
    'T': { name: 'AT&T', enName: 'AT&T' },
    'VZ': { name: '威訊', enName: 'Verizon' },
    'SPY': { name: '標普500 ETF', enName: 'SPDR S&P 500' },
    'QQQ': { name: '那斯達克100 ETF', enName: 'Invesco QQQ' }
};

let usGlobalTrades = [];
let usGlobalStrongStocks = [];
let lastFetchTimestamp = 0;

/**
 * 檢查當前時間是否處於美股盤後結算即時更新區間 (台灣時間 05:15 ~ 05:30 AM)
 */
function isUsLiveUpdateWindow(date = new Date()) {
    const h = date.getHours();
    const m = date.getMinutes();
    return (h === 5 && m >= 15 && m <= 30);
}

/**
 * 檢查快取資料是否仍然有效 (美股以每日台灣時間 05:30 AM 為結算更新基準點)
 */
function isCacheValid(cacheObj) {
    if (!cacheObj || !cacheObj.data || !cacheObj.timestamp) return false;
    const now = new Date();
    if (isUsLiveUpdateWindow(now)) return false;

    // 必須包含美股資料
    const d = cacheObj.data;
    if (!d.usDailyTrades || !Array.isArray(d.usDailyTrades) || d.usDailyTrades.length === 0) return false;

    // 美股以每日台灣時間 05:30 AM 為盤後結算更新基準點
    const todayTarget = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 5, 30, 0, 0);
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
        // 優先讀取美股專用快取，若無則讀取全站整合快取
        const item = localStorage.getItem(CACHE_KEY) || localStorage.getItem("JOINJO_STOCK_CACHE_V2");
        if (!item) return null;
        const parsed = JSON.parse(item);
        if (parsed && parsed.data && Array.isArray(parsed.data.usDailyTrades) && parsed.data.usDailyTrades.length > 0) {
            return parsed;
        }
        return null;
    } catch (e) {
        console.warn('[JOINJO US] 讀取 localStorage 快取失敗:', e);
        return null;
    }
}

function setCachedData(rawData) {
    try {
        const cached = getCachedData();
        // 如果新拉取的資料中 usStrongStocks 為空，但舊快取或持久快取中有昨日推薦數據，則予以保留，避免覆蓋抹除
        if (!rawData.usStrongStocks || rawData.usStrongStocks.length === 0) {
            if (cached && cached.data && Array.isArray(cached.data.usStrongStocks) && cached.data.usStrongStocks.length > 0) {
                rawData.usStrongStocks = cached.data.usStrongStocks;
            } else {
                try {
                    const saved = localStorage.getItem(STRONG_SECTORS_CACHE_KEY);
                    if (saved) {
                        const parsed = JSON.parse(saved);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            rawData.usStrongStocks = parsed;
                        }
                    }
                } catch (e) { }
            }
        } else if (rawData.usStrongStocks && rawData.usStrongStocks.length > 0) {
            // 有最新推薦數據時，同步更新至獨立持久快取
            localStorage.setItem(STRONG_SECTORS_CACHE_KEY, JSON.stringify(rawData.usStrongStocks));
        }

        localStorage.setItem(CACHE_KEY, JSON.stringify({
            data: rawData,
            timestamp: Date.now()
        }));
    } catch (e) {
        console.warn('[JOINJO US] 寫入 localStorage 快取失敗:', e);
    }
}

/**
 * 解析代碼字串 (例: "SNAP (Snap Inc.)" -> symbol: "SNAP", companyName: "Snap Inc.")
 */
function parseTicker(rawTicker) {
    if (!rawTicker) return { symbol: '', companyName: '' };
    const str = String(rawTicker).trim();
    const match = str.match(/^([A-Za-z0-9\.\-]+)\s*(?:\((.*)\))?$/);
    if (match) {
        const symbol = (match[1] || '').trim().toUpperCase();
        const companyName = (match[2] || '').trim();
        return { symbol, companyName };
    }
    const parts = str.split(/\s+/);
    return {
        symbol: parts[0].toUpperCase(),
        companyName: parts.slice(1).join(' ').replace(/[()]/g, '').trim()
    };
}

/**
 * 精簡公司法定後綴名稱，取得乾淨俐落的英文公司簡稱 / 縮寫
 */
function cleanCompanyName(name) {
    if (!name) return '';
    return name
        .replace(/,\s*Inc\.?| Inc\.?$/i, '')
        .replace(/,\s*LLC\.?| LLC\.?$/i, '')
        .replace(/,\s*Ltd\.?| Ltd\.?$/i, '')
        .replace(/,\s*Corp\.?| Corp\.?$/i, '')
        .replace(/ Corporation(?:\s*Ltd\.?)?$/i, '')
        .replace(/ Holdings(?:\s*(?:Inc\.?|Ltd\.?|Company|LLC|Limited))?$/i, '')
        .replace(/ Company$/i, '')
        .replace(/ Technologies(?:\s*Inc\.?)?$/i, '')
        .replace(/ Pharmaceuticals(?:\s*Inc\.?)?$/i, '')
        .replace(/ Entertainment(?:\s*Holdings)?$/i, '')
        .replace(/ Markets(?:\s*Inc\.?)?$/i, '')
        .replace(/ Intelligent Solutions(?:\s*Holdings)?$/i, '')
        .replace(/ Group(?:\s*Inc\.?)?$/i, '')
        .replace(/ Solutions(?:\s*Holdings)?$/i, '')
        .replace(/ Platforms(?:\s*Inc\.?)?$/i, '')
        .replace(/ Biotherapeutics(?:\s*Inc\.?)?$/i, '')
        .replace(/ Communications(?:\s*Inc\.?)?$/i, '')
        .replace(/ Automotive(?:\s*Inc\.?)?$/i, '')
        .replace(/ Immersion Technologies(?:\s*Inc\.?)?$/i, '')
        .replace(/ Aviation(?:\s*Inc\.?)?$/i, '')
        .replace(/ Computing(?:\s*Inc\.?)?$/i, '')
        .replace(/ Airways(?:\s*Corporation)?$/i, '')
        .replace(/ Exploration Technologies(?:\s*Corp\.?)?$/i, '')
        .replace(/ Discovery(?:\s*Inc\.?)?$/i, '')
        .replace(/ Enterprise Company$/i, '')
        .replace(/ Computer(?:\s*Inc\.?)?$/i, '')
        .replace(/ Machines(?:\s*Inc\.?)?$/i, '')
        .replace(/ Microelectronics(?:\s*Corporation)?$/i, '')
        .replace(/ Infrastructure(?:\s*Corp\.?)?$/i, '')
        .replace(/ Strategies(?:\s*Inc\.?)?$/i, '')
        .replace(/ Micro Devices(?:\s*Inc\.?)?$/i, '')
        .replace(/ Cruise Line Holdings Ltd\.?$/i, '')
        .replace(/ Unibanco Holding S\.A\.?$/i, '')
        .replace(/ Brasileiro S\.A\.? - Petrobras$/i, '')
        .replace(/ Mexican Grill(?:\s*Inc\.?)?$/i, '')
        .replace(/ Capital Inc\.?$/i, '')
        .replace(/ Motor Company$/i, '')
        .replace(/ Limited$/i, '')
        .replace(/ S\.A\.?$/i, '')
        .replace(/ N\.V\.?$/i, '')
        .replace(/ Oyj$/i, '')
        .replace(/ Plc$/i, '')
        .replace(/,?\s*Inc\.?$/i, '')
        .replace(/\.com$/i, '')
        .trim();
}

/**
 * 取得美股英文公司縮寫 (Short English Company Name)
 */
function getCompanyShortName(symbol, rawCompanyName = '') {
    const sym = (symbol || '').toUpperCase().trim();
    const meta = US_STOCK_META[sym];
    if (meta && meta.enName) {
        return meta.enName;
    }
    if (rawCompanyName) {
        const cleaned = cleanCompanyName(rawCompanyName);
        if (cleaned) return cleaned;
    }
    return sym;
}

/**
 * 準備隨機不重複的卡片背景圖 pool
 */
function getShuffledBgList(count) {
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
    const id = scrollEl.id;
    if (id === 'today-strong-scroll-wrapper') {
        return {
            prev: document.getElementById('today-strong-prev'),
            next: document.getElementById('today-strong-next')
        };
    }
    if (id === 'today-buy-scroll-wrapper') {
        return {
            prev: document.getElementById('today-buy-prev'),
            next: document.getElementById('today-buy-next')
        };
    }
    if (id === 'today-sell-scroll-wrapper') {
        return {
            prev: document.getElementById('today-sell-prev'),
            next: document.getElementById('today-sell-next')
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
 * 格式化 DailyStrongMomentum 強勢美股原始資料
 */
function processRawUsStrong(rawData, trades = []) {
    if (!Array.isArray(rawData)) return [];

    // 建立 trades 狀態對照表 (取得各代碼最新狀態)
    const tradeMap = new Map();
    if (Array.isArray(trades)) {
        trades.forEach(t => {
            const sym = (t.symbol || '').toUpperCase();
            if (sym && (!tradeMap.has(sym) || t.date >= tradeMap.get(sym).date)) {
                tradeMap.set(sym, t);
            }
        });
    }

    return rawData
        .filter(row => row && row.date && (row.ticker || row.symbol))
        .map(row => {
            const rawTicker = String(row.ticker || row.symbol || '').trim();
            const { symbol, companyName } = parseTicker(rawTicker);
            const date = String(row.date || '').trim();
            let closePrice = String(row.closePrice || '').trim();
            if (closePrice && !closePrice.startsWith('$') && !isNaN(parseFloat(closePrice.replace(/,/g, '')))) {
                closePrice = `$${closePrice}`;
            }

            const meta = US_STOCK_META[symbol] || {};
            const enName = getCompanyShortName(symbol, companyName);
            const stockName = meta.name || enName || symbol;

            // 若在交易日誌中有記錄，提取對應狀態；否則預設為「強勢多頭」
            const trade = tradeMap.get(symbol);
            let status = '強勢多頭';
            if (trade && trade.status) {
                status = trade.status;
            }

            return {
                date,
                ticker: rawTicker,
                symbol,
                companyName,
                enName,
                stockName,
                fullName: meta.name ? `${meta.name} (${symbol})` : (enName ? `${enName} (${symbol})` : symbol),
                closePrice: closePrice || '-',
                status
            };
        });
}

/**
 * 格式化 autoTradingDaily 交易日誌原始資料
 */
function processRawUsTrades(rawData) {
    if (!Array.isArray(rawData)) return [];

    return rawData
        .filter(row => row && row.date && row.symbol)
        .map(row => {
            const symbol = String(row.symbol || '').trim().toUpperCase();
            const meta = US_STOCK_META[symbol] || { name: symbol };
            const enName = getCompanyShortName(symbol);
            const stockName = meta.name || enName || symbol;
            const status = String(row.status || '').trim();
            let closePrice = String(row.closePrice || '').trim();
            if (closePrice && !closePrice.startsWith('$') && !isNaN(parseFloat(closePrice.replace(/,/g, '')))) {
                closePrice = `$${closePrice}`;
            }

            let state = 'hold';
            if (status.includes('進場')) {
                state = 'buy';
            } else if (status.includes('出場') || status.includes('減碼')) {
                state = 'sell';
            }

            return {
                date: String(row.date || '').trim(),
                symbol: symbol,
                enName: enName,
                stockName: stockName,
                fullName: meta.name ? `${meta.name} ${symbol}` : `${enName} ${symbol}`,
                closePrice: closePrice,
                status: status,
                state: state
            };
        });
}

/**
 * 載入美股數據：使用全自動多策略綜合數據接口 (與台股相同 API 連結)
 * 優先使用快取，05:15~05:30 AM 或快取過期時連線抓取
 */
async function loadUsStockData(forceRefresh = false) {
    const $status = $('p.results');
    const isLive = isUsLiveUpdateWindow();
    const cached = getCachedData();

    let rawData = null;
    let isFromCache = false;
    let dataTimestamp = Date.now();

    // 判斷是否使用快取
    if (!forceRefresh && !isLive && isCacheValid(cached)) {
        rawData = cached.data;
        isFromCache = true;
        dataTimestamp = cached.timestamp;
        console.log('⚡ [JOINJO US] 命中有效快取，免重複發送 API 請求 (建立於: ' + new Date(cached.timestamp).toLocaleString() + ')');
    } else {
        $('body').addClass('loading-view');
        $status.text(isLive ? '05:15 AM 美股盤後結算即時更新中…' : '美股量化交易資料庫連線中…');

        try {
            rawData = await $.getJSON(API);
            if (!rawData || !rawData.ok) {
                throw new Error((rawData && rawData.message) || '未知錯誤');
            }
            setCachedData(rawData);
            lastFetchTimestamp = Date.now();
            dataTimestamp = lastFetchTimestamp;
            console.log('🌐 [JOINJO US] 已自整合 API 獲取最新美股數據並寫入快取');
        } catch (err) {
            console.error('🌐 [JOINJO US] API 請求失敗:', err);
            // 異常容錯降級：若網路連線中斷但已有舊快取可用，改用舊快取避免頁面空白
            if (cached && cached.data && Array.isArray(cached.data.usDailyTrades) && cached.data.usDailyTrades.length > 0) {
                console.warn('⚠️ [JOINJO US] 網路請求失敗，改以舊快取數據降級呈現');
                rawData = cached.data;
                isFromCache = true;
                dataTimestamp = cached.timestamp;
            } else {
                $status.text('錯誤：' + (err.message || '未知錯誤'));
                return;
            }
        }
    }

    // 若 rawData 中的 usStrongStocks 為空，嘗試自獨立持久快取恢復昨日推薦數據
    if (!rawData.usStrongStocks || rawData.usStrongStocks.length === 0) {
        try {
            const saved = localStorage.getItem(STRONG_SECTORS_CACHE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    rawData.usStrongStocks = parsed;
                }
            }
        } catch (e) { }
    }

    try {
        renderUsDashboard(rawData, isFromCache, dataTimestamp);
    } catch (renderErr) {
        console.error('[JOINJO US] 渲染美股儀表板發生錯誤:', renderErr);
        $status.text('渲染錯誤：' + renderErr.message);
    }
}

/**
 * 渲染美股儀表板主邏輯
 */
function renderUsDashboard(rawData, isFromCache, dataTimestamp) {
    const $status = $('p.results');

    const tradesRaw = (rawData && rawData.usDailyTrades) ? rawData.usDailyTrades : [];
    const strongRaw = (rawData && rawData.usStrongStocks) ? rawData.usStrongStocks : [];

    const trades = processRawUsTrades(tradesRaw);
    usGlobalTrades = trades;

    const strongStocks = processRawUsStrong(strongRaw, trades);
    usGlobalStrongStocks = strongStocks;

    if (trades.length === 0 && strongStocks.length === 0) {
        $status.text('無可呈現的美股資料');
        $('body').removeClass('loading-view');
        return;
    }

    // --- 1. 渲染強勢美股推薦卡片 (#today-strong) (直接載入近5日推薦) ---
    renderStrongSection(strongStocks);

    // --- 2. 渲染操作建議卡片 (建議買進 & 建議賣出) (直接載入近5日數據) ---
    renderBuyCards('#today-buy-cards', trades);
    renderSellCards('#today-sell-cards', trades);

    // --- 3. 橫向捲動按鈕綁定 (廣告輪播級流暢滑動，不循環) ---
    // 強勢股捲動
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
        if (scrollEl && (maxScroll === 0 || scrollEl.scrollLeft < maxScroll - 4)) {
            $(this).prop('disabled', false).removeClass('is-disabled');
        }
        if ($(this).prop('disabled') || $(this).hasClass('is-disabled')) return;
        scrollCardCarousel('#today-strong-scroll-wrapper', 1);
    });

    // 建議買進捲動
    $('#today-buy-prev').off('click').on('click', function () {
        const scrollEl = document.getElementById('today-buy-scroll-wrapper');
        if (scrollEl && scrollEl.scrollLeft > 4) {
            $(this).prop('disabled', false).removeClass('is-disabled');
        }
        if ($(this).prop('disabled') || $(this).hasClass('is-disabled')) return;
        scrollCardCarousel('#today-buy-scroll-wrapper', -1);
    });
    $('#today-buy-next').off('click').on('click', function () {
        const scrollEl = document.getElementById('today-buy-scroll-wrapper');
        const maxScroll = scrollEl ? Math.max(0, scrollEl.scrollWidth - scrollEl.clientWidth) : 0;
        if (scrollEl && (maxScroll === 0 || scrollEl.scrollLeft < maxScroll - 4)) {
            $(this).prop('disabled', false).removeClass('is-disabled');
        }
        if ($(this).prop('disabled') || $(this).hasClass('is-disabled')) return;
        scrollCardCarousel('#today-buy-scroll-wrapper', 1);
    });

    // 建議賣出捲動
    $('#today-sell-prev').off('click').on('click', function () {
        const scrollEl = document.getElementById('today-sell-scroll-wrapper');
        if (scrollEl && scrollEl.scrollLeft > 4) {
            $(this).prop('disabled', false).removeClass('is-disabled');
        }
        if ($(this).prop('disabled') || $(this).hasClass('is-disabled')) return;
        scrollCardCarousel('#today-sell-scroll-wrapper', -1);
    });
    $('#today-sell-next').off('click').on('click', function () {
        const scrollEl = document.getElementById('today-sell-scroll-wrapper');
        const maxScroll = scrollEl ? Math.max(0, scrollEl.scrollWidth - scrollEl.clientWidth) : 0;
        if (scrollEl && (maxScroll === 0 || scrollEl.scrollLeft < maxScroll - 4)) {
            $(this).prop('disabled', false).removeClass('is-disabled');
        }
        if ($(this).prop('disabled') || $(this).hasClass('is-disabled')) return;
        scrollCardCarousel('#today-sell-scroll-wrapper', 1);
    });

    // 初始更新三大區塊按鈕狀態
    setTimeout(() => {
        updateCarouselButtons(document.getElementById('today-strong-scroll-wrapper'));
        updateCarouselButtons(document.getElementById('today-buy-scroll-wrapper'));
        updateCarouselButtons(document.getElementById('today-sell-scroll-wrapper'));
    }, 50);

    // 啟用三區的滑鼠拖曳橫向捲動
    enableHorizontalDrag('#today-strong-scroll-wrapper');
    enableHorizontalDrag('#today-buy-scroll-wrapper');
    enableHorizontalDrag('#today-sell-scroll-wrapper');

    // --- 4. 頂部狀態列更新 (樣式統一簡化，縮小寬度，附帶重新整理 icon) ---
    $status.text('載入完成');
    const updateDate = new Date(dataTimestamp);
    const m = String(updateDate.getMonth() + 1).padStart(2, '0');
    const d = String(updateDate.getDate()).padStart(2, '0');
    const hh = String(updateDate.getHours()).padStart(2, '0');
    const mm = String(updateDate.getMinutes()).padStart(2, '0');
    const isLive = isUsLiveUpdateWindow(updateDate);
    const dotHtml = isLive
        ? '<span class="w-1.5 h-1.5 rounded-full bg-[#00E701] animate-ping flex-shrink-0"></span>'
        : '<span class="w-1.5 h-1.5 rounded-full bg-[#00E701] flex-shrink-0"></span>';

    const statusHtml = `
        <span class="inline-flex items-center gap-1.5 text-slate-300 font-mono text-xs">
            ${dotHtml}
            <span>美股: ${m}/${d} ${hh}:${mm}</span>
            <svg class="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:rotate-180 transition-transform duration-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
        </span>
    `;

    $('#header-update-status')
        .html(statusHtml)
        .css('cursor', 'pointer')
        .attr('title', '美股每日 05:15 ~ 05:30 AM 自動結算更新；點擊可手動強制重新連線載入數據。')
        .off('click')
        .on('click', function () {
            console.log('🔄 [JOINJO US] 使用者點擊強制重新整理');
            loadUsStockData(true);
        });

    setTimeout(() => {
        $('body').removeClass('loading-view');
        setTimeout(() => {
            updateCarouselButtons(document.getElementById('today-strong-scroll-wrapper'));
            updateCarouselButtons(document.getElementById('today-buy-scroll-wrapper'));
            updateCarouselButtons(document.getElementById('today-sell-scroll-wrapper'));
        }, 50);
    }, isFromCache ? 150 : 500);
}

$(window).on('resize', function () {
    updateCarouselButtons(document.getElementById('today-strong-scroll-wrapper'));
    updateCarouselButtons(document.getElementById('today-buy-scroll-wrapper'));
    updateCarouselButtons(document.getElementById('today-sell-scroll-wrapper'));
});

/**
 * 渲染強勢美股推薦卡片與區塊 (直接顯示近5天推薦)
 */
function renderStrongSection(strongStocks) {
    const $container = $('#today-strong-cards');
    const $pill = $('#today-strong-date-pill');

    if (!Array.isArray(strongStocks) || strongStocks.length === 0) {
        $container.html('<div class="w-full py-8 text-center text-slate-400 font-mono text-sm bg-[#151C24] border border-white/10 rounded-2xl">今日無強勢美股推薦</div>');
        if ($pill.length) $pill.text('無推薦資料');
        return;
    }

    // 取得所有不同日期 (降冪排序，最新在前)
    const distinctDates = [...new Set(strongStocks.map(s => s.date).filter(Boolean))].sort().reverse();
    const recent5Dates = distinctDates.slice(0, 5);

    // 將近 5 天的所有強勢推薦股全部放入，依最新日期排在最前 (同日依價格降冪排序)
    const displayList = [...strongStocks]
        .filter(s => s.date && recent5Dates.includes(s.date))
        .sort((a, b) => {
            if (b.date !== a.date) return b.date.localeCompare(a.date);
            const priceA = parseFloat(String(a.closePrice).replace(/[^0-9.]/g, '')) || 0;
            const priceB = parseFloat(String(b.closePrice).replace(/[^0-9.]/g, '')) || 0;
            return priceB - priceA;
        });

    if ($pill.length) $pill.text(`近5日推薦: 共 ${displayList.length} 檔`);

    renderStrongCards('#today-strong-cards', displayList);
}

/**
 * 渲染強勢美股推薦卡片 DOM
 */
function renderStrongCards(containerSelector, strongData) {
    const $container = $(containerSelector);
    $container.empty();

    if (!strongData || strongData.length === 0) {
        $container.html('<div class="w-full py-8 text-center text-slate-400 font-mono text-sm bg-[#151C24] border border-white/10 rounded-2xl">今日無美股推薦資料</div>');
        return;
    }

    const bgList = getShuffledBgList(strongData.length);

    strongData.forEach((item, index) => {
        const bgImage = bgList[index] || 'img/card-bg-1.jpg';
        const symbol = item.symbol;
        const enName = item.enName || getCompanyShortName(symbol, item.companyName);
        const closePrice = item.closePrice || '-';
        const date = item.date || '';
        const shortDate = formatMonthDay(date);

        const dateBadgeHtml = shortDate
            ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-black/60 backdrop-blur-md text-slate-200 shadow-sm">${shortDate}</span>`
            : '';

        const $card = $(`
            <div class="strong-stock-card relative rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between transition-colors duration-200 hover:border-[#00E701] flex-shrink-0 cursor-pointer" 
                 style="background: url('${bgImage}') top center / cover no-repeat;"
                 data-stock="${enName}" data-symbol="${symbol}" title="點擊查看「${enName} (${symbol})」詳細情報">
              
              <!-- 上半部視覺區：頂部時間標籤 (時間靠左，僅保留月日，無外框線，佔卡面 1/4) -->
              <div class="strong-card-visual h-1/4 w-full flex items-start justify-start p-2.5">
                ${dateBadgeHtml}
              </div>

              <!-- 下半部純文字排版區 (佔卡面 3/4) -->
              <div class="strong-card-text h-3/4">
                <!-- 1. 股票代碼 (無時間標籤) -->
                <span class="strong-code-badge inline-flex items-center text-[10px] sm:text-[11px] font-black font-mono px-2.5 py-0.5 rounded-md tracking-wider bg-amber-500/10 backdrop-blur-md text-[#FFB800] border border-amber-500/30 shadow-[0_0_8px_rgba(255,184,0,0.25)]">
                  ${symbol}
                </span>

                <!-- 2. 股票名稱 (英文公司縮寫) -->
                <h3 class="text-lg sm:text-xl font-black text-[#00E701] drop-shadow-[0_0_16px_rgba(0,231,1,0.6)] tracking-wide my-1 truncate max-w-full px-1" title="${enName}">
                  ${enName}
                </h3>

                <!-- 3. 收盤價 -->
                <div class="text-base sm:text-lg font-mono font-bold text-slate-100 tracking-wider text-center mt-0.5">
                  ${closePrice}
                </div>
              </div>
            </div>
        `);

        $container.append($card);
    });
}

/**
 * 渲染建議買進卡片 (#today-buy-cards) (直接顯示近5日買進推薦)
 */
function renderBuyCards(containerSelector, trades) {
    const $container = $(containerSelector);
    $container.empty();

    const buyTrades = trades.filter(t => t.state === 'buy');

    if (!Array.isArray(buyTrades) || buyTrades.length === 0) {
        $container.html('<div class="w-full py-8 text-center text-slate-400 font-mono text-sm bg-[#0D1117] border border-white/10 rounded-2xl">今日無建議買進股票</div>');
        $('#today-buy-date-pill').text('無買進推薦');
        return;
    }

    // 取得所有不同日期 (降冪排序，最新在前)
    const distinctDates = [...new Set(buyTrades.map(t => t.date).filter(Boolean))].sort().reverse();
    const recent5Dates = distinctDates.slice(0, 5);

    // 將近 5 天的所有買進推薦股全部放入，依最新日期排在最前 (同日依代碼排序)
    const filtered = buyTrades
        .filter(t => t.date && recent5Dates.includes(t.date))
        .sort((a, b) => {
            if (b.date !== a.date) return b.date.localeCompare(a.date);
            return a.symbol.localeCompare(b.symbol);
        });

    $('#today-buy-date-pill').text(`近5日買進: 共 ${filtered.length} 檔`);

    if (filtered.length === 0) {
        $container.html('<div class="w-full py-8 text-center text-slate-400 font-mono text-sm bg-[#0D1117] border border-white/10 rounded-2xl">今日無建議買進股票</div>');
        return;
    }

    const bgList = getShuffledBgList(filtered.length);

    filtered.forEach((item, index) => {
        const bgImage = bgList[index] || 'img/card-bg-1.jpg';
        const symbol = item.symbol;
        const enName = item.enName || getCompanyShortName(symbol);
        const closePrice = item.closePrice || '-';
        const date = item.date || '';
        const shortDate = formatMonthDay(date);

        const dateBadgeHtml = shortDate
            ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-black/60 backdrop-blur-md text-slate-200 shadow-sm">${shortDate}</span>`
            : '';

        const $card = $(`
            <div class="strong-stock-card relative rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between transition-colors duration-200 hover:border-[#00E701] flex-shrink-0 cursor-pointer" 
                 style="background: url('${bgImage}') top center / cover no-repeat;"
                 data-stock="${enName}" data-symbol="${symbol}" title="點擊查看「${enName} (${symbol})」詳細情報">
              
              <!-- 上半部視覺區：頂部時間標籤 (時間靠左，僅保留月日，無外框線，佔卡面 1/4) -->
              <div class="strong-card-visual h-1/4 w-full flex items-start justify-start p-2.5">
                ${dateBadgeHtml}
              </div>

              <!-- 下半部純文字排版區 (佔卡面 3/4) -->
              <div class="strong-card-text h-3/4">
                <!-- 1. 股票代碼 (移除原先的時間標籤) -->
                <span class="strong-code-badge inline-flex items-center text-[10px] sm:text-[11px] font-black font-mono px-2.5 py-0.5 rounded-md tracking-wider bg-emerald-500/10 backdrop-blur-md text-[#00E701] border border-emerald-500/30 shadow-[0_0_8px_rgba(0,231,1,0.25)]">
                  ${symbol}
                </span>

                <!-- 2. 股票名稱 (英文公司縮寫) -->
                <h3 class="text-lg sm:text-xl font-black text-[#00E701] drop-shadow-[0_0_16px_rgba(0,231,1,0.6)] tracking-wide my-1 truncate max-w-full px-1" title="${enName}">
                  ${enName}
                </h3>

                <!-- 3. 買進收盤價 -->
                <div class="text-base sm:text-lg font-mono font-bold text-slate-100 tracking-wider text-center mt-0.5">
                  ${closePrice}
                </div>
              </div>
            </div>
        `);

        $container.append($card);
    });
}

/**
 * 渲染建議賣出卡片 (#today-sell-cards) (直接顯示近5日出場推薦)
 */
function renderSellCards(containerSelector, trades) {
    const $container = $(containerSelector);
    $container.empty();

    const sellTrades = trades.filter(t => t.state === 'sell');

    if (!Array.isArray(sellTrades) || sellTrades.length === 0) {
        $container.html('<div class="w-full py-8 text-center text-slate-400 font-mono text-sm bg-[#0D1117] border border-white/10 rounded-2xl">今日無建議賣出股票</div>');
        $('#today-sell-date-pill').text('無出場推薦');
        return;
    }

    // 取得所有不同日期 (降冪排序，最新在前)
    const distinctDates = [...new Set(sellTrades.map(t => t.date).filter(Boolean))].sort().reverse();
    const recent5Dates = distinctDates.slice(0, 5);

    // 將近 5 天的所有出場推薦股全部放入，依最新日期排在最前 (同日依代碼排序)
    const filtered = sellTrades
        .filter(t => t.date && recent5Dates.includes(t.date))
        .sort((a, b) => {
            if (b.date !== a.date) return b.date.localeCompare(a.date);
            return a.symbol.localeCompare(b.symbol);
        });

    $('#today-sell-date-pill').text(`近5日出場: 共 ${filtered.length} 檔`);

    if (filtered.length === 0) {
        $container.html('<div class="w-full py-8 text-center text-slate-400 font-mono text-sm bg-[#0D1117] border border-white/10 rounded-2xl">今日無建議賣出股票</div>');
        return;
    }

    const bgList = getShuffledBgList(filtered.length);

    filtered.forEach((item, index) => {
        const bgImage = bgList[index] || 'img/card-bg-1.jpg';
        const symbol = item.symbol;
        const enName = item.enName || getCompanyShortName(symbol);
        const closePrice = item.closePrice || '-';
        const isReduce = item.status.includes('減碼');
        const date = item.date || '';
        const shortDate = formatMonthDay(date);

        const dateBadgeHtml = shortDate
            ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-black/60 backdrop-blur-md text-slate-200 shadow-sm">${shortDate}</span>`
            : '';

        const nameColorClass = isReduce ? 'text-amber-400 drop-shadow-[0_0_16px_rgba(255,184,0,0.6)]' : 'text-rose-400 drop-shadow-[0_0_16px_rgba(244,63,94,0.6)]';
        const hoverBorderClass = isReduce ? 'hover:border-amber-400' : 'hover:border-rose-400';

        const $card = $(`
            <div class="strong-stock-card relative rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between transition-colors duration-200 ${hoverBorderClass} flex-shrink-0 cursor-pointer" 
                 style="background: url('${bgImage}') top center / cover no-repeat;"
                 data-stock="${enName}" data-symbol="${symbol}" title="點擊查看「${enName} (${symbol})」詳細情報">
              
              <!-- 上半部視覺區：頂部時間標籤 (時間靠左，僅保留月日，無外框線，佔卡面 1/4) -->
              <div class="strong-card-visual h-1/4 w-full flex items-start justify-start p-2.5">
                ${dateBadgeHtml}
              </div>

              <!-- 下半部純文字排版區 (佔卡面 3/4) -->
              <div class="strong-card-text h-3/4">
                <!-- 1. 股票代碼 (移除原先的時間標籤) -->
                <span class="strong-code-badge inline-flex items-center text-[10px] sm:text-[11px] font-black font-mono px-2.5 py-0.5 rounded-md tracking-wider bg-amber-500/10 backdrop-blur-md text-[#FFB800] border border-amber-500/30 shadow-[0_0_8px_rgba(255,184,0,0.25)]">
                  ${symbol}
                </span>

                <!-- 2. 股票名稱 (英文公司縮寫) -->
                <h3 class="text-lg sm:text-xl font-black ${nameColorClass} tracking-wide my-1 truncate max-w-full px-1" title="${enName}">
                  ${enName}
                </h3>

                <!-- 3. 出場狀態與價格 -->
                <div class="text-base sm:text-lg font-mono font-bold text-slate-100 tracking-wider text-center mt-0.5">
                  ${closePrice}
                </div>
              </div>
            </div>
        `);

        $container.append($card);
    });
}

/**
 * 美股即時搜尋 (整合 autoTradingDaily 交易日誌與 DailyStrongMomentum 強勢推薦)
 */
function executeUsStockSearch(keyword, $result) {
    if (!keyword) {
        $result.addClass('hidden').hide().empty();
        return;
    }

    const kw = keyword.toLowerCase().trim();

    const tradeMatches = usGlobalTrades.filter(t =>
        t.symbol.toLowerCase().includes(kw) ||
        (t.stockName && t.stockName.toLowerCase().includes(kw)) ||
        (t.enName && t.enName.toLowerCase().includes(kw))
    );

    const strongMatches = usGlobalStrongStocks.filter(s =>
        s.symbol.toLowerCase().includes(kw) ||
        (s.stockName && s.stockName.toLowerCase().includes(kw)) ||
        (s.enName && s.enName.toLowerCase().includes(kw)) ||
        (s.companyName && s.companyName.toLowerCase().includes(kw))
    );

    if (tradeMatches.length === 0 && strongMatches.length === 0) {
        $result.html(`
            <div class="p-3 text-xs text-slate-400">
                <span class="text-amber-400 font-bold">美股搜尋：</span> 找不到與「<b class="text-white">${keyword}</b>」相關的交易或強勢推薦紀錄
            </div>
        `).removeClass('hidden').show();
        return;
    }

    // 按 symbol 分組
    const symbols = [...new Set([...tradeMatches.map(t => t.symbol), ...strongMatches.map(s => s.symbol)])];

    let html = '<div class="p-3 text-xs space-y-3 max-h-80 overflow-y-auto">';
    symbols.forEach(sym => {
        const tList = tradeMatches.filter(t => t.symbol === sym);
        const sList = strongMatches.filter(s => s.symbol === sym);
        const meta = US_STOCK_META[sym] || {};
        const firstItem = tList[0] || sList[0] || {};
        const stockName = meta.name || firstItem.stockName || sym;

        let statusPill = '';
        if (tList.length > 0) {
            const latestTrade = tList[0];
            if (latestTrade.status.includes('進場')) {
                statusPill = `<span class="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[#00E701] font-bold">🔥 目前進場中</span>`;
            } else if (latestTrade.status.includes('減碼')) {
                statusPill = `<span class="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">⚡ 減碼50%</span>`;
            } else {
                statusPill = `<span class="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-bold">🎯 目前已出場</span>`;
            }
        } else {
            statusPill = `<span class="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">💎 強勢動能選股</span>`;
        }

        html += `
            <div class="border-b border-white/10 pb-2 last:border-b-0">
                <div class="flex items-center justify-between gap-2 mb-1.5">
                    <div>
                        <span class="font-black text-white font-mono text-sm">${sym}</span>
                        <span class="text-[#00E701] font-bold ml-1">${stockName}</span>
                    </div>
                    <div>${statusPill}</div>
                </div>
                <div class="space-y-1 pl-2 border-l-2 border-[#00E701]/40 text-slate-300">
        `;

        if (tList.length > 0) {
            tList.slice(0, 3).forEach(item => {
                const isBuy = item.state === 'buy';
                const actionColor = isBuy ? 'text-[#00E701]' : (item.status.includes('減碼') ? 'text-amber-400' : 'text-rose-400');
                html += `
                    <div class="flex items-center justify-between text-[11px]">
                        <span class="font-mono text-slate-400">${item.date}</span>
                        <span class="font-bold ${actionColor}">${item.status}</span>
                        <span class="font-mono text-white">${item.closePrice}</span>
                    </div>
                `;
            });
        }

        if (sList.length > 0) {
            sList.slice(0, 2).forEach(item => {
                html += `
                    <div class="flex items-center justify-between text-[11px] text-cyan-300/80">
                        <span class="font-mono text-slate-400">${item.date}</span>
                        <span class="font-bold text-cyan-400">💎 強勢推薦</span>
                        <span class="font-mono text-white">${item.closePrice}</span>
                    </div>
                `;
            });
        }

        html += `
                </div>
            </div>
        `;
    });

    html += '</div>';
    $result.html(html).removeClass('hidden').show();
}

// 點擊強勢卡片連動搜尋 (全螢幕統一使用下滑搜尋列)
$(document).off('click', '.strong-stock-card').on('click', '.strong-stock-card', function () {
    const symbol = $(this).data('symbol');
    const stockName = $(this).data('stock');
    const target = symbol || stockName;

    if (target) {
        $('#mobile-search-container').removeClass('hidden').slideDown(200, function () {
            $('#mobile-stock-search-input').val(target).focus();
            executeUsStockSearch(target, $('#mobile-stock-search-result'));
        });
        $('html, body').animate({ scrollTop: 0 }, 300);
    }
});

// 搜尋按鈕與鍵盤 Enter 事件綁定 (統一使用 mobile-stock-search)
$(function () {
    $('#mobile-stock-search-btn').off('click').on('click', function () {
        const kw = ($('#mobile-stock-search-input').val() || '').trim();
        executeUsStockSearch(kw, $('#mobile-stock-search-result'));
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

    // 點擊搜尋框外自動收合搜尋列
    $(document).on('click', function (e) {
        if (!$(e.target).closest('#mobile-search-toggle, #mobile-search-container').length) {
            const $container = $('#mobile-search-container');
            if (!$container.hasClass('hidden')) {
                $container.slideUp(200, function () {
                    $(this).addClass('hidden');
                });
            }
        }
    });
});

// 頁面初始化
$(async function () {
    await loadUsStockData(false);
});
