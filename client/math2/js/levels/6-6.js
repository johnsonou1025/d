// js/levels/6-6.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["6-6"] = {
    id: "6-6",
    unitName: "六年級：比例尺",
    levelName: "地圖縮小距離",
    type: "map_scale",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const questions = [
            {
                prompt: "地圖上 1 公分代表實際 50 公尺，地圖上 3 公分是實際幾公尺？",
                options: ["150", "53", "17", "30"],
                correctIndex: 0  // 50×3=150
            },
            {
                prompt: "比例尺 1:20000，地圖上 5 公分代表實際幾公尺？",
                options: ["1000", "100", "500", "10000"],
                correctIndex: 0  // 5×20000=100000公分=1000公尺
            },
            {
                prompt: "實際距離 2 公里，比例尺 1:50000，地圖上幾公分？",
                options: ["4", "2.5", "25", "0.04"],
                correctIndex: 0  // 200000÷50000=4
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
