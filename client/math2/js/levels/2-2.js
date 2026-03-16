// js/levels/2-2.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["2-2"] = {
    id: "2-2",
    unitName: "二年級：直式運算",
    levelName: "三位數加減（進借位）",
    type: "three_digit_arithmetic",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            const isAddition = randInt(0, 1) === 0;

            if (isAddition) {
                // 加法（可能進位）
                const hundreds1 = randInt(1, 8);
                const tens1 = randInt(0, 9);
                const ones1 = randInt(0, 9);
                const hundreds2 = randInt(0, 9 - hundreds1);
                const tens2 = randInt(0, 9);
                const ones2 = randInt(0, 9);

                const a = hundreds1 * 100 + tens1 * 10 + ones1;
                const b = hundreds2 * 100 + tens2 * 10 + ones2;
                const correct = a + b;

                list.push({
                    type: "choice",
                    prompt: `${a} + ${b} = ？`,
                    options: [correct.toString(), (correct - 5).toString(), (correct + 5).toString(), (correct - 10).toString()],
                    correctIndex: 0
                });
            } else {
                // 減法（可能借位）
                const hundreds1 = randInt(2, 9);
                const tens1 = randInt(0, 9);
                const ones1 = randInt(0, 9);
                const hundreds2 = randInt(0, hundreds1 - 1);
                const tens2 = randInt(0, 9);
                const ones2 = randInt(0, 9);

                const a = hundreds1 * 100 + tens1 * 10 + ones1;
                const b = hundreds2 * 100 + tens2 * 10 + ones2;
                const correct = a - b;

                list.push({
                    type: "choice",
                    prompt: `${a} - ${b} = ？`,
                    options: [correct.toString(), (correct + 5).toString(), (correct - 5).toString(), (correct + 10).toString()],
                    correctIndex: 0
                });
            }
        }
        return list;
    }
};
