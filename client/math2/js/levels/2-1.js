// js/levels/2-1.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["2-1"] = {
    id: "2-1",
    unitName: "二年級：位值概念",
    levelName: "三位數位值",
    type: "place_value",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            const hundreds = randInt(1, 9);
            const tens = randInt(0, 9);
            const ones = randInt(0, 9);
            const number = hundreds * 100 + tens * 10 + ones;

            const questions = [
                { prompt: `${number} 的百位數字是？`, correct: hundreds },
                { prompt: `${number} 的十位數字是？`, correct: tens },
                { prompt: `${number} 的個位數字是？`, correct: ones }
            ];

            const q = questions[randInt(0, 2)];

            const optionValues = new Set();
            optionValues.add(q.correct);

            while (optionValues.size < 4) {
                const wrong = randInt(0, 9);
                if (wrong !== q.correct) optionValues.add(wrong);
            }

            const optionsArray = shuffle(Array.from(optionValues));
            const correctIndex = optionsArray.indexOf(q.correct);

            list.push({
                type: "choice",
                prompt: q.prompt,
                options: optionsArray.map(String),
                correctIndex
            });
        }
        return list;
    }
};
