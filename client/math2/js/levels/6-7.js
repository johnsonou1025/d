// js/levels/6-7.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["6-7"] = {
    id: "6-7",
    unitName: "六年級：百分率",
    levelName: "折扣與加成",
    type: "percentage",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const questions = [
            {
                prompt: "原價 200 元，8 折後多少錢？",
                options: ["160", "208", "180", "240"],
                correctIndex: 0  // 200×0.8=160
            },
            {
                prompt: "售價 240 元，加成 20%，原價多少？",
                options: ["200", "288", "48", "240"],
                correctIndex: 0  // 240÷1.2=200
            },
            {
                prompt: "500 元商品，打 9 折，省多少錢？",
                options: ["50", "45", "55", "40"],
                correctIndex: 0  // 500×0.1=50
            }
        ];

        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            const q = questions[i % questions.length];
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
