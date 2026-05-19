$(function () {
    // --- 模擬取得近 20 天數據 (未來若有真實 API 可從此處替換) ---
    function generateMockData(startValue, volatility) {
        let data = [], currentValue = startValue;
        for (let i = 19; i >= 0; i--) {
            currentValue = currentValue + (Math.random() - 0.45) * volatility;
            data.push(Math.round(currentValue));
        }
        return data;
    }

    const taiexData = generateMockData(21000, 300);
    const tpexData = generateMockData(250, 5);

    function updateMarketSummary(prefix, data) {
        const today = data[data.length - 1];
        const max = Math.max(...data);
        const min = Math.min(...data);

        $(`#${prefix}-high`).text(max.toLocaleString());
        $(`#${prefix}-low`).text(min.toLocaleString());
        $(`#${prefix}-today`).text(today.toLocaleString());
    }

    // 更新畫面
    updateMarketSummary('taiex', taiexData);
    updateMarketSummary('tpex', tpexData);
});