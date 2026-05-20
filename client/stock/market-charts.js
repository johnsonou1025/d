$(function () {
    // --- 從 Yahoo Finance API 取得真實數據 ---
    async function fetchMarketData(symbol) {
        try {
            // 加入時間戳記避免代理伺服器快取
            const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1mo&interval=1d&_=${Date.now()}`;
            // 使用 CORS 代理伺服器 (corsproxy.io) 解決跨網域阻擋的問題
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

            const response = await fetch(proxyUrl, { cache: 'no-store' });
            if (!response.ok) throw new Error('API 請求失敗');
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

    function updateMarketSummary(prefix, data) {
        if (!data || data.length === 0) return; // 確保有數據才更新

        const today = data[data.length - 1];
        const max = Math.max(...data);
        const min = Math.min(...data);

        $(`#${prefix}-high`).text(max.toLocaleString()).css('color', 'var(--danger-color)'); // 前高使用紅色 (或危險色)
        $(`#${prefix}-low`).text(min.toLocaleString()).css('color', 'var(--success-color)'); // 前低使用綠色 (或成功色)
        $(`#${prefix}-today`).text(today.toLocaleString());
    }

    // --- 從 Yahoo 網頁抓取即時數據 ---
    async function fetchYahooWebMarketData() {
        try {
            const fetchPrice = async (symbol) => {
                // 加入時間戳記避免代理伺服器快取
                const targetUrl = `https://tw.stock.yahoo.com/quote/${symbol}?_=${Date.now()}`;
                // 使用 CORS 代理伺服器 (corsproxy.io) 解決跨網域阻擋的問題
                const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

                const response = await fetch(proxyUrl, { cache: 'no-store' });
                if (!response.ok) throw new Error('API 請求失敗');

                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // Yahoo 股市網頁的主要報價數字，通常帶有 Fz(32px) 這個 class
                const priceSpan = Array.from(doc.querySelectorAll('span')).find(el => el.className && typeof el.className === 'string' && el.className.includes('Fz(32px)'));
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
        }
        if (webData.tpex) {
            $('#tpex-today').text(webData.tpex.toLocaleString());
        }
    }

    // 初始化先執行一次
    refreshMarketData();

    let countdownSeconds = 120; // 2分鐘 = 120秒

    // 設置計時器：每隔 1 秒執行一次倒數檢查
    setInterval(function () {
        const now = new Date();
        const h = now.getHours();
        const m = now.getMinutes();

        // 判斷是否在開盤時間 09:00 ~ 13:30
        const isMarketOpen = (h === 9 && m >= 0) || (h > 9 && h < 13) || (h === 13 && m <= 30);

        if (isMarketOpen) {
            countdownSeconds--;
            // 開盤期間：更新倒數文字並確保顯示
            $('.countdown-timer').text(`更新倒數 ${countdownSeconds}s`).show();

            if (countdownSeconds <= 0) {
                refreshMarketData();
                countdownSeconds = 120; // 重新重置為 2 分鐘
            }
        } else {
            // 休市期間：直接將計時器隱藏
            $('.countdown-timer').hide();
            countdownSeconds = 120;
        }
    }, 1000); // 1秒 = 1000 毫秒
});