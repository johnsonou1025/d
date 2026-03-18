// js/levels/4-5.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["4-5"] = {
    id: "4-5",
    unitName: "四年級：三角形",
    levelName: "三角形分類與性質",
    type: "triangle_types",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3); // 1: 邊長性質, 2: 角度性質, 3: 內角與組合邏輯
            let prompt = "";
            let correctStr = "";
            let optionSet = new Set();

            if (mode === 1) {
                // 【模式 1】根據「邊長」分類
                const sub = randInt(1, 2);
                if (sub === 1) {
                    prompt = "一個三角形中，如果有「兩個邊一樣長」，我們叫它？";
                    correctStr = "等腰三角形";
                } else {
                    prompt = "一個三角形中，「三個邊都一樣長」，我們叫它？";
                    correctStr = "正三角形 (等邊三角形)";
                }
                ["等腰三角形", "正三角形 (等邊三角形)", "直角三角形", "不等邊三角形"].forEach(o => optionSet.add(o));

            } else if (mode === 2) {
                // 【模式 2】根據「角度」分類
                const sub = randInt(1, 3);
                if (sub === 1) {
                    prompt = "三角形的三個角都小於 90°（都是銳角），稱為？";
                    correctStr = "銳角三角形";
                } else if (sub === 2) {
                    prompt = "三角形中有一個角剛好是 90°（直角），稱為？";
                    correctStr = "直角三角形";
                } else {
                    prompt = "三角形中有一個角大於 90°（鈍角），稱為？";
                    correctStr = "鈍角三角形";
                }
                ["銳角三角形", "直角三角形", "鈍角三角形", "等腰三角形"].forEach(o => optionSet.add(o));

            } else {
                // 【模式 3】內角性質與邏輯判斷
                const sub = randInt(1, 3);
                if (sub === 1) {
                    prompt = "任意一個三角形的三個內角加起來，總共是多少度？";
                    correctStr = "180 度";
                    ["90 度", "180 度", "270 度", "360 度"].forEach(o => optionSet.add(o));
                } else if (sub === 2) {
                    prompt = "關於「正三角形」，哪一個敘述是「錯誤」的？";
                    correctStr = "一定有一個角是直角";
                    optionSet.add(correctStr);
                    optionSet.add("三個邊一樣長");
                    optionSet.add("三個角都是 60 度");
                    optionSet.add("它也是一種等腰三角形");
                } else {
                    prompt = "一個三角形「最多」可以有幾個鈍角？";
                    correctStr = "1 個";
                    optionSet.add("1 個");
                    optionSet.add("2 個");
                    optionSet.add("3 個");
                    optionSet.add("沒有限制");
                }
            }

            // --- 確保包含正確答案並洗牌 ---
            optionSet.add(correctStr);
            let finalOptions = Array.from(optionSet);

            // 隨機刪除多餘選項直到剩下 4 個
            while (finalOptions.length > 4) {
                const idx = randInt(0, finalOptions.length - 1);
                if (finalOptions[idx] !== correctStr) finalOptions.splice(idx, 1);
            }

            finalOptions = shuffle(finalOptions);

            list.push({
                type: "choice",
                prompt: prompt,
                options: finalOptions,
                correctIndex: finalOptions.indexOf(correctStr)
            });
        }
        return list;
    }
};