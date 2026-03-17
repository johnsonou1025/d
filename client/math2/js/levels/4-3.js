// js/levels/4-3.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["4-3"] = {
    id: "4-3",
    unitName: "四年級：進階除法",
    levelName: "三位數÷二位數",
    type: "three_by_two_div",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            const b = randInt(12, 49);    // 二位數除數
            const q = randInt(2, 81);     // 商
            const a = b * q;              // 被除數正好整除

            const correct = q;

            const optionValues = new Set([correct]);
            while (optionValues.size < 4) {
                const offset = randInt(-5, 5);
                const cand = correct + offset;
                if (cand > 0 && cand !== correct) optionValues.add(cand);
            }

            const optionsArray = shuffle(Array.from(optionValues));
            const correctIndex = optionsArray.indexOf(correct);

            list.push({
                type: "choice",
                prompt: `${a} ÷ ${b} = ？`,
                options: optionsArray.map(String),
                correctIndex
            });
        }
        return list;
    }
};
