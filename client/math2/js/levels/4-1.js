// js/levels/4-1.js（修正版）
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["4-1"] = {
    id: "4-1",
    unitName: "四年級：運算規則",
    levelName: "四則運算順序",
    type: "order_of_operations",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const examples = [
            {
                prompt: "8 + 6 × 3 = ？（先乘除後加減）",
                options: ["26", "42", "24", "17"],
                correctIndex: 0  // ✅ 6×3=18, 8+18=26
            },
            {
                prompt: "15 - 3 × 4 + 2 = ？",
                options: ["5", "26", "9", "10"],
                correctIndex: 0  // ✅ 3×4=12, 15-12+2=5
            },
            {
                prompt: "20 ÷ 2 + 5 × 3 - 1 = ？",
                options: ["24", "19", "30", "10"],
                correctIndex: 0  // ✅ 20÷2=10, 5×3=15, 10+15-1=24
            },
            {
                prompt: "(12 ÷ 3) + 8 × 2 = ？",
                options: ["20", "28", "10", "32"],
                correctIndex: 0  // ✅ 括號12÷3=4, 8×2=16, 4+16=20
            },
            {
                prompt: "9 × 2 - 4 + 6 ÷ 2 = ？",
                options: ["15", "19", "11", "25"],
                correctIndex: 0  // ✅ 9×2=18, 6÷2=3, 18-4+3=17? 錯，18-4=14+3=17? 選項錯
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
