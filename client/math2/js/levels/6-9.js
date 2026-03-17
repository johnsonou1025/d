// js/levels/6-9.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["6-9"] = {
    id: "6-9",
    unitName: "六年級：和差問題",
    levelName: "基準比較量",
    type: "reference_comparison",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const questions = [
            {
                prompt: "甲乙和 30，差 6，甲幾？",
                options: ["18", "12", "24", "6"],
                correctIndex: 0  // (30+6)/2=18
            },
            {
                prompt: "追趕問題：快車超慢車 20 分鐘追上 4 公里，相對速多快？",
                options: ["12 km/h", "8 km/h", "16 km/h", "4 km/h"],
                correctIndex: 0  // 4÷(20/60)=12
            },
            {
                prompt: "和差問題：A比B多3，兩者和18，A幾？",
                options: ["10.5", "7.5", "12", "15"],
                correctIndex: 0  // (18+3)/2=10.5
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
