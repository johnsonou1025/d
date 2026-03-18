// js/levels/4-7.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["4-7"] = {
    id: "4-7",
    unitName: "四年級：小數運算",
    levelName: "二位小數加減",
    type: "decimal_add_sub",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const isAdd = Math.random() < 0.5;
            let aInt, bInt, correctInt;
            let prompt = "";

            if (isAdd) {
                // 加法：使用整數運算避免浮點數誤差 (0.01 ~ 4.99)
                aInt = randInt(10, 499);
                bInt = randInt(10, 499);
                correctInt = aInt + bInt;
                prompt = `${(aInt / 100).toFixed(2)} + ${(bInt / 100).toFixed(2)} = ？`;
            } else {
                // 減法：確保結果為正
                aInt = randInt(100, 999);
                bInt = randInt(10, aInt - 5);
                correctInt = aInt - bInt;
                prompt = `${(aInt / 100).toFixed(2)} - ${(bInt / 100).toFixed(2)} = ？`;
            }

            const correctStr = (correctInt / 100).toFixed(2);
            const optionSet = new Set();
            optionSet.add(correctStr);

            // --- 智慧干擾項生成 ---
            while (optionSet.size < 4) {
                let distractor = "";
                const errorType = randInt(1, 3);

                if (errorType === 1) {
                    // 錯誤 1：小數點位置算錯 (放大或縮小 10 倍)
                    distractor = (correctInt / 10).toFixed(2);
                } else if (errorType === 2) {
                    // 錯誤 2：進退位錯誤 (差 0.1 或 0.01)
                    const offset = [1, 10, -1, -10][randInt(0, 3)];
                    distractor = ((correctInt + offset) / 100).toFixed(2);
                } else {
                    // 錯誤 3：整數部分加減對，但小數部分搞混
                    const randOffset = randInt(-50, 50);
                    distractor = ((correctInt + randOffset) / 100).toFixed(2);
                }

                if (distractor !== correctStr && parseFloat(distractor) > 0) {
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