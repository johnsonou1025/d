// js/levels/4-1.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["4-1"] = {
    id: "4-1",
    unitName: "四年級：運算規則",
    levelName: "四則運算順序",
    type: "order_of_operations",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3);
            let prompt = "";
            let correct = 0;
            let step1_result = 0; // 用於生成干擾項

            if (mode === 1) {
                // 【模式 1】先乘除後加減 (A + B × C)
                const a = randInt(5, 30);
                const b = randInt(2, 9);
                const c = randInt(3, 9);
                const isAdd = Math.random() < 0.5;

                if (isAdd) {
                    prompt = `${a} + ${b} × ${c} = ？`;
                    correct = a + (b * c);
                    step1_result = (a + b) * c; // 錯誤：由左往右算
                } else {
                    const biggerA = Math.max(a, b * c + 5);
                    prompt = `${biggerA} - ${b} × ${c} = ？`;
                    correct = biggerA - (b * c);
                    step1_result = (biggerA - b) * c; // 錯誤：由左往右算
                }

            } else if (mode === 2) {
                // 【模式 2】有括號優先 ( (A + B) × C )
                const a = randInt(2, 10);
                const b = randInt(2, 10);
                const c = randInt(2, 5);
                prompt = `(${a} + ${b}) × ${c} = ？`;
                correct = (a + b) * c;
                step1_result = a + (b * c); // 錯誤：忘了先算括號

            } else {
                // 【模式 3】三步驟混合 (A × B - C ÷ D)
                // 確保能整除
                const d = randInt(2, 5);
                const c = d * randInt(1, 6);
                const a = randInt(5, 10);
                const b = randInt(3, 6);

                prompt = `${a} × ${b} - ${c} ÷ ${d} = ？`;
                correct = (a * b) - (c / d);
                step1_result = (a * b - c) / d; // 錯誤：由左往右無視順序
            }

            // --- 答案與隨機選項 ---
            const optionSet = new Set();
            optionSet.add(String(correct));

            // 加入「由左往右算」的陷阱答案
            if (step1_result > 0 && step1_result !== correct) {
                optionSet.add(String(step1_result));
            }

            // 補充其他干擾項
            while (optionSet.size < 4) {
                const offset = [1, -1, 10, -10][randInt(0, 3)];
                const cand = correct + offset;
                if (cand > 0 && cand !== correct) optionSet.add(String(cand));
            }

            const finalOptions = shuffle(Array.from(optionSet));

            list.push({
                type: "choice",
                prompt: prompt,
                options: finalOptions,
                correctIndex: finalOptions.indexOf(String(correct))
            });
        }
        return list;
    }
};