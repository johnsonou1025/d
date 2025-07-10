/* -------- 執行 -------- */
function run1() {
    // 若是星期六（6）或星期日（0），就不發送
    const today = new Date();
    const day = today.getDay();  // Sunday = 0, Monday = 1, ..., Saturday = 6
    if (day === 0 || day === 6) {
        Logger.log("週末不推播");
        return;
    }
    fetchMultipleStocks(0, 6);
}
function run2() {
    const today = new Date();
    const day = today.getDay();  // Sunday = 0, Monday = 1, ..., Saturday = 6
    if (day === 0 || day === 6) {
        Logger.log("週末不推播");
        return;
    }
    fetchMultipleStocks(7, 12);
}
function run3() {
    const today = new Date();
    const day = today.getDay();  // Sunday = 0, Monday = 1, ..., Saturday = 6
    if (day === 0 || day === 6) {
        Logger.log("週末不推播");
        return;
    }
    fetchMultipleStocks(13, 18);
}
function run4() {
    const today = new Date();
    const day = today.getDay();  // Sunday = 0, Monday = 1, ..., Saturday = 6
    if (day === 0 || day === 6) {
        Logger.log("週末不推播");
        return;
    }
    fetchMultipleStocks(19, 24);
}
function run5() {
    const today = new Date();
    const day = today.getDay();  // Sunday = 0, Monday = 1, ..., Saturday = 6
    if (day === 0 || day === 6) {
        Logger.log("週末不推播");
        return;
    }
    fetchMultipleStocks(25, 30);
}

function run6() {
    const today = new Date();
    const day = today.getDay();  // Sunday = 0, Monday = 1, ..., Saturday = 6
    if (day === 0 || day === 6) {
        Logger.log("週末不推播");
        return;
    }
    fetchMultipleStocks(31, 35);
}

function run7() {
    const today = new Date();
    const day = today.getDay();  // Sunday = 0, Monday = 1, ..., Saturday = 6
    if (day === 0 || day === 6) {
        Logger.log("週末不推播");
        return;
    }
    fetchMultipleStocks(36, 40);
}

function run8() {
    const today = new Date();
    const day = today.getDay();  // Sunday = 0, Monday = 1, ..., Saturday = 6
    if (day === 0 || day === 6) {
        Logger.log("週末不推播");
        return;
    }
    fetchMultipleStocks(41, 45);
}

function run9() {
    const today = new Date();
    const day = today.getDay();  // Sunday = 0, Monday = 1, ..., Saturday = 6
    if (day === 0 || day === 6) {
        Logger.log("週末不推播");
        return;
    }
    fetchMultipleStocks(46, 50);
}

function run10() {
    const today = new Date();
    const day = today.getDay();  // Sunday = 0, Monday = 1, ..., Saturday = 6
    if (day === 0 || day === 6) {
        Logger.log("週末不推播");
        return;
    }
    fetchMultipleStocks(51, 55);
}

function fetchMultipleStocks(startIndex, endIndex) {
    const stockListSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("StockList");
    const stockSymbols = stockListSheet.getRange("A2:B").getValues().filter(row => row[0] && row[1]);

    const today = Utilities.formatDate(new Date(), "Asia/Taipei", "yyyy-MM-dd");
    const messages = [];

    for (let i = startIndex; i <= endIndex && i < stockSymbols.length; i++) {
        const [symbol, name] = stockSymbols[i];
        const sheetName = `${name} ${symbol}`;
        const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

        let shouldFetch = true;//預設今天未處理

        if (sheet) {
            const lastRow = sheet.getLastRow();
            if (lastRow > 0) {
                const lastDate = sheet.getRange(lastRow, 1).getValue();
                const formattedDate = Utilities.formatDate(new Date(lastDate), "Asia/Taipei", "yyyy-MM-dd");

                if (formattedDate === today) {
                    Logger.log(`✅ 今天已處理過：${sheetName}`);
                    shouldFetch = false;//改為今天已處理過
                }
            }
        }

        //今天未處理執行 fetchStockData
        if (shouldFetch) {
            Logger.log(`🚀 執行 ${sheetName}`);
            const result = fetchStockData(symbol.trim(), name.trim());
            if (result) messages.push(result);
            Utilities.sleep(1000 * 2); // 可視需求減少
        }
    }
}


