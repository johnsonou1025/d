// js/levels/4-2.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["4-2"] = {
    id: "4-2",
    unitName: "四年級：進階乘法",
    levelName: "三位數 × 二位數",
    type: "three_by_two_mult",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const a = randInt(101, 999); // 三位數
            const b = randInt(11, 99);  // 二位數
            const correct = a * b;

            const optionSet = new Set();
            optionSet.add(String(correct));

            // --- 智慧干擾項設計 ---
            // 1. 位值對齊錯誤：忘了在第二層乘法補 0 (例如 a * (b的十位) 忘了補0)
            const bTens = Math.floor(b / 10);
            const bOnes = b % 10;
            const alignError = (a * bOnes) + (a * bTens);
            if (alignError !== correct && alignError > 0) {
                optionSet.add(String(alignError));
            }

            // 2. 乘法進位錯誤：模擬末尾數字正確但百/千位算錯
            const shiftError = correct + (Math.random() < 0.5 ? 100 : 1000);
            optionSet.add(String(shiftError));

            // 3. 鄰近數字干擾 (模擬計算粗心)
            while (optionSet.size < 4) {
                const offset = [10, -10, 100, -100, 5, -5][randInt(0, 5)];
                const cand = correct + offset;
                if (cand > 0 && cand !== correct) {
                    optionSet.add(String(cand));
                }
            }

            const finalOptions = shuffle(Array.from(optionSet));

            list.push({
                type: "choice",
                prompt: `${a} × ${b} = ？`,
                options: finalOptions,
                correctIndex: finalOptions.indexOf(String(correct))
            });
        }
        return list;
    }
};