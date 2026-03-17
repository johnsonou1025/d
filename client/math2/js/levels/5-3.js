// js/levels/5-3.js（最終修正版）
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["5-3"] = {
    id: "5-3",
    unitName: "五年級：分數運算",
    levelName: "擴分約分通分",
    type: "fraction_ops",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const questions = [
            {
                prompt: "把 1/3 擴分成為 2/6，乘數是？",
                options: ["2", "3", "6", "1/2"],
                correctIndex: 0
            },
            {
                prompt: "把 4/12 約分到最簡，分母變成？",
                options: ["3", "4", "6", "12"],
                correctIndex: 0  // 1/3
            },
            {
                prompt: "1/2 和 1/3 的通分分母是？",
                options: ["6", "2", "3", "1"],
                correctIndex: 0
            },
            {
                prompt: "通分後 1/4 = ?/12",
                options: ["3", "2", "4", "1"],
                correctIndex: 0  // 1/4 = 3/12
            },
            {
                prompt: "通分後 2/5 = ?/10",
                options: ["4", "3", "5", "2"],
                correctIndex: 0  // 2/5 = 4/10
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
