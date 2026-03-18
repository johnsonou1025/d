// js/levels/2-4.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["2-4"] = {
    id: "2-4",
    unitName: "二年級：九九乘法",
    levelName: "2・4・5・8 倍數",
    type: "multiplication_concept", // 建議沿用此類型，以共用 2-3 關的群組渲染邏輯
    multipliers: [2, 4, 5, 8],
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            // 隨機從 2, 4, 5, 8 中選一個乘數
            const a = this.multipliers[randInt(0, this.multipliers.length - 1)];
            // 隨機 1~9
            const b = randInt(1, 9);
            const correct = a * b;

            // 隨機題型切換
            const mode = randInt(0, 2);
            let promptText = "";
            if (mode === 0) {
                promptText = `${a} × ${b} = ？`;
            } else if (mode === 1) {
                promptText = `${b} × ${a} = ？`;
            } else {
                promptText = `${a} 的 ${b} 倍是多少？`;
            }

            // 產生隨機且具干擾性的錯誤選項
            const optionSet = new Set([correct]);
            while (optionSet.size < 4) {
                const distractors = [
                    a + b,                 // 誤用加法 (例如 4+5=9)
                    a * (b + 1),           // 多一個倍數
                    a * (b - 1),           // 少一個倍數
                    correct + randInt(-2, 2) // 鄰近數字
                ];
                const cand = distractors[randInt(0, distractors.length - 1)];
                // 確保選項大於 0 且不重複
                if (cand > 0 && cand !== correct) optionSet.add(cand);
            }

            // 答案洗牌
            const finalOptions = shuffle(Array.from(optionSet)).map(String);

            list.push({
                type: "choice",
                prompt: promptText,
                // 提供給 main.js 畫圖用的資料 (每組 a 個，共 b 組)
                visualGroups: { each: a, groups: b },
                options: finalOptions,
                correctIndex: finalOptions.indexOf(String(correct))
            });
        }
        return list;
    }
};