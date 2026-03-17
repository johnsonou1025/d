// js/levels/6-4.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["6-4"] = {
    id: "6-4",
    unitName: "六年級：圓周率",
    levelName: "圓周長與面積",
    type: "circle_circumference_area",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const pi = 3.14;

        const questions = [
            {
                prompt: "直徑 10 公分的圓，周長約？（用 π=3.14）",
                options: ["31.4", "15.7", "62.8", "6.28"],
                correctIndex: 0  // 3.14×10=31.4
            },
            {
                prompt: "半徑 5 公分的圓，面積約？（用 π=3.14）",
                options: ["78.5", "31.4", "15.7", "157"],
                correctIndex: 0  // 5²×3.14=78.5
            },
            {
                prompt: "圓周長 25.12，周長率 π=3.14，直徑？",
                options: ["8", "6", "10", "4"],
                correctIndex: 0  // 25.12÷3.14=8
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
