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

            if (isAdd) {
                // 加法
                const a = (randInt(1, 99) / 100).toFixed(2);  // 0.01 ~ 0.99
                const b = (randInt(1, 99) / 100).toFixed(2);
                const correct = (parseFloat(a) + parseFloat(b)).toFixed(2);

                const prompt = `${a} + ${b} = ？`;
                const optionValues = new Set([correct]);
                while (optionValues.size < 4) {
                    const offset = randInt(-20, 20) / 100;
                    const cand = (parseFloat(correct) + offset).toFixed(2);
                    if (cand !== correct) optionValues.add(cand);
                }

                const optionsArray = shuffle(Array.from(optionValues));
                const correctIndex = optionsArray.indexOf(correct);

                list.push({
                    type: "choice",
                    prompt,
                    options: optionsArray,
                    correctIndex
                });
            } else {
                // 減法
                const a = (randInt(50, 99) / 100).toFixed(2);  // 0.50 ~ 0.99
                const b = (randInt(1, parseInt(a * 100) - 10) / 100).toFixed(2);
                const correct = (parseFloat(a) - parseFloat(b)).toFixed(2);

                const prompt = `${a} - ${b} = ？`;
                const optionValues = new Set([correct]);
                while (optionValues.size < 4) {
                    const offset = randInt(-20, 20) / 100;
                    const cand = (parseFloat(correct) + offset).toFixed(2);
                    if (cand !== correct) optionValues.add(cand);
                }

                const optionsArray = shuffle(Array.from(optionValues));
                const correctIndex = optionsArray.indexOf(correct);

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
