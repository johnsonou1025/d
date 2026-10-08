/**
 * ==============================================================================
 * 🌐 全自動多策略綜合數據接口 (純後端 JSON API - 精簡高效完全體)
 * 核心功能：接收前端請求 ⮕ 跨檔案安全抽取 4 大精華數據矩陣 ⮕ 吐出純淨標準 JSON
 * ==============================================================================
 */

// 💡 跨檔案量化數據庫核心 ID 定義
const ID_LOW = '13NuUCCaCVUQuSev2meYUzqyoUAPmZ2KcWEA9rM_yt7M'; // 🟢 策略一：低點布局檔案 ID
const ID_STRONG = '1JncoKWo5BFtsacuZXq33r-LAnFARFL_Ee697ie4IHfU'; // 🔴 策略二：高點強勢檔案 ID
const ID_TAIEX = '1g-HaVaKjQLVz8ZwWi8T_V_v3BhBmdt4ROkbL_PLEGI8'; // 🔵 策略三：大盤多空監測檔案 ID

/**
 * 🏆 主接收接口：回傳標準 MIME 類型之 JSON 數據
 */
function doGet(e) {
    try {
        // 跨檔案安全調閱四大精華數據矩陣
        const marketStatus = readLatestMarketRegime(); // 1. 大盤當日最新多空大腦數據
        const todayHoldings = readTodayHoldings();     // 2. 當前持股
        const dailyTrades = readDailyTrades();       // 3. 進出場歷史記錄
        const strongSectors = readStrongSectors();     // 4. 強勢類股排行榜 (👈 核心動能全權由它主導)

        // 將所有資產型態、大盤多空、與強勢類股打包成標準 JSON 格式
        return ContentService
            .createTextOutput(JSON.stringify({
                ok: true,
                marketStatus: marketStatus,     // 網頁端用 data.marketStatus 讀取最新大盤體檢
                todayHoldings: todayHoldings,
                dailyTrades: dailyTrades,
                strongSectors: strongSectors,   // 網頁端用 data.strongSectors 讀取強勢板塊
                timestamp: new Date().toISOString()
            }))
            .setMimeType(ContentService.MimeType.JSON); // 確保前端精準識別，免除純文字二次轉換

    } catch (err) {
        // 異常防線：若後台崩潰，老實向前端回報錯誤訊息
        return ContentService
            .createTextOutput(JSON.stringify({
                ok: false,
                message: "🚨 API 後台發生嚴重崩潰: " + String(err)
            }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

/**
 * 📦 讀取 MarketRegime 歷史總表之「最新一日」大盤數據
 */
function readLatestMarketRegime() {
    try {
        const ss = SpreadsheetApp.openById(ID_TAIEX);
        const sheet = ss.getSheetByName("MarketRegime");
        if (!sheet) return null;

        const lastRow = sheet.getLastRow();
        if (lastRow < 2) return null;

        // 依照 9 大獨立欄位規格，精確抽離最後一行的最新大盤數值
        const latestRowValues = sheet.getRange(lastRow, 1, 1, 9).getDisplayValues()[0];

        return {
            date: latestRowValues[0],          // A: 體檢日期
            closePrice: latestRowValues[1],    // B: 加權收盤價
            high20D: latestMetricsOrBlank(latestRowValues[2]), // C: 近20日最高點
            low20D: latestMetricsOrBlank(latestRowValues[3]),  // D: 近20日最低點
            maStatus: latestRowValues[4],      // E: 指標 1: 均線位階
            biasStatus: latestRowValues[5],    // F: 指標 2: 短線乖離
            macdStatus: latestRowValues[6],    // G: 指標 3: MACD動能
            bbTrendStatus: latestRowValues[7], // H: 指標 4: 中軌趨勢
            finalVerdict: latestRowValues[8]   // I: 綜合多空研判結論
        };
    } catch (e) {
        return null;
    }
}

// 輔助防線：防止初始建表高低點過渡期在 API 吐出 0.00 計算噪音
function latestMetricsOrBlank(val) {
    return (val === "0.00" || val === "0" || !val) ? "精算累積中" : val;
}

/**
 * 📦 1. 讀取低點布局 - TodayHoldings 工作表
 */
function readTodayHoldings() {
    try {
        const ss = SpreadsheetApp.openById(ID_LOW);
        const sheet = ss.getSheetByName("TodayHoldings");
        if (!sheet || sheet.getLastRow() < 2) return [];

        const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getDisplayValues();
        return data.filter(row => row[0].trim() !== "").map(row => ({
            stockInfo: row[0],
            avgPrice: row[1],
            quantity: row[2],
            marketPrice: row[3],
            roi: row[4],
            entryDate: row[5]
        }));
    } catch (e) { return []; }
}

/**
 * 📦 2. 讀取低點布局 - DailyTrades 工作表
 */
function readDailyTrades() {
    try {
        const ss = SpreadsheetApp.openById(ID_LOW);
        const sheet = ss.getSheetByName("DailyTrades");
        if (!sheet || sheet.getLastRow() < 2) return [];

        const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 9).getDisplayValues();
        let results = [];
        for (let i = data.length - 1; i >= 0; i--) {
            if (data[i][0].trim() !== "") {
                results.push({
                    date: data[i][0],
                    name: data[i][1],
                    price: data[i][2],
                    shares: data[i][3],
                    pnlOrCost: data[i][4],
                    roi: data[i][5],
                    action: data[i][6],
                    reason: data[i][7],
                    entryDate: data[i][8]
                });
            }
        }
        return results;
    } catch (e) { return []; }
}

/**
 * 📦 3. 讀取高點強勢 - DailyStrongMomentum (強勢股實體時間對齊版)
 * 核心功能：直接與台北當天日期比對 ⮕ 有今天數據才打包 ⮕ 倒讀至昨日舊資料自動熔斷煞車
 */
function readStrongSectors() {
    try {
        const ss = SpreadsheetApp.openById(ID_STRONG);
        const sheet = ss.getSheetByName("DailyStrongMomentum");
        if (!sheet || sheet.getLastRow() < 2) return [];

        // 1. 讀取渲染後的純文字矩陣，維持網頁端顯示格式的絕對乾淨
        const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 3).getDisplayValues();
        let results = [];

        // 💡 核心修正：直接鎖定今天台北當下的實體日期字串作為網頁 API 的唯一對齊基準
        const targetDateStr = Utilities.formatDate(new Date(), "Asia/Taipei", "yyyy-MM-dd");
        Logger.log("🔎 網頁端進場 API 實體對齊基準日期為: " + targetDateStr);

        // 2. 完美倒讀防線：從最後一行往上掃描，只打包符合今天日期的資料
        for (let i = data.length - 1; i >= 0; i--) {
            const rowDate = data[i][0].trim();
            if (!rowDate) continue;

            if (rowDate === targetDateStr) {
                // 只有日期剛好等於今天的股票，才允許被推入網頁結果
                results.push({
                    date: data[i][0],         // A 欄：日期
                    sectorName: data[i][1],   // B 欄：股票名稱與代碼 (原變數名保留不影響 HTML)
                    strengthScore: data[i][2] // C 欄：收盤進場價格 (原變數名保留不影響 HTML)
                });
            } else if (rowDate < targetDateStr) {
                // 💡 熔斷安全煞車：一旦倒讀看到的日期小於今天，代表今天沒股票（或今天的已經讀完），立刻跳出迴圈，拒絕打包昨日舊資料！
                break;
            }
        }

        // 3. 倒讀回來的資料需要再反轉一次，使其順序跟試算表從上到下的順序完全勾稽
        results.reverse();

        Logger.log(`✅ 網頁 API 讀取完畢，今日共有 ${results.length} 檔強勢股傳送至前端。`);
        return results;

    } catch (e) {
        Logger.log("❌ 網頁強勢股 API 發生異常: " + e.message);
        return [];
    }
}


