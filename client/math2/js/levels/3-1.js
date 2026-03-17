// js/levels/3-1.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["3-1"] = {
    id: "3-1",
    unitName: "三年級：四位數加減",
    levelName: "四位數加減法",
    type: "four_digit_add_sub",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const isAddition = Math.random() < 0.5;

            if (isAddition) {
                // 1000 ~ 8999 之間的加法
                const a = randInt(1000, 8999);
                const b = randInt(100, 8999 - a); // 確保不超過 9999
                const correct = a + b;

                const optionValues = new Set([correct]);
                while (optionValues.size < 4) {
                    const offset = randInt(-200, 200);
                    const cand = correct + offset;
                    if (cand >= 0 && cand <= 9999 && cand !== correct) {
                        optionValues.add(cand);
                    }
                }
                const optionsArray = shuffle(Array.from(optionValues));
                const correctIndex = optionsArray.indexOf(correct);

                list.push({
                    type: "choice",
                    prompt: `${a} + ${b} = ？`,
                    options: optionsArray.map(String),
                    correctIndex
                });
            } else {
                // 1000 ~ 9999 減法，確保結果為正
                const a = randInt(2000, 9999);
                const b = randInt(100, a - 1);
                const correct = a - b;

                const optionValues = new Set([correct]);
                while (optionValues.size < 4) {
                    const offset = randInt(-200, 200);
                    const cand = correct + offset;
                    if (cand >= 0 && cand <= 9999 && cand !== correct) {
                        optionValues.add(cand);
                    }
                }
                const optionsArray = shuffle(Array.from(optionValues));
                const correctIndex = optionsArray.indexOf(correct);

                list.push({
                    type: "choice",
                    prompt: `${a} - ${b} = ？`,
                    options: optionsArray.map(String),
                    correctIndex
                });
            }
        }

        return list;
    }
};
