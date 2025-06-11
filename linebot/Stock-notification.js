function fetchTSMCData() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var stockSymbol = "2330.TW";  // 台積電的股票代码
    // 設定查詢時間區間：過去 30 天
    var endDate = new Date();  // 今天
    var startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);  // 30 天前

    // 构建API请求URL
    var apiUrl = "https://query1.finance.yahoo.com/v7/finance/chart/" + stockSymbol +
        "?period1=" + Math.floor(startDate.getTime() / 1000) +
        "&period2=" + Math.floor(endDate.getTime() / 1000) +
        "&interval=1d";

    // 使用 UrlFetchApp 執行 HTTP 請求
    var response = UrlFetchApp.fetch(apiUrl);
    var data = JSON.parse(response.getContentText());

    // 获取时间和价格数据
    var timestamps = data.chart.result[0].timestamp;
    var prices = data.chart.result[0].indicators.quote[0].close;

    // 写入 Google Sheets
    sheet.clear();  // 清空现有数据
    sheet.getRange(1, 1, timestamps.length, 2).setValues(timestamps.map(function (timestamp, index) {
        return [new Date(timestamp * 1000), prices[index]];
    }));
}

function fetch0050Data() {
    const url = "https://query1.finance.yahoo.com/v8/finance/chart/0050.TW?interval=1d&range=30d";
    const response = UrlFetchApp.fetch(url);
    const json = JSON.parse(response.getContentText());

    const result = json.chart.result[0];
    const timestamps = result.timestamp;
    const closes = result.indicators.quote[0].close;
    const rsiValues = calculateRSI(closes, 14);

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("0050 Monitor");
    sheet.clearContents();
    sheet.appendRow(["日期", "收盤價", "前一日收盤", "漲跌幅(%)", "RSI(14)", "建議動作"]);


    for (let i = 14; i < timestamps.length; i++) {
        const date = new Date(timestamps[i] * 1000);
        const closeToday = closes[i];
        const closeYesterday = closes[i - 1];
        const changePercent = ((closeToday - closeYesterday) / closeYesterday * 100).toFixed(2);
        const rsi = rsiValues[i];

        let action = "";
        // 條件
        if (changePercent <= -0.5 && rsi < 50) {
            action = "✅ 可考慮買入";
        }
        if (rsi >= 70) {
            action = "⚠️ 可考慮賣出";
        }

        sheet.appendRow([
            Utilities.formatDate(date, "Asia/Taipei", "yyyy-MM-dd"),
            closeToday.toFixed(2),
            closeYesterday.toFixed(2),
            changePercent + "%",
            rsi.toFixed(2),
            action
        ]);
    }
}

// RSI 計算函數
function calculateRSI(closes, period) {
    let gains = [];
    let losses = [];
    let rsiArray = [];

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

// 平均值計算
function average(arr) {
    const valid = arr.filter(n => !isNaN(n));
    return valid.reduce((a, b) => a + b, 0) / valid.length;
}

// 傳訊息到Linebot
function doLinebotReply(userMessage) {
    //執行reply行為
    UrlFetchApp.fetch("https://api.line.me/v2/bot/message/push", {
        'headers': {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + '1LHRoZn+/LbROB0O7CYy24Eau3x+gEv9WVUXzhwfVT9lMWN47+oZVjWhQhDOo17dbJJ6unvUX+yfI7d15JjLdkkl5T2Sw5XpEPlA7x9VIw+krV5B9/kr+52daAbeZD/YHV1FWRCuM9hgAPJ745KESAdB04t89/1O/w1cDnyilFU=',
        },
        'method': 'post',
        //'muteHttpExceptions' : true,
        'payload': JSON.stringify({
            'to': 'U5720921a03894f552323e6796793eec5',
            'messages': [{
                'type': 'text',
                'text': userMessage,
            }],
        }),
    });
    // UrlFetchApp.fetch 結束 
}


// 傳訊息到Linebot
function doLinebotReply(userMessage) {
    //執行reply行為
    UrlFetchApp.fetch("https://api.line.me/v2/bot/message/push", {
        'headers': {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + '1LHRoZn+/LbROB0O7CYy24Eau3x+gEv9WVUXzhwfVT9lMWN47+oZVjWhQhDOo17dbJJ6unvUX+yfI7d15JjLdkkl5T2Sw5XpEPlA7x9VIw+krV5B9/kr+52daAbeZD/YHV1FWRCuM9hgAPJ745KESAdB04t89/1O/w1cDnyilFU=',
        },
        'method': 'post',
        //'muteHttpExceptions' : true,
        'payload': JSON.stringify({
            'to': 'U5720921a03894f552323e6796793eec5',
            'messages': [{
                'type': 'text',
                'text': userMessage,
            }],
        }),
    });
    // UrlFetchApp.fetch 結束 
}



