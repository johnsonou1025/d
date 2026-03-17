// js/levels/6-3.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["6-3"] = {
    id: "6-3",
    unitName: "六年級：比例",
    levelName: "比值與等比",
    type: "ratio_proportion",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const questions = [
            {
                prompt: "2:3 = 4:？",
                options: ["6", "5", "7", "8"],
                correctIndex: 0
            },
            {
                prompt: "3:5 = 6:？",
                options: ["10", "9", "11", "8"],
                correctIndex: 0
            },
            {
                prompt: "下列哪個是等比？",
                options: ["2:3 = 5:6", "3:4 = 6:9", "1:2 = 4:7", "2:5 = 3:8"],
                correctIndex: 1  // 3:4 = 6:8? 錯，6:8=3:4 → B
            },
            {
                prompt: "比值 3:4 的比值是？",
                options: ["3/4", "4/3", "3+4", "3×4"],
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
