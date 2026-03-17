// js/levels/5-10.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["5-10"] = {
    id: "5-10",
    unitName: "五年級：扇形面積",
    levelName: "圓心角認識",
    type: "sector_angle",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const questions = [
            {
                prompt: "扇形的頂點在哪裡？",
                options: ["圓周上", "圓心", "半徑中間", "扇形邊緣"],
                correctIndex: 1
            },
            {
                prompt: "一個完整的圓是幾度？",
                options: ["180°", "360°", "90°", "270°"],
                correctIndex: 1
            },
            {
                prompt: "圓心角 90° 的扇形占圓的面積比例？",
                options: ["1/2", "1/4", "1/3", "3/4"],
                correctIndex: 1  // 90/360 = 1/4
            },
            {
                prompt: "圓心角 120° 的扇形占圓的面積比例？",
                options: ["1/3", "1/2", "1/4", "2/3"],
                correctIndex: 0  // 120/360 = 1/3
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
