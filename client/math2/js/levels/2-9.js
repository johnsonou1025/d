// js/levels/2-9.js（修正版）
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["2-9"] = {
    id: "2-9",
    unitName: "二年級：分數入門",
    levelName: "二分之一・四分之一・八分之一",
    type: "fractions",  // ⭐ 改成 fractions
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const fractions = [
            {
                shaded: 1, total: 2, name: "二分之一",
                visualFraction: { shaded: 1, total: 2 },
                options: ["1/2", "1/4", "1/8", "2/2"]
            },
            {
                shaded: 1, total: 4, name: "四分之一",
                visualFraction: { shaded: 1, total: 4 },
                options: ["1/4", "1/2", "1/8", "2/4"]
            },
            {
                shaded: 1, total: 8, name: "八分之一",
                visualFraction: { shaded: 1, total: 8 },
                options: ["1/8", "1/4", "1/2", "2/8"]
            }
        ];

        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            const frac = fractions[randInt(0, 2)];
            list.push({
                type: "choice",
                prompt: `${frac.name} 陰影部分占幾分之幾？`,
                options: frac.options,
                correctIndex: 0,
                visualFraction: frac.visualFraction  // ⭐ 關鍵：分數圖形資料
            });
        }
        return list;
    }
};
