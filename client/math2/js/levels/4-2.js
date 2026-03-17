// js/levels/4-2.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["4-2"] = {
    id: "4-2",
    unitName: "四年級：進階乘法",
    levelName: "三位數×二位數",
    type: "three_by_two_mult",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            const a = randInt(100, 999);  // 三位數
            const b = randInt(10, 99);    // 二位數
            const correct = a * b;

            const optionValues = new Set([correct]);
            while (optionValues.size < 4) {
                const offset = randInt(-200, 200);
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
