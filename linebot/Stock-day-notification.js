function check0050SignalToday() {
    const url = "https://query1.finance.yahoo.com/v8/finance/chart/0050.TW?interval=1d&range=30d";
    const response = UrlFetchApp.fetch(url);
    const json = JSON.parse(response.getContentText());

    const result = json.chart.result[0];
    const timestamps = result.timestamp;
    const closes = result.indicators.quote[0].close;

    const rsiValues = calculateRSI(closes, 14);
    const i = closes.length - 1; // 最新一筆

    const closeToday = closes[i];
    const closeYesterday = closes[i - 1];
    const rsi = rsiValues[i];
    const changePercent = ((closeToday - closeYesterday) / closeYesterday * 100).toFixed(2);

    const dateStr = Utilities.formatDate(new Date(timestamps[i] * 1000), "Asia/Taipei", "yyyy-MM-dd");

    if (isNaN(rsi)) {
        Logger.log("⚠️ RSI 無效，資料不足。");
        return;
    }

    if (changePercent <= -0.5 && rsi < 50) {
        MailApp.sendEmail("youremail@example.com", `📉 0050 今日可考慮買進`,
            `✅ 日期：${dateStr}\n收盤價：${closeToday.toFixed(2)}\n跌幅：${changePercent}%\nRSI：${rsi.toFixed(2)}`);
    } else if (rsi >= 70) {
        MailApp.sendEmail("youremail@example.com", `📈 0050 今日可考慮賣出`,
            `⚠️ 日期：${dateStr}\n收盤價：${closeToday.toFixed(2)}\nRSI：${rsi.toFixed(2)}（高於70）`);
    } else {
        Logger.log("✅ 今日無明確買賣訊號");
    }
}

function calculateRSI(closes, period) {
    let gains = [], losses = [], rsiArray = [];

    for (let i = 1; i < closes.length; i++) {
        let change = closes[i] - closes[i - 1];
        gains.push(change > 0 ? change : 0);
        losses.push(change < 0 ? Math.abs(change) : 0);

        if (i >= period) {
            let avgGain = average(gains.slice(i - period, i));
            let avgLoss = average(losses.slice(i - period, i));
            let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
            let rsi = 100 - (100 / (1 + rs));
            rsiArray[i] = rsi;
        } else {
            rsiArray[i] = NaN;
        }
    }

    return rsiArray;
}

function average(arr) {
    const valid = arr.filter(n => !isNaN(n));
    return valid.reduce((a, b) => a + b, 0) / valid.length;
}

