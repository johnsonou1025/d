// js/levels/2-5.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["2-5"] = {
    id: "2-5",
    unitName: "二年級：九九乘法",
    levelName: "3・6・7・9 倍數",
    type: "multiplication_concept", // 使用此類型以啟用 main.js 中的金幣群組渲染
    multipliers: [3, 6, 7, 9],
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            // 隨機選擇乘數 (3, 6, 7, 9)
            const a = this.multipliers[randInt(0, this.multipliers.length - 1)];
            // 隨機 1~9 倍
            const b = randInt(1, 9);
            const correct = a * b;

            // --- 題目隨機：三種題型切換 ---
            const mode = randInt(0, 2);
            let promptText = "";
            if (mode === 0) {
                promptText = `${a} × ${b} = ？`;
            } else if (mode === 1) {
                promptText = `${b} × ${a} = ？`; // 測試交換律
            } else {
                promptText = `${a} 的 ${b} 倍是多少？`; // 文字應用感
            }

            // --- 答案隨機：生成具干擾性的錯誤選項 ---
            const optionSet = new Set([correct]);
            while (optionSet.size < 4) {
                const distractors = [
                    a + b,                  // 誤用加法 (常見錯誤)
                    a * (b + 1),            // 多算一組
                    a * (b - 1),            // 少算一組
                    correct + randInt(-3, 3) // 鄰近數字
                ];
                const cand = distractors[randInt(0, distractors.length - 1)];

                // 確保選項大於 0 且不重複
                if (cand > 0 && cand !== correct) {
                    optionSet.add(cand);
                }
            }

            // 隨機洗牌選項
            const finalOptions = shuffle(Array.from(optionSet)).map(String);

            list.push({
                type: "choice",
                prompt: promptText,
                // 視覺化：提供每組個數與群數，讓 main.js 渲染金幣
                visualGroups: { each: a, groups: b },
                options: finalOptions,
                correctIndex: finalOptions.indexOf(String(correct))
            });
        }
        return list;
    }
};