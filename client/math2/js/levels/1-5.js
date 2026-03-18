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
        const shapeConfigs = [
            { name: "圓形", id: "circle", wrong: ["三角形", "正方形"] },
            { name: "三角形", id: "triangle", wrong: ["圓形", "正方形"] },
            { name: "正方形", id: "square", wrong: ["圓形", "三角形"] }
        ];

        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            // 每次迴圈隨機挑選一個形狀配置
            const config = shapeConfigs[randInt(0, shapeConfigs.length - 1)];
            const correctName = config.name;

            // 隨機洗牌選項，確保正確答案位置不固定
            const optionsArray = shuffle([correctName, ...config.wrong]);
            const correctIndex = optionsArray.indexOf(correctName);

            list.push({
                type: "choice",
                prompt: `這是什麼圖形？`,
                visualShape: config.id, // 關鍵：告知 main.js 要畫哪種圖形
                options: optionsArray,
                correctIndex
            });
        }
        return list;
    }
};