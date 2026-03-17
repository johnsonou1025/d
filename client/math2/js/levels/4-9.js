// js/levels/4-9.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["4-9"] = {
    id: "4-9",
    unitName: "四年級：立體圖形",
    levelName: "長方體認識",
    type: "solid_shapes",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const questions = [
            {
                prompt: "長方體有幾個面？",
                options: ["4 個", "6 個", "8 個", "12 個"],
                correctIndex: 1
            },
            {
                prompt: "正方體的每個面都是？",
                options: ["長方形", "正方形", "三角形", "圓形"],
                correctIndex: 1
            },
            {
                prompt: "長方體有幾個頂點？",
                options: ["6 個", "8 個", "12 個", "24 個"],
                correctIndex: 1
            },
            {
                prompt: "長方體有幾條邊？",
                options: ["6 條", "8 條", "12 條", "24 條"],
                correctIndex: 2
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
