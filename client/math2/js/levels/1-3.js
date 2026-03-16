// js/levels/1-3.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["1-3"] = {
    id: "1-3",
    unitName: "一年級：加法入門",
    levelName: "20 以內加法（不進位）",
    type: "addition_no_carry",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            // 確保不進位：個位數相加 < 10
            const ones1 = randInt(1, 9);
            const ones2 = randInt(1, 9 - ones1);
            const tens1 = randInt(0, 1);
            const tens2 = randInt(0, 1);

            const a = tens1 * 10 + ones1;
            const b = tens2 * 10 + ones2;
            const correct = a + b;

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
                prompt: `${a} + ${b} = ？`,
                options: optionsArray.map(String),
                correctIndex
            });
        }
        return list;
    }
};
