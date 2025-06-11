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
        if (changePercent <= -0.5 && rsi < 50) {
            action = "✅ 可考慮買入";
        }
        if (rsi >= 70) {
            action = "⚠️ 可考慮賣出";
        }

        // ➕ 寫入每一筆資料到 Sheet
        sheet.appendRow([
            Utilities.formatDate(date, "Asia/Taipei", "yyyy-MM-dd"),
            closeToday.toFixed(2),
            closeYesterday.toFixed(2),
            changePercent + "%",
            rsi.toFixed(2),
            action
        ]);

        // 🟩 只對「最後一筆」發出 Line 通知
        if (i === timestamps.length - 1) {
            const message = `${Utilities.formatDate(date, "Asia/Taipei", "yyyy-MM-dd")}\n0050\n${action || "空手"}`;
            // sendToLineBot(message);
            return message;
        }
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

//line機械人主結構
function doPost(e) {
    var CHANNEL_ACCESS_TOKEN = '1LHRoZn+/LbROB0O7CYy24Eau3x+gEv9WVUXzhwfVT9lMWN47+oZVjWhQhDOo17dbJJ6unvUX+yfI7d15JjLdkkl5T2Sw5XpEPlA7x9VIw+krV5B9/kr+52daAbeZD/YHV1FWRCuM9hgAPJ745KESAdB04t89/1O/w1cDnyilFU=';
    var message = new Array();

    /*--取得對話訊息--*/
    var msg = JSON.parse(e.postData.contents);

    // 取出 replayToken 和發送的訊息文字
    var replyToken = msg.events[0].replyToken;
    var userMessage = msg.events[0].message.text;
    var groupId = msg.events[0].source;
    //將訊息存成陣列（指令 關鍵字 內容）
    var userMessageArray = new Array();
    var rangeName, rangeType, rangeContent;
    if (userMessage == undefined) {
        userMessage = "";
    } else {
        userMessageArray = userMessage.split(/\s/);
    }

    if (userMessageArray.indexOf("歐巴滾") >= 0) {
        if (typeof msg.events[0].source.roomId === 'undefined') {
            UrlFetchApp.fetch("https://api.line.me/v2/bot/group/" + msg.events[0].source.groupId + "/leave", {
                'headers': {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
                },
                'method': 'post',
            });
        } else {
            UrlFetchApp.fetch("https://api.line.me/v2/bot/room/" + msg.events[0].source.roomId + "/leave", {
                'headers': {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
                },
                'method': 'post',
            });
        }
    } else if (userMessageArray.indexOf("/stocks") >= 0) {
        userMessage = "請稍等";
        sendToLineBot(userMessage);

        var ans = fetch0050Data();
        sendToLineBot(ans)
    }
}

function test() {
    var ans = fetch0050Data();
    sendToLineBot(ans)
}

// 傳訊息到Linebot
function sendToLineBot(userMessage) {
    //執行reply行為 
    UrlFetchApp.fetch("https://api.line.me/v2/bot/message/push", {
        // UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", {
        'headers': {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + '1LHRoZn+/LbROB0O7CYy24Eau3x+gEv9WVUXzhwfVT9lMWN47+oZVjWhQhDOo17dbJJ6unvUX+yfI7d15JjLdkkl5T2Sw5XpEPlA7x9VIw+krV5B9/kr+52daAbeZD/YHV1FWRCuM9hgAPJ745KESAdB04t89/1O/w1cDnyilFU=',
        },
        'method': 'post',
        'payload': JSON.stringify({
            'to': 'U5720921a03894f552323e6796793eec5',
            // 'replyToken': replyToken,
            // 'replyToken': 'U5720921a03894f552323e6796793eec5',
            'messages': [{
                'type': 'text',
                'text': userMessage,
            }],
        }),
    });
    // UrlFetchApp.fetch 結束 
}



