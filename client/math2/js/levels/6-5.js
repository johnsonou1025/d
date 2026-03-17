// js/levels/6-5.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["6-5"] = {
    id: "6-5",
    unitName: "六年級：速率",
    levelName: "距離時間速率",
    type: "speed_calculation",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const questions = [
            {
                prompt: "小明 3 小時走 15 公里，速率？",
                options: ["5 km/h", "18 km/h", "45 km/h", "3 km/h"],
                correctIndex: 0  // 15÷3=5
            },
            {
                prompt: "速率 4 km/h，走 2 小時，距離？",
                options: ["8 公里", "6 公里", "2 公里", "12 公里"],
                correctIndex: 0  // 4×2=8
            },
            {
                prompt: "距離 30 公里，時間 5 小時，速率？",
                options: ["6 km/h", "150 km/h", "25 km/h", "5 km/h"],
                correctIndex: 0  // 30÷5=6
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
