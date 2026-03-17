// js/levels/6-8.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["6-8"] = {
    id: "6-8",
    unitName: "六年級：柱體",
    levelName: "角柱圓柱體積",
    type: "cylinder_prism",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const questions = [
            {
                prompt: "底面積 20 平方公分，高 5 公分，角柱體積？",
                options: ["100", "25", "125", "4"],
                correctIndex: 0  // 20×5=100
            },
            {
                prompt: "圓柱半徑 3 公分，高 10 公分（π=3.14），體積？",
                options: ["282.6", "94.2", "28.26", "846"],
                correctIndex: 0  // 3.14×9×10=282.6
            },
            {
                prompt: "角柱底周長 24 公分，高 6 公分，側面積？",
                options: ["144", "24", "30", "1440"],
                correctIndex: 0  // 24×6=144
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
