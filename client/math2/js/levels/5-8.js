// js/levels/5-8.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["5-8"] = {
    id: "5-8",
    unitName: "五年級：對稱圖形",
    levelName: "對稱軸與對稱點",
    type: "line_symmetry",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const questions = [
            {
                prompt: "正方形有幾條對稱軸？",
                options: ["1 條", "2 條", "3 條", "4 條"],
                correctIndex: 3
            },
            {
                prompt: "等腰三角形有幾條對稱軸？",
                options: ["0 條", "1 條", "2 條", "3 條"],
                correctIndex: 1
            },
            {
                prompt: "對稱軸的作用是？",
                options: ["讓圖形變大", "折疊後兩邊重合", "讓圖形旋轉", "改變顏色"],
                correctIndex: 1
            },
            {
                prompt: "圓形有幾條對稱軸？",
                options: ["無限多", "1 條", "2 條", "4 條"],
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
