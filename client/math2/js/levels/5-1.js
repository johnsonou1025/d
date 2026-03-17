// js/levels/5-1.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["5-1"] = {
    id: "5-1",
    unitName: "五年級：因數倍數",
    levelName: "找因數",
    type: "factors",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        // 固定題目 + 隨機題
        const fixedQuestions = [
            { n: 12, factors: "1, 2, 3, 4, 6, 12", options: ["1, 2, 3, 4, 6, 12", "1, 2, 3, 6", "1, 2, 4, 12", "2, 3, 4, 6, 12"], correctIndex: 0 },
            { n: 18, factors: "1, 2, 3, 6, 9, 18", options: ["1, 2, 3, 6, 9, 18", "1, 3, 6, 9", "2, 3, 6, 18", "1, 2, 9, 18"], correctIndex: 0 },
            { n: 24, factors: "1, 2, 3, 4, 6, 8, 12, 24", options: ["1, 2, 3, 4, 6, 8, 12, 24", "1, 2, 4, 8, 24", "2, 3, 4, 6, 12", "1, 3, 8, 24"], correctIndex: 0 }
        ];

        for (let i = 0; i < this.questionCount; i++) {
            const q = fixedQuestions[i % fixedQuestions.length];

            list.push({
                type: "choice",
                prompt: `12 的所有因數是？`,
                options: q.options,
                correctIndex: q.correctIndex
            });
        }
        return list;
    }
};
