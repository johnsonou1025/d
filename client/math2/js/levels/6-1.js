// js/levels/6-1.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["6-1"] = {
    id: "6-1",
    unitName: "六年級：分數除法",
    levelName: "倒數與分數除法",
    type: "fraction_division",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const examples = [
            {
                prompt: "2/3 ÷ 1/3 = ？",
                options: ["2", "1/2", "1/9", "3/2"],
                correctIndex: 0  // 2/3 × 3/1 = 6/3 = 2
            },
            {
                prompt: "3/4 ÷ 2 = ？",
                options: ["3/8", "3/2", "6/4", "1/2"],
                correctIndex: 0  // 3/4 × 1/2 = 3/8
            },
            {
                prompt: "1 ÷ 3/5 = ？",
                options: ["3/5", "5/3", "1/5", "5"],
                correctIndex: 1  // 1 × 5/3 = 5/3
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
