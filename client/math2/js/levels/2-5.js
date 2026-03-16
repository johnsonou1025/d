// js/levels/2-5.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["2-5"] = {
    id: "2-5",
    unitName: "二年級：九九乘法",
    levelName: "3・6・7・9 倍數",
    type: "multiplication_pattern_2",
    multipliers: [3, 6, 7, 9],
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            const multiplier = this.multipliers[randInt(0, this.multipliers.length - 1)];
            const b = randInt(1, 9);
            const correct = multiplier * b;

            const optionValues = new Set();
            optionValues.add(correct);

            while (optionValues.size < 4) {
                const offset = randInt(-3, 3);
                const cand = correct + offset;
                if (cand > 0 && cand !== correct) {
                    optionValues.add(cand);
                }
            }

            const optionsArray = shuffle(Array.from(optionValues));
            const correctIndex = optionsArray.indexOf(correct);

            list.push({
                type: "choice",
                prompt: `${multiplier} × ${b} = ？`,
                options: optionsArray.map(String),
                correctIndex
            });
        }
        return list;
    }
};
