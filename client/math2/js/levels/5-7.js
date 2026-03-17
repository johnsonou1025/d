// js/levels/5-7.js（修正版）
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["5-7"] = {
    id: "5-7",
    unitName: "五年級：未知數",
    levelName: "列式與求解",
    type: "unknown_equation",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const questions = [
            {
                prompt: "小明比小華多 x 分，最後小華得了 75 分，小明得了 91 分，x 是？",
                options: ["16", "166", "14", "26"],
                correctIndex: 0  // 91-75=16
            },
            {
                prompt: "某數加上 23 等於 85，列式：y+23=85，求 y",
                options: ["62", "108", "85", "23"],
                correctIndex: 0  // 85-23=62
            },
            {
                prompt: "45-x=27，x 等於？",
                options: ["18", "72", "27", "45"],
                correctIndex: 0  // 45-27=18
            },
            {
                prompt: "某數乘以 4 減去 7 等於 25，求該數",
                options: ["8", "10", "33", "7"],
                correctIndex: 0  // 4x-7=25 → 4x=32 → x=8
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
