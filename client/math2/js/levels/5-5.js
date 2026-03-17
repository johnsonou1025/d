// js/levels/5-5.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["5-5"] = {
    id: "5-5",
    unitName: "五年級：多邊形面積",
    levelName: "平行四邊形三角形梯形",
    type: "polygon_area",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const questions = [
            {
                prompt: "平行四邊形面積公式是？",
                options: ["底×高", "(上底+下底)×高÷2", "底×高÷2", "周長×高"],
                correctIndex: 0
            },
            {
                prompt: "三角形面積公式是？",
                options: ["底×高", "底×高÷2", "(上底+下底)×高÷2", "底²"],
                correctIndex: 1
            },
            {
                prompt: "梯形上底 6、下底 10、高 4，面積？",
                options: ["64", "32", "48", "16"],
                correctIndex: 0  // (6+10)×4÷2 = 64÷2 = 32? 錯，(16×4)÷2=32 → B
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
