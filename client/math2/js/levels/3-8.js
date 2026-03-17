// js/levels/3-8.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["3-8"] = {
    id: "3-8",
    unitName: "三年級：長度單位",
    levelName: "公里與公尺換算",
    type: "length_km_m",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const isKmToM = Math.random() < 0.5;

            if (isKmToM) {
                // 公里 → 公尺
                const km = randInt(1, 20);
                const correct = km * 1000;
                const prompt = `${km} 公里等於幾公尺？`;

                const optionValues = new Set([correct]);
                while (optionValues.size < 4) {
                    const offset = randInt(-2000, 2000);
                    const cand = correct + offset;
                    if (cand > 0 && cand !== correct) optionValues.add(cand);
                }

                const optionsArray = shuffle(Array.from(optionValues));
                const correctIndex = optionsArray.indexOf(correct);

                list.push({
                    type: "choice",
                    prompt,
                    options: optionsArray.map(v => `${v} 公尺`),
                    correctIndex
                });
            } else {
                // 公尺 → 公里
                const km = randInt(1, 20);
                const m = km * 1000;
                const correctStr = `${km} 公里`;
                const prompt = `${m} 公尺等於幾公里？`;

                const optionValues = new Set([correctStr]);
                while (optionValues.size < 4) {
                    const offset = randInt(-3, 3);
                    const candKm = km + offset;
                    if (candKm > 0) {
                        const candStr = `${candKm} 公里`;
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
            }
        }

        return list;
    }
};
