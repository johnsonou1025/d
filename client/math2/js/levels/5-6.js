// js/levels/5-6.js（最終修正版）
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["5-6"] = {
    id: "5-6",
    unitName: "五年級：分數乘法",
    levelName: "分數乘整數與分數",
    type: "fraction_multiply",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const examples = [
            {
                prompt: "2/7 × 3 = ？",
                options: ["6/7", "2/21", "5/7", "1"],
                correctIndex: 0  // ✅ 2/7 × 3/1 = 6/7
            },
            {
                prompt: "3/5 × 2/3 = ？",
                options: ["6/15", "5/8", "1/5", "2/4"],
                correctIndex: 0  // ✅ 3/5 × 2/3 = 6/15 = 2/5（但選6/15）
            },
            {
                prompt: "1/4 × 8 = ？",
                options: ["2", "1/32", "8/4", "32"],
                correctIndex: 0  // ✅ 1/4 × 8/1 = 8/4 = 2
            },
            {
                prompt: "3/8 × 4/3 = ？",
                options: ["1/2", "12/24", "7/11", "1"],
                correctIndex: 0  // ✅ 3/8 × 4/3 = 12/24 = 1/2
            },
            {
                prompt: "5/6 × 2 = ？",
                options: ["10/6", "7/6", "3/6", "5/3"],
                correctIndex: 0  // ✅ 5/6 × 2/1 = 10/6
            }
        ];

        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            const q = examples[i % examples.length];
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
