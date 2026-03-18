// js/levels/4-10.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["4-10"] = {
    id: "4-10",
    unitName: "四年級：統計圖表",
    levelName: "長條圖與折線圖判讀",
    type: "charts_reading",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3); // 1: 長條圖觀念, 2: 折線圖觀念, 3: 情境應用判斷
            let prompt = "";
            let correctStr = "";
            let optionSet = new Set();

            if (mode === 1) {
                // 【模式 1】長條圖核心觀念
                const subMode = randInt(1, 2);
                if (subMode === 1) {
                    prompt = "在長條圖中，長條的「高度」主要代表什麼意義？";
                    correctStr = "各個類別的數量大小";
                } else {
                    prompt = "想要「比較」全班同學最喜歡的水果人數，使用哪種統計圖最適合？";
                    correctStr = "長條圖";
                }
                optionSet.add("長條圖");
                optionSet.add("折線圖");
                optionSet.add("圓餅圖");
                optionSet.add("各個類別的數量大小");
                optionSet.add("資料變化的趨勢");

            } else if (mode === 2) {
                // 【模式 2】折線圖核心觀念
                const subMode = randInt(1, 2);
                if (subMode === 1) {
                    prompt = "折線圖中的線段「往上爬」，代表數值正在如何變化？";
                    correctStr = "逐漸增加";
                } else {
                    prompt = "折線圖最主要的功用是觀察資料的什麼？";
                    correctStr = "隨時間變化的趨勢";
                }
                optionSet.add("逐漸增加");
                optionSet.add("逐漸減少");
                optionSet.add("保持不變");
                optionSet.add("隨時間變化的趨勢");
                optionSet.add("各別數量的總和");

            } else {
                // 【模式 3】情境應用題
                const scenarios = [
                    { q: "紀錄一整天「氣溫」的上升與下降，應該用哪種圖？", a: "折線圖" },
                    { q: "統計校慶運動會各年級得到的「獎牌總數」，應該用哪種圖？", a: "長條圖" },
                    { q: "觀察一個月內自己的「體重變化」，應該用哪種圖？", a: "折線圖" },
                    { q: "比較書局裡各種文具的「庫存數量」，應該用哪種圖？", a: "長條圖" }
                ];
                const selected = scenarios[randInt(0, scenarios.length - 1)];
                prompt = selected.q;
                correctStr = selected.a;
                optionSet.add("長條圖");
                optionSet.add("折線圖");
                optionSet.add("示意圖");
                optionSet.add("地圖");
            }

            // --- 清理選項：確保只有 4 個且包含正確答案 ---
            if (!optionSet.has(correctStr)) optionSet.add(correctStr);
            let finalOptionsArray = Array.from(optionSet);

            // 如果選項太多，隨機刪除除了正確答案以外的
            while (finalOptionsArray.length > 4) {
                const removeIdx = randInt(0, finalOptionsArray.length - 1);
                if (finalOptionsArray[removeIdx] !== correctStr) {
                    finalOptionsArray.splice(removeIdx, 1);
                }
            }

            // 隨機洗牌
            finalOptionsArray = shuffle(finalOptionsArray);

            list.push({
                type: "choice",
                prompt: prompt,
                options: finalOptionsArray,
                correctIndex: finalOptionsArray.indexOf(correctStr)
            });
        }
        return list;
    }
};