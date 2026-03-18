// js/levels/4-3.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["4-3"] = {
    id: "4-3",
    unitName: "四年級：進階除法",
    levelName: "三位數÷二位數（含餘數）",
    type: "three_by_two_div",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const isExact = Math.random() < 0.4; // 40% 機率整除，60% 機率有餘數
            const divisor = randInt(11, 45);     // 除數：二位數
            const quotient = randInt(11, 35);    // 商：二位數
            let dividend, remainder, prompt, correctStr;

            if (isExact) {
                // 【模式 1】整除
                dividend = divisor * quotient;
                remainder = 0;
                prompt = `${dividend} ÷ ${divisor} = ？`;
                correctStr = String(quotient);
            } else {
                // 【模式 2】有餘數
                remainder = randInt(1, divisor - 1);
                dividend = divisor * quotient + remainder;
                prompt = `${dividend} ÷ ${divisor} = ？`;
                correctStr = `${quotient} ... ${remainder}`;
            }

            const optionSet = new Set();
            optionSet.add(correctStr);

            // --- 智慧干擾項設計 ---
            while (optionSet.size < 4) {
                let distractor = "";
                const errorType = randInt(1, 3);

                if (errorType === 1) {
                    // 錯誤 1：商算錯 (±1)
                    const wQ = Math.max(1, quotient + (Math.random() < 0.5 ? 1 : -1));
                    distractor = isExact ? String(wQ) : `${wQ} ... ${remainder}`;
                } else if (errorType === 2 && !isExact) {
                    // 錯誤 2：餘數算錯 (被除數減法錯誤)
                    const wR = Math.abs(remainder + (Math.random() < 0.5 ? 2 : -2)) % divisor;
                    distractor = `${quotient} ... ${wR === 0 ? 1 : wR}`;
                } else {
                    // 錯誤 3：商與餘數位置混淆或隨機數
                    const wQ = quotient + randInt(-3, 3);
                    const wR = isExact ? randInt(1, 5) : (remainder + 1);
                    distractor = `${wQ} ... ${wR}`;
                }

                if (distractor !== correctStr) {
                    optionSet.add(distractor);
                }
            }

            const finalOptions = shuffle(Array.from(optionSet));

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