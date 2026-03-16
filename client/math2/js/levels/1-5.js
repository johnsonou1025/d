// js/levels/1-5.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["1-5"] = {
    id: "1-5",
    unitName: "一年級：圖形認識",
    levelName: "基本幾何圖形辨識",
    type: "shapes",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const shapes = [
            { name: "圓形", wrong: ["三角形", "正方形"] },
            { name: "三角形", wrong: ["圓形", "正方形"] },
            { name: "正方形", wrong: ["圓形", "三角形"] }
        ];

        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            const shape = shapes[randInt(0, shapes.length - 1)];
            const correct = shape.name;

            const options = [correct, ...shape.wrong];
            const optionsArray = shuffle(options);
            const correctIndex = optionsArray.indexOf(correct);

            list.push({
                type: "choice",
                prompt: `這是什麼圖形？`,
                options: optionsArray,
                correctIndex
            });
        }
        return list;
    }
};
