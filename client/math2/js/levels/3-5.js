// js/levels/3-5.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["3-5"] = {
    id: "3-5",
    unitName: "三年級：乘法進階",
    levelName: "二位數乘一位數",
    type: "two_digit_times_one",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            const a = randInt(10, 99);   // 二位數
            const b = randInt(2, 9);    // 一位數
            const correct = a * b;

            const optionValues = new Set([correct]);
            while (optionValues.size < 4) {
                const offset = randInt(-10, 10);
                const cand = correct + offset;
                if (cand > 0 && cand !== correct) optionValues.add(cand);
            }

            const optionsArray = shuffle(Array.from(optionValues));
            const correctIndex = optionsArray.indexOf(correct);

            list.push({
                type: "choice",
                prompt: `${a} × ${b} = ？`,
                options: optionsArray.map(String),
                correctIndex
            });
        }
        return list;
    }
};
