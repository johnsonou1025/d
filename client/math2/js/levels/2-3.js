// js/levels/2-3.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["2-3"] = {
    id: "2-3",
    unitName: "二年級：乘法概念",
    levelName: "連加轉乘法",
    type: "multiplication_concept",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            const count = randInt(2, 5);  // 倍數 (幾組)
            const base = randInt(2, 9);   // 被乘數 (每組幾個)
            const correct = count * base;

            // 產生隨機題型
            const mode = randInt(0, 2);
            let promptText = "";

            if (mode === 0) {
                // 題型一：純連加算式 (例如 3 + 3 + 3 + 3)
                promptText = Array(count).fill(base).join(" + ") + " = ？";
            } else if (mode === 1) {
                // 題型二：乘法算式 (例如 3 × 4)
                promptText = `${base} × ${count} = ？`;
            } else {
                // 題型三：文字描述
                promptText = `有 ${count} 個 ${base} ，全部是多少？`;
            }

            // 隨機生成錯誤選項
            const optionSet = new Set([correct]);
            while (optionSet.size < 4) {
                // 容易混淆的錯誤：相加而非相乘、差 1 的倍數等
                const distractors = [
                    base + count,               // 加法錯誤
                    (count + 1) * base,         // 多算一組
                    (count - 1) * base,         // 少算一組
                    correct + randInt(-3, 3)    // 隨機偏移
                ];
                const cand = distractors[randInt(0, distractors.length - 1)];
                if (cand > 0 && cand !== correct) optionSet.add(cand);
            }

            const finalOptions = shuffle(Array.from(optionSet)).map(String);

            list.push({
                type: "choice",
                prompt: promptText,
                // 傳入視覺化資料：base 為每群個數，count 為群數
                visualGroups: { each: base, groups: count },
                options: finalOptions,
                correctIndex: finalOptions.indexOf(String(correct))
            });
        }
        return list;
    }
};