// js/levels/6-2.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["6-2"] = {
    id: "6-2",
    unitName: "六年級：小數除法",
    levelName: "小數除法求商",
    type: "decimal_division",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const examples = [
            {
                prompt: "6.4 ÷ 2 = ？（保留小數點後一位）",
                options: ["3.2", "3.0", "32", "0.32"],
                correctIndex: 0
            },
            {
                prompt: "15.6 ÷ 4 = ？（保留整數）",
                options: ["4", "3", "39", "3.9"],
                correctIndex: 0  // 3.9 → 4
            },
            {
                prompt: "2.56 ÷ 0.8 = ？",
                options: ["3.2", "2", "32", "0.32"],
                correctIndex: 0  // 256/80 = 3.2
            }
        ];

        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            const q = examples[i % examples.length];
            list.push({
                type: "choice",
                prompt: q.prompt,
                options: q.options,
                correctIndex: q.correctIndex
            });
        }
        return list;
    }
};
