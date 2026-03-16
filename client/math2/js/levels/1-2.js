// js/levels/1-2.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["1-2"] = {
    id: "1-2",
    unitName: "一年級：數數入門",
    levelName: "10 以內合成與分解",
    type: "composition",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            const total = randInt(2, 9);
            const part1 = randInt(1, total - 1);
            const part2 = total - part1;
            const correct = total;

            const optionValues = new Set();
            optionValues.add(correct);

            while (optionValues.size < 4) {
                const offset = randInt(-2, 2);
                const cand = correct + offset;
                if (cand >= 0 && cand !== correct) {
                    optionValues.add(cand);
                }
            }

            const optionsArray = shuffle(Array.from(optionValues));
            const correctIndex = optionsArray.indexOf(correct);

            list.push({
                type: "choice",
                prompt: `${part1} + ${part2} = ？`,
                options: optionsArray.map(String),
                correctIndex
            });
        }
        return list;
    }
};
