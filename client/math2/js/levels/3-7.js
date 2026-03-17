// js/levels/3-7.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["3-7"] = {
    id: "3-7",
    unitName: "三年級：圓形認識",
    levelName: "中心・半徑・直徑",
    type: "circle_basic",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const concepts = [
            {
                prompt: "圓心到圓上任一點的線段叫做？",
                options: ["半徑", "直徑", "圓心", "圓周"],
                correctIndex: 0
            },
            {
                prompt: "通過圓心、連接圓上兩點的線段叫做？",
                options: ["半徑", "直徑", "圓心", "圓周"],
                correctIndex: 1
            },
            {
                prompt: "圓的中心點叫做？",
                options: ["圓周", "圓心", "半徑", "直徑"],
                correctIndex: 1
            },
            {
                prompt: "一個圓的半徑是 5 公分，直徑是幾公分？",
                options: ["5 公分", "10 公分", "15 公分", "20 公分"],
                correctIndex: 1
            },
            {
                prompt: "一個圓的直徑是 12 公分，半徑是幾公分？",
                options: ["3 公分", "6 公分", "12 公分", "24 公分"],
                correctIndex: 1
            }
        ];

        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            const q = concepts[randInt(0, concepts.length - 1)];
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