/* -------- 條件判斷主程式 -------- */
function fetchStockData(symbol, name) {
    const lookbackDays = 100;
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=${lookbackDays}d`;
    const response = UrlFetchApp.fetch(url);
    const json = JSON.parse(response.getContentText());
    const result = json.chart.result[0];
    if (!result) return;

    const timestamps = result.timestamp;
    const closes = result.indicators.quote[0].close;

    let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name + " " + symbol);
    if (!sheet) {
        sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(name + " " + symbol);
    } else {
        sheet.clearContents();
    }
    const head = ["日期", "收盤價", "前一日收盤", "BB上緣", "BB下緣", "DIF", "MACD", "MACD(OSC)", "建議動作"];
    sheet.appendRow(head);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, head.length).setBackground("#a3afc9").setFontColor("#ffffff").setHorizontalAlignment("right");
    sheet.getRange(1, head.length, 1, head.length).setHorizontalAlignment('center');

    for (let i = 26; i < timestamps.length; i++) {
        const date = new Date(timestamps[i] * 1000);
        const closeToday = closes[i];
        const closeYesterday = closes[i - 1];
        const changePercent = ((closeToday - closeYesterday) / closeYesterday * 100).toFixed(2);//漲跌幅(%)

        let action = "";

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

        //寫入 Google Sheet
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
        const lastRow = sheet.getLastRow(); // 新增的那一行
        const rowRange = sheet.getRange(lastRow, 1, 1, row.length); // 正確範圍：第 lastRow 列，從第 1 欄開始，寬度 row.length

        // 最後一欄置中
        sheet.getRange(lastRow, row.length).setHorizontalAlignment('center');

        if (lastRow % 2 === 1) {
            rowRange.setBackground('#f4f6f8'); // 偶數改成 === 0 即可反過來
        }
    }
}

/* -------- EMA 計算 -------- */
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

/* -------- MACD 計算 -------- */
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

/* -------- 平均 -------- */
function average(arr) {
    const valid = arr.filter(n => !isNaN(n));
    return valid.reduce((a, b) => a + b, 0) / valid.length;
}

/* -------- 標準差 -------- */
function standardDeviation(arr) {
    const avg = average(arr);
    const squareDiffs = arr.map(value => Math.pow(value - avg, 2));
    return Math.sqrt(average(squareDiffs));
}

/* -------- 檢查最後一欄並傳送到Telegram -------- */
function checkLastRowSignalsAndNotifyTelegram() {

    // 若是星期六（6）或星期日（0），就不發送
    const today = new Date();
    const day = today.getDay();  // Sunday = 0, Monday = 1, ..., Saturday = 6
    if (day === 0 || day === 6) {
        Logger.log("週末不推播");
        return;
    }

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

/* -------- 檢查最後一欄並傳送到Line -------- */
function checkLastRowSignalsAndNotifyLine() {

    // 若是星期六（6）或星期日（0），就不發送
    const today = new Date();
    const day = today.getDay();  // Sunday = 0, Monday = 1, ..., Saturday = 6
    if (day === 0 || day === 6) {
        Logger.log("週末不推播");
        return;
    }

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

    sendLineMessage(finalMessage);
}


/* -------- sent to Telegram -------- */
function sendTelegramMessage(message) {
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

/* -------- Linebot -------- */
/*
function doPost(e) {
  var json = JSON.parse(e.postData.contents);
  var event = json.events[0];
 
      var groupId = event.source.groupId;
      var roomId = event.source.roomId;
      var replyToken = event.replyToken;
      var text = event.message.text;
 
      userMessageArray = text.split(/\s/);
 
      if(userMessageArray.indexOf("groupId") >= 0){
        Logger.log(groupId);
        console.log(groupId);
        userMessage = `ID:${groupId}`;
        replyLineMessage(replyToken,userMessage);
      } else if(userMessageArray.indexOf("token") >= 0){
        Logger.log(replyToken);
        console.log(replyToken);
        userMessage = `Token:${replyToken}`;
        replyLineMessage(replyToken,userMessage);
      } else if(userMessageArray.indexOf("roomId") >= 0){
        Logger.log(roomId);
        console.log(roomId);
        userMessage = `RoomId:${roomId}`;
        replyLineMessage(replyToken,userMessage);
      }
}
 
function replyLineMessage(replyToken,userMessage){
  //執行reply行為
  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + '1LHRoZn+/LbROB0O7CYy24Eau3x+gEv9WVUXzhwfVT9lMWN47+oZVjWhQhDOo17dbJJ6unvUX+yfI7d15JjLdkkl5T2Sw5XpEPlA7x9VIw+krV5B9/kr+52daAbeZD/YHV1FWRCuM9hgAPJ745KESAdB04t89/1O/w1cDnyilFU=',
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': [{
        'type': 'text',
        'text': userMessage,
      }],
    }),
  });
}
*/


function sendLineMessage(userMessage) {
    //執行reply行為
    UrlFetchApp.fetch("https://api.line.me/v2/bot/message/push", {
        'headers': {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + '1LHRoZn+/LbROB0O7CYy24Eau3x+gEv9WVUXzhwfVT9lMWN47+oZVjWhQhDOo17dbJJ6unvUX+yfI7d15JjLdkkl5T2Sw5XpEPlA7x9VIw+krV5B9/kr+52daAbeZD/YHV1FWRCuM9hgAPJ745KESAdB04t89/1O/w1cDnyilFU=',
        },
        'method': 'post',
        //'muteHttpExceptions' : true,
        'payload': JSON.stringify({
            // 'to': 'U5720921a03894f552323e6796793eec5',
            'to': 'C943643e02ec9513cd0cf16810ee1d117',//發大財群
            'messages': [{
                'type': 'text',
                'text': userMessage,
            }],
        }),
    });
}







