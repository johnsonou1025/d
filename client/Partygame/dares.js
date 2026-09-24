/**
 * Party Dares 全域共用懲罰模組 (dares.js)
 * 提供 5 筆預設處罰、localStorage 存取與隨機抽選功能
 */

const DEFAULT_DARES = [
    "喝一杯特調檸檬汁 / 苦茶或乾一杯飲料 🥤",
    "用屁股寫出自己的名字或熱舞 15 秒 💃",
    "模仿 3 種動物叫聲並配合動作給全場評分 🐶",
    "擺出最誇張鬼臉自拍發限動或留存合照 🤪",
    "深蹲 10 下或公主抱/背著旁邊的人 10 秒 💪"
];

// 趣味靈感詞庫（供設定頁隨機挑選靈感）
const INSPIRATION_DARES = [
    "喝一杯特調檸檬汁 / 苦茶或乾一杯飲料 🥤",
    "用屁股寫出自己的名字或熱舞 15 秒 💃",
    "模仿 3 種動物叫聲並配合動作給全場評分 🐶",
    "擺出最誇張鬼臉自拍發限動或留存合照 🤪",
    "深蹲 10 下或公主抱/背著旁邊的人 10 秒 💪",
    "對著窗外或門外大喊一聲「我是大帥哥/大美女」 📢",
    "現場清唱一首兒歌或告白歌曲副歌 🎤",
    "給右邊的玩家搥背按摩 30 秒 💆",
    "用慢動作喝水並做出極度銷魂的表情 💧",
    "讓贏家在額頭或臉頰用眼線筆畫一個小愛心/鬍子 🎨",
    "壁咚旁邊的一位玩家並深情對視 5 秒不准笑 😳",
    "模仿一位在場朋友的招牌口頭禪與動作 🎭",
    "做 15 下開合跳並大聲數出來 🏃",
    "用娃娃音講完接下來一輪的所有對話 👶",
    "讓現場大家檢查手機相簿最新一張照片 📱"
];

const DARES_STORAGE_KEY = 'party-dares';

/**
 * 取得當前設定的處罰清單（若未設定則自動初始化 5 筆）
 * @returns {string[]}
 */
function getPartyDares() {
    try {
        const stored = localStorage.getItem(DARES_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length === 5 && parsed.every(item => typeof item === 'string' && item.trim().length > 0)) {
                return parsed;
            }
        }
    } catch (e) {
        console.warn("無法讀取自訂處罰，使用預設值", e);
    }
    // 若無儲存或格式不符，寫入預設值
    savePartyDares(DEFAULT_DARES);
    return [...DEFAULT_DARES];
}

/**
 * 儲存 5 筆處罰項目
 * @param {string[]} daresArray 
 */
function savePartyDares(daresArray) {
    if (!Array.isArray(daresArray) || daresArray.length !== 5) {
        throw new Error("處罰項目必須為 5 筆！");
    }
    localStorage.setItem(DARES_STORAGE_KEY, JSON.stringify(daresArray));
}

/**
 * 隨機抽取一筆處罰
 * @returns {string}
 */
function getRandomDare() {
    const list = getPartyDares();
    const index = Math.floor(Math.random() * list.length);
    return list[index];
}
