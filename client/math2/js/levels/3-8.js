// js/levels/3-8.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["3-8"] = {
    id: "3-8",
    unitName: "三年級：長度單位",
    levelName: "公里與公尺的換算",
    type: "length_km_m",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3);
            let prompt = "";
            let correctStr = "";
            let optionSet = new Set();

            if (mode === 1) {
                // 【模式 1】公里 → 公尺
                const km = randInt(1, 15);
                const m = km * 1000;
                prompt = `${km} 公里等於幾公尺？`;
                correctStr = `${m} 公尺`;

                optionSet.add(correctStr);
                while (optionSet.size < 4) {
                    // 加入常見錯誤：少一個 0 或多一個 0
                    const distractors = [`${km * 100} 公尺`, `${km * 10000} 公尺`, `${km * 10} 公尺`, `${km + 1000} 公尺`];
                    optionSet.add(distractors[randInt(0, distractors.length - 1)]);
                }

            } else if (mode === 2) {
                // 【模式 2】公尺 → 公里
                const km = randInt(1, 20);
                const m = km * 1000;
                prompt = `${m} 公尺等於幾公里？`;
                correctStr = `${km} 公里`;

                optionSet.add(correctStr);
                while (optionSet.size < 4) {
                    const wrongKm = [km * 10, km / 10, km + 1, km + 2][randInt(0, 3)];
                    if (wrongKm > 0 && Number.isInteger(wrongKm)) {
                        optionSet.add(`${wrongKm} 公里`);
                    } else {
                        optionSet.add(`${randInt(1, 25)} 公里`);
                    }
                }

            } else {
                // 【模式 3】混合單位換算 (例如：2 公里 50 公尺 = ? 公尺)
                const km = randInt(1, 5);
                const mPart = randInt(1, 9) * 10 + randInt(0, 9); // 10~99 公尺，增加進位難度
                const totalM = km * 1000 + mPart;

                prompt = `${km} 公里 ${mPart} 公尺等於幾公尺？`;
                correctStr = `${totalM} 公尺`;

                optionSet.add(correctStr);
                while (optionSet.size < 4) {
                    // 模擬學生沒把公里換成 1000 的錯誤（例如變成 2050 -> 250）
                    const distractors = [`${km * 100 + mPart} 公尺`, `${km * 10 + mPart} 公尺`, `${totalM + 100} 公尺`, `${totalM - 10} 公尺`];
                    optionSet.add(distractors[randInt(0, distractors.length - 1)]);
                }
            }

            // 隨機洗牌選項
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