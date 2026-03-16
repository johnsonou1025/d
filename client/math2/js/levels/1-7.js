// js/levels/1-7.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["1-7"] = {
    id: "1-7",
    unitName: "一年級：進位加法",
    levelName: "二位數加法（進位）",
    type: "addition_carry",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            // 產生會進位的加法：個位相加 >= 10
            const ones1 = randInt(5, 9);
            const ones2 = randInt(10 - ones1, 5);
            const tens1 = randInt(1, 8);
            const tens2 = randInt(0, 9 - tens1);

            const a = tens1 * 10 + ones1;
            const b = tens2 * 10 + ones2;
            const correct = a + b;

            const optionValues = new Set();
            optionValues.add(correct);

            while (optionValues.size < 4) {
                const offset = randInt(-5, 5);
                const cand = correct + offset;
                if (cand > 0 && cand !== correct) {
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
        }
        return list;
    }
};
