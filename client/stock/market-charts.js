$(function () {
    // --- 加入多重 CORS 代理伺服器 Fallback 機制 ---
    // 解決單一代理服務 (如 corsproxy.io) 故障或被 Yahoo 阻擋導致無法抓取資料的問題
    async function fetchWithProxyFallback(targetUrl) {
        const proxies = [
            `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
            `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`
        ];

        let lastError;
        for (const proxyUrl of proxies) {
            try {
                const response = await fetch(proxyUrl, { cache: 'no-store' });
                if (response.ok) {
                    return response;
                } else {
                    lastError = new Error(`HTTP 錯誤狀態碼: ${response.status}`);
                }
            } catch (err) {
                lastError = err;
                console.warn(`代理請求失敗 (${proxyUrl}):`, err);
            }
        }
        throw lastError || new Error('所有代理伺服器均請求失敗');
    }

    // --- 從 Yahoo Finance API 取得真實數據 ---
    async function fetchMarketData(symbol) {
        try {
            // 加入時間戳記避免代理伺服器快取
            const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1mo&interval=1d&_=${Date.now()}`;
            const response = await fetchWithProxyFallback(targetUrl);
            const json = await response.json();

            const closePrices = json.chart.result[0].indicators.quote[0].close;
            // 過濾無效值(null)並四捨五入，最後取近 20 天數據
            const validPrices = closePrices.filter(p => p !== null).map(p => Math.round(p));
            return validPrices.slice(-20);
        } catch (error) {
            console.error(`抓取 ${symbol} 數據發生錯誤:`, error);
            return []; // 失敗時回傳空陣列以免畫面當機
        }
    }

    // --- 輔助函式：更新儀表板進度條 ---
    function updateGauge(prefix, currentVal) {
        const max = parseFloat($(`#${prefix}-high`).data('val'));
        const min = parseFloat($(`#${prefix}-low`).data('val'));

        if (!isNaN(max) && !isNaN(min) && max > min) {
            let percentage = ((currentVal - min) / (max - min)) * 100;
            // 限制在 0% ~ 100% 之間，避免超跌或突破時破版
            percentage = Math.max(0, Math.min(100, percentage));
            $(`#${prefix}-gauge`).css('width', percentage + '%');
        }
    }

    function updateMarketSummary(prefix, data) {
        if (!data || data.length === 0) return; // 確保有數據才更新

        const today = data[data.length - 1];
        const max = Math.max(...data);
        const min = Math.min(...data);

        // 將原始數值存入 data 屬性，供計算進度條使用
        $(`#${prefix}-high`).text(max.toLocaleString()).data('val', max);
        $(`#${prefix}-low`).text(min.toLocaleString()).data('val', min);
        $(`#${prefix}-today`).text(today.toLocaleString());

        updateGauge(prefix, today);
    }

    // --- 從 Yahoo 網頁抓取即時數據 ---
    async function fetchYahooWebMarketData() {
        try {
            const fetchPrice = async (symbol) => {
                // 加入時間戳記避免代理伺服器快取
                const targetUrl = `https://tw.stock.yahoo.com/quote/${symbol}?_=${Date.now()}`;

                const response = await fetchWithProxyFallback(targetUrl);

                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // Yahoo 股市網頁的主要報價數字，通常帶有 Fz(32px) 這個 class
                let priceSpan = Array.from(doc.querySelectorAll('span')).find(el => el.className && typeof el.className === 'string' && el.className.includes('Fz(32px)'));

                // Fallback: 如果 Yahoo 修改了 class 導致 Fz(32px) 失效，改用其他包含小數點或逗號的結構特徵尋找
                if (!priceSpan) {
                    priceSpan = Array.from(doc.querySelectorAll('span')).find(el => el.className && typeof el.className === 'string' && el.className.includes('Fw(b)') && (el.innerText.includes(',') || el.innerText.includes('.')));
                }

                return priceSpan ? parseFloat(priceSpan.innerText.replace(/,/g, '')) : null;
            };

            const taiex = await fetchPrice('%5ETWII');
            const tpex = await fetchPrice('%5ETWOII');

            return { taiex, tpex };
        } catch (error) {
            console.error('抓取 Yahoo 網頁數據發生錯誤:', error);
            return { taiex: null, tpex: null };
        }
    }

    async function refreshMarketData() {
        // 1. 抓取 Yahoo 歷史數據 (用來計算近20天前高與前低)
        const taiexData = await fetchMarketData('^TWII');
        const tpexData = await fetchMarketData('^TWOII');
        updateMarketSummary('taiex', taiexData);
        updateMarketSummary('tpex', tpexData);

        // 2. 抓取 Yahoo 網頁數據，覆蓋「今日數字」確保最新與精準
        const webData = await fetchYahooWebMarketData();

        if (webData.taiex) {
            $('#taiex-today').text(webData.taiex.toLocaleString());
            updateGauge('taiex', webData.taiex);
        }
        if (webData.tpex) {
            $('#tpex-today').text(webData.tpex.toLocaleString());
            updateGauge('tpex', webData.tpex);
        }

        // 數據更新完成後，將整個市場指數區塊淡入顯示
        $('#market-summary-section').fadeIn(400);
    }

    // 初始化先執行一次
    refreshMarketData();
});