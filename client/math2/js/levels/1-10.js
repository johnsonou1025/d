// js/levels/1-10.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["1-10"] = {
    id: "1-10",
    unitName: "一年級：長度比較",
    levelName: "直接比長短",
    type: "length_comparison",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const comparisons = [
            { prompt: "A 比 B 長嗎？", options: ["是", "不是"], correct: 0 },
            { prompt: "C 和 D 哪個較長？", options: ["C", "D"], correct: 0 },
            { prompt: "E 比 F 短嗎？", options: ["是", "不是"], correct: 1 }
        ];

        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            const comp = comparisons[randInt(0, comparisons.length - 1)];
            list.push({
                type: "choice",
                prompt: comp.prompt,
                options: comp.options,
                correctIndex: comp.correct
            });
        }
        return list;
    }
};
