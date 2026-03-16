// js/levels/2-3.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["2-3"] = {
    id: "2-3",
    unitName: "二年級：乘法概念",
    levelName: "連加轉乘法",
    type: "multiplication_concept",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            const multiplier = randInt(2, 5);
            const addend = randInt(1, 9);
            const correct = multiplier * addend;

            const prompts = [
                `${addend} + ${addend} + ...（加 ${multiplier} 次）= ？`,
                `${addend} × ${multiplier} = ？`,
                `連加 ${multiplier} 個 ${addend} 等於？`
            ];

            const prompt = prompts[randInt(0, 2)];

            const optionValues = new Set();
            optionValues.add(correct);

            while (optionValues.size < 4) {
                const offset = randInt(-3, 3);
                const cand = correct + offset;
                if (cand > 0 && cand !== correct) optionValues.add(cand);
            }

            const optionsArray = shuffle(Array.from(optionValues));
            const correctIndex = optionsArray.indexOf(correct);

            list.push({
                type: "choice",
                prompt: prompt,
                options: optionsArray.map(String),
                correctIndex
            });
        }
        return list;
    }
};
