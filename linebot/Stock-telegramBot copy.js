// 主程式
function fetchMultipleStocks() {
    const stockListSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("StockList");
    const stockSymbols = stockListSheet.getRange("A2:B").getValues().filter(row => row[0] && row[1]);

    const messages = [];

    for (let [symbol, name] of stockSymbols) {
        const result = fetchStockData(symbol.trim(), name.trim());
        if (result) messages.push(result);
        Utilities.sleep(2000); // 延遲避免限速
    }

    /* -------- 傳送到TG -------- */
    /*
    const todayStr = Utilities.formatDate(new Date(), "Asia/Taipei", "yyyy-MM-dd");
    let finalMessage = "";
    if(messages.length > 0){
      finalMessage = `📅 ${todayStr}\n\n${messages.join('\n\n')}`;  // 多筆合併傳送
    } else {
      finalMessage = `📅 ${todayStr}\n\n😐 無風無浪的一天`;  // 多筆合併傳送
    }
    sendTelegramMessage(finalMessage);
    */

    /* -------- 檢查最後一欄並傳送到TG -------- */
    checkLastRowSignalsAndNotifyTelegram()
}


function fetchStockData(symbol, name) {
    const lookbackDays = 90;
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=${lookbackDays}d`;
    const response = UrlFetchApp.fetch(url);
    const json = JSON.parse(response.getContentText());
    const result = json.chart.result[0];
    if (!result) return;

    const timestamps = result.timestamp;
    const closes = result.indicators.quote[0].close;

    // const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("0050 Monitor");
    // sheet.clearContents();
    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name + " " + symbol);
    if (!sheet) {
        sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(name + " " + symbol);
    } else {
        sheet.clearContents();
    }
    const head = ["日期", "收盤價", "前一日收盤", "BB上緣", "BB下緣", "DIF", "MACD", "MACD(OSC)", "建議動作"];
    sheet.appendRow(head);
    sheet.getRange(sheet.getLastRow(), head.length).setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, head.length).setBackground("#dce6f1");

    for (let i = 26; i < timestamps.length; i++) {
        const date = new Date(timestamps[i] * 1000);
        const closeToday = closes[i];
        const closeYesterday = closes[i - 1];
        const changePercent = ((closeToday - closeYesterday) / closeYesterday * 100).toFixed(2);//漲跌幅(%)

        let action = "";

        /* -------- 判斷 -------- */
        // 昨日收盤
        const closeYest = closes[i - 1];
        if (closeToday == null || closeYesterday == null || isNaN(closeToday) || isNaN(closeYesterday)) {
            continue;
        }

        // 布林通道 (用最近 20 天)
        const bbWindow = closes.slice(i - 19, i + 1);
        const sma = average(bbWindow);//BB中軌
        const stddev = standardDeviation(bbWindow);
        const upper = sma + 2 * stddev;//BB上緣
        const lower = sma - 2 * stddev;//BB下緣
        const bbWindowYest = closes.slice(i - 20, i); // 昨日的 20 天資料
        const smaYest = average(bbWindowYest);//昨日BB中軌
        const stddevYest = standardDeviation(bbWindowYest);
        const upperYest = smaYest + 2 * stddevYest;//昨日BB上緣
        const lowerYest = smaYest - 2 * stddevYest;//昨日BB下緣

        // MACD 和 DIF
        const macdValues = calculateMACDComplete(closes);
        const macdToday = macdValues.dea[i];
        const macdYest = macdValues.dea[i - 1];
        const difToday = macdValues.dif[i];
        const difYest = macdValues.dif[i - 1];
        // const osdToday = difToday - macdToday;
        // const osdYest = difYest - macdYest;
        const osdToday = macdValues.macd[i];
        const osdYest = macdValues.macd[i - 1];

        // 買進條件：昨天碰 BBAND 下緣，今天 MACD 向上收斂（負值減少）
        const isTouchLowerYest = closeYest <= lowerYest;
        const isMacdNegative = osdToday < 0 && osdToday >= osdYest;

        // 賣出條件：昨天碰 BBAND 上緣，今天 MACD 向下轉弱（正值變小）
        const isTouchUpperYest = closeYest >= upperYest;
        const isMacdPositiveDecline = osdToday > 0 && osdToday <= osdYest;

        if (isTouchLowerYest && isMacdNegative) {
            action = "🔥 建議進場";
        } else if (isTouchUpperYest && isMacdPositiveDecline) {
            action = "⚠️ 建議賣出";
        } else {
            action = "無明確訊號";
        }

        /* -------- 寫入 Google Sheet -------- */
        const row = [
            Utilities.formatDate(date, "Asia/Taipei", "yyyy-MM-dd"),
            closeToday.toFixed(2),
            closeYesterday.toFixed(2),
            upper.toFixed(2),
            lower.toFixed(2),
            difToday.toFixed(2),
            macdToday.toFixed(2),
            osdToday.toFixed(2),
            action
        ];

        sheet.appendRow(row);
        sheet.getRange(sheet.getLastRow(), row.length).setHorizontalAlignment('center');

        // 回傳最後一筆當天訊息
        /*
        if (i === timestamps.length - 1) {
          if (action.includes("建議買入") || action.includes("建議賣出")) {
            const message = `${name}${symbol}\n${action}`;
            return message;
          }
        }
        */
    }
}

// EMA 計算
function calculateEMA_SMAStart(prices, period) {
    const ema = new Array(prices.length).fill(NaN);
    let sum = 0;
    const multiplier = 2 / (period + 1);

    // 前 period 天平均作為第一個 EMA
    for (let i = 0; i < period; i++) {
        if (isNaN(prices[i])) return ema; // 防呆
        sum += prices[i];
    }

    ema[period - 1] = sum / period;

    // 從第 period 天起做平滑
    for (let i = period; i < prices.length; i++) {
        if (isNaN(prices[i])) continue;
        ema[i] = (prices[i] - ema[i - 1]) * multiplier + ema[i - 1];
    }

    return ema;
}

// MACD 計算
function calculateMACDComplete(prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
    const emaFast = calculateEMA_SMAStart(prices, fastPeriod);
    const emaSlow = calculateEMA_SMAStart(prices, slowPeriod);

    const dif = prices.map((_, i) => {
        if (isNaN(emaFast[i]) || isNaN(emaSlow[i])) return NaN;
        return emaFast[i] - emaSlow[i];
    });

    const dea = calculateEMA_SMAStart(dif.filter(v => !isNaN(v)), signalPeriod);
    const alignedDea = Array(dif.length - dea.length).fill(NaN).concat(dea);

    const hist = dif.map((d, i) => {
        if (isNaN(d) || isNaN(alignedDea[i])) return NaN;
        return d - alignedDea[i];
    });

    return {
        dif: dif,
        dea: alignedDea,
        macd: hist  // 柱狀圖
    };
}

// 平均
function average(arr) {
    const valid = arr.filter(n => !isNaN(n));
    return valid.reduce((a, b) => a + b, 0) / valid.length;
}

// 標準差
function standardDeviation(arr) {
    const avg = average(arr);
    const squareDiffs = arr.map(value => Math.pow(value - avg, 2));
    return Math.sqrt(average(squareDiffs));
}

/* -------- get last information -------- */
function checkLastRowSignalsAndNotifyTelegram() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = ss.getSheets();
    const messages = [];

    sheets.forEach(sheet => {
        const sheetName = sheet.getName();
        const lastRow = sheet.getLastRow();
        const lastCol = sheet.getLastColumn();
        if (lastRow === 0 || lastCol === 0) return;

        const lastRowValues = sheet.getRange(lastRow, 1, 1, lastCol).getValues()[0];

        let hasBuy = false;
        let hasSell = false;

        lastRowValues.forEach(cell => {
            if (typeof cell === 'string') {
                if (cell.includes('建議進場')) hasBuy = true;
                if (cell.includes('建議賣出')) hasSell = true;
            }
        });

        if (hasBuy || hasSell) {
            let msg = `${sheetName}`;
            if (hasBuy) msg += `\n🔥 建議進場`;
            if (hasSell) msg += `\n⚠️ 建議賣出`;
            messages.push(msg);
        }
    });

    const todayStr = Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd');
    let finalMessage = '';

    if (messages.length > 0) {
        finalMessage = `📅 ${todayStr}\n\n${messages.join('\n\n')}`;
    } else {
        finalMessage = `📅 ${todayStr}\n\n😐 無風無浪的一天`;
    }

    sendTelegramMessage(finalMessage);
}


/* -------- sent to Telegram -------- */
function sendTelegramMessage(message) {

    // 若是星期六（6）或星期日（0），就不發送
    const today = new Date();
    const day = today.getDay();  // Sunday = 0, Monday = 1, ..., Saturday = 6
    if (day === 0 || day === 6) {
        Logger.log("週末不推播");
        return;
    }

    const token = "7597836576:AAEOwH0cUsRU_0z47KJkXpk8ovCXqfYziWs";
    const chatId = "399903454";

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const payload = {
        chat_id: chatId,
        text: message
    };
    const options = {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify(payload)
    };
    const response = UrlFetchApp.fetch(url, options);
    // Logger.log(response.getContentText());
}






