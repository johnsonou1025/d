// js/levels/3-9.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["3-9"] = {
    id: "3-9",
    unitName: "三年級：重量單位",
    levelName: "公克與公斤",
    type: "weight_g_kg",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3);

            if (mode === 1) {
                // g → kg
                const kg = randInt(1, 5);
                const g = kg * 1000;
                const correctStr = `${kg} 公斤`;
                const prompt = `${g} 公克等於幾公斤？`;

                const optionValues = new Set([correctStr]);
                while (optionValues.size < 4) {
                    const offset = randInt(-2, 2);
                    const candKg = kg + offset;
                    if (candKg > 0) {
                        const candStr = `${candKg} 公斤`;
                        if (candStr !== correctStr) optionValues.add(candStr);
                    }
                }

                const optionsArray = shuffle(Array.from(optionValues));
                const correctIndex = optionsArray.indexOf(correctStr);

                list.push({
                    type: "choice",
                    prompt,
                    options: optionsArray,
                    correctIndex
                });
            } else if (mode === 2) {
                // kg → g
                const kg = randInt(1, 10);
                const correct = kg * 1000;
                const prompt = `${kg} 公斤等於幾公克？`;

                const optionValues = new Set([correct]);
                while (optionValues.size < 4) {
                    const offset = randInt(-500, 500);
                    const cand = correct + offset;
                    if (cand > 0 && cand !== correct) optionValues.add(cand);
                }

                const optionsArray = shuffle(Array.from(optionValues));
                const correctIndex = optionsArray.indexOf(correct);

                list.push({
                    type: "choice",
                    prompt,
                    options: optionsArray.map(v => `${v} 公克`),
                    correctIndex
                });
            } else {
                // 估測較重 / 較輕
                const prompt = "下列哪一個東西比較重？";
                const options = ["1 公克的橡皮擦", "1 公斤的西瓜", "10 公克的紙張", "100 公克的鉛筆盒"];
                const correctIndex = 1;

                list.push({
                    type: "choice",
                    prompt,
                    options,
                    correctIndex
                });
            }
        }

        return list;
    }
};
