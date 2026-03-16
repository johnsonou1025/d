// js/levels/1-4.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["1-4"] = {
    id: "1-4",
    unitName: "一年級：減法入門",
    levelName: "20 以內減法（不借位）",
    type: "subtraction_no_borrow",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            // 確保不借位：個位數被減數 >= 減數
            const ones1 = randInt(1, 9);
            const ones2 = randInt(1, ones1);
            const tens1 = randInt(1, 1);
            const tens2 = randInt(0, tens1);

            const a = tens1 * 10 + ones1;
            const b = tens2 * 10 + ones2;
            const correct = a - b;

            const optionValues = new Set();
            optionValues.add(correct);

            while (optionValues.size < 4) {
                const offset = randInt(-3, 3);
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
