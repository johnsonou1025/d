// js/levels/3-4.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["3-4"] = {
    id: "3-4",
    unitName: "三年級：除法入門",
    levelName: "包含除（每幾個一組）",
    type: "division_grouping",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            const groups = randInt(2, 9);        // 組數
            const perGroup = randInt(2, 9);      // 每組幾個
            const total = groups * perGroup;     // 總數

            const prompt = `${total} 個蘋果，每 ${perGroup} 個裝一盒，一共可以裝幾盒？`;
            const correct = groups;

            const optionValues = new Set([correct]);
            while (optionValues.size < 4) {
                const offset = randInt(-3, 3);
                const cand = correct + offset;
                if (cand > 0 && cand !== correct) optionValues.add(cand);
            }

            const optionsArray = shuffle(Array.from(optionValues));
            const correctIndex = optionsArray.indexOf(correct);

            list.push({
                type: "choice",
                prompt,
                options: optionsArray.map(String),
                correctIndex
            });
        }
        return list;
    }
};
