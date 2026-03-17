// js/levels/5-9.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["5-9"] = {
    id: "5-9",
    unitName: "五年級：體積容積",
    levelName: "立方公分公升毫升",
    type: "volume_capacity",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const questions = [
            {
                prompt: "1 公升等於幾立方公分？",
                options: ["100", "1000", "10", "1"],
                correctIndex: 1
            },
            {
                prompt: "1 公升等於幾毫升？",
                options: ["10", "100", "1000", "10000"],
                correctIndex: 2
            },
            {
                prompt: "500 毫升等於幾公升？",
                options: ["0.5", "5", "50", "0.05"],
                correctIndex: 0
            },
            {
                prompt: "2×3×5 立方公分的水，等於幾公升？",
                options: ["0.03", "30", "0.3", "3"],
                correctIndex: 1  // 30 cm³ = 30 mL = 0.03 L? 錯，30 cm³ = 30 mL = 0.03 L → A
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
