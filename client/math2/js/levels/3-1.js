// js/levels/3-1.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["3-1"] = {
    id: "3-1",
    unitName: "三年級：四位數加減",
    levelName: "萬以內的加減法",
    type: "four_digit_add_sub",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const isAddition = Math.random() < 0.5;
            let a, b, correct;
            let prompt = "";
            let optionSet = new Set();

            if (isAddition) {
                // 【加法】確保結果在 1000 ~ 9999
                a = randInt(1001, 8999);
                b = randInt(101, 9999 - a);
                correct = a + b;
                prompt = `${a} + ${b} = ？`;

                // 生成加法干擾項
                optionSet.add(String(correct));
                while (optionSet.size < 4) {
                    let distractor;
                    const errorType = randInt(1, 3);
                    if (errorType === 1) distractor = correct + 100; // 忘記進位或多進位
                    else if (errorType === 2) distractor = correct - 10;
                    else distractor = correct + (randInt(0, 1) ? 1 : -1) * randInt(1, 5) * 100;

                    if (distractor > 0 && distractor < 10000) optionSet.add(String(distractor));
                }
            } else {
                // 【減法】確保結果為正，且有借位可能
                a = randInt(2000, 9999);
                b = randInt(1001, a - 1);
                correct = a - b;
                prompt = `${a} - ${b} = ？`;

                // 生成減法干擾項
                optionSet.add(String(correct));
                while (optionSet.size < 4) {
                    let distractor;
                    const errorType = randInt(1, 3);
                    if (errorType === 1) distractor = correct + 100; // 退位計算錯誤
                    else if (errorType === 2) distractor = Math.abs(correct - 1000); // 千位數借位錯誤
                    else distractor = correct + (randInt(0, 1) ? 1 : -1) * randInt(1, 5) * 10;

                    if (distractor > 0 && distractor < 10000) optionSet.add(String(distractor));
                }
            }

            // 洗牌與尋找正確索引
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