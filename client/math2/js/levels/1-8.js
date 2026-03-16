// js/levels/1-8.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["1-8"] = {
    id: "1-8",
    unitName: "一年級：借位減法",
    levelName: "二位數減法（借位）",
    type: "subtraction_borrow",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            // 產生需要借位的減法：個位被減數 < 減數
            const ones1 = randInt(0, 4);
            const ones2 = randInt(ones1 + 1, 9);
            const tens1 = randInt(2, 9);
            const tens2 = randInt(0, tens1 - 1);

            const a = tens1 * 10 + ones1;
            const b = tens2 * 10 + ones2;
            const correct = a - b;

            const optionValues = new Set();
            optionValues.add(correct);

            while (optionValues.size < 4) {
                const offset = randInt(-5, 5);
                const cand = correct + offset;
                if (cand >= 0 && cand !== correct) {
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
        return list;
    }
};
