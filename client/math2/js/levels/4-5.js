// js/levels/4-5.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["4-5"] = {
    id: "4-5",
    unitName: "四年級：三角形",
    levelName: "三角形分類",
    type: "triangle_types",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const questions = [
            {
                prompt: "三邊長度完全相等的三角形叫做？",
                options: ["等腰三角形", "等邊三角形", "直角三角形", "鈍角三角形"],
                correctIndex: 1
            },
            {
                prompt: "有兩個角是直角的三角形是？",
                options: ["等腰三角形", "等邊三角形", "直角三角形", "銳角三角形"],
                correctIndex: 2
            },
            {
                prompt: "有兩個邊長相等的三角形叫做？",
                options: ["等腰三角形", "等邊三角形", "直角三角形", "鈍角三角形"],
                correctIndex: 0
            },
            {
                prompt: "三角形內所有角都小於90°叫做？",
                options: ["銳角三角形", "鈍角三角形", "直角三角形", "等腰三角形"],
                correctIndex: 0
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
