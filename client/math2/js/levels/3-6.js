// js/levels/3-6.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["3-6"] = {
    id: "3-6",
    unitName: "三年級：分數加減",
    levelName: "同分母分數運算",
    type: "fraction_add_sub",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const denom = randInt(3, 12); // 分母範圍稍微擴大 3~12
            const mode = randInt(1, 3); // 1: 加法, 2: 減法, 3: 整數1的減法

            let prompt = "";
            let correctNum = 0;
            let correctStr = "";
            let optionSet = new Set();

            if (mode === 1) {
                // 【模式 1】同分母加法 (確保結果不超過 1，符合三年級範圍)
                const a = randInt(1, Math.floor(denom / 2));
                const b = randInt(1, denom - a - 1);
                correctNum = a + b;
                correctStr = `${correctNum}/${denom}`;
                prompt = `${a}/${denom} + ${b}/${denom} = ？`;

            } else if (mode === 2) {
                // 【模式 2】同分母減法
                const a = randInt(2, denom - 1);
                const b = randInt(1, a - 1);
                correctNum = a - b;
                correctStr = `${correctNum}/${denom}`;
                prompt = `${a}/${denom} - ${b}/${denom} = ？`;

            } else {
                // 【模式 3】1 減去分數 (三年級大重點)
                const b = randInt(1, denom - 1);
                correctNum = denom - b;
                correctStr = `${correctNum}/${denom}`;
                prompt = `1 - ${b}/${denom} = ？`;
            }

            // --- 智慧干擾項生成 ---
            optionSet.add(correctStr);

            while (optionSet.size < 4) {
                let distractor = "";
                const errorType = randInt(1, 3);

                if (errorType === 1) {
                    // 錯誤類型 1：分母也相加 (例如 1/4 + 1/4 = 2/8)
                    if (mode === 1) {
                        const parts = prompt.match(/\d+/g);
                        distractor = `${parseInt(parts[0]) + parseInt(parts[2])}/${parseInt(parts[1]) + parseInt(parts[3])}`;
                    } else {
                        distractor = `${randInt(1, denom)}/${denom + 2}`;
                    }
                } else if (errorType === 2) {
                    // 錯誤類型 2：分子加減錯誤 (誤差 ±1)
                    const offsetNum = correctNum + (randInt(0, 1) ? 1 : -1);
                    if (offsetNum > 0 && offsetNum < denom) distractor = `${offsetNum}/${denom}`;
                } else {
                    // 錯誤類型 3：隨機其他分母的分數
                    distractor = `${randInt(1, denom - 1)}/${denom}`;
                }

                if (distractor !== "" && distractor !== correctStr) {
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