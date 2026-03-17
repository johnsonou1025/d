// js/levels/4-4.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["4-4"] = {
    id: "4-4",
    unitName: "四年級：角度測量",
    levelName: "量角器與角度",
    type: "angle_measurement",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const questions = [
            {
                prompt: "量角器上，0° 和 180° 在同一條直線上是什麼關係？",
                options: ["銳角", "鈍角", "直線", "平角"],
                correctIndex: 3  // 平角 180°
            },
            {
                prompt: "用量角器量出來的角度是 75°，這是什麼角？",
                options: ["銳角", "直角", "鈍角", "平角"],
                correctIndex: 0
            },
            {
                prompt: "兩個相鄰的直角相加等於幾度？",
                options: ["90°", "180°", "270°", "360°"],
                correctIndex: 1
            },
            {
                prompt: "量角器量角時，要讓哪條線對準量角器的中心點？",
                options: ["角的頂點", "角的兩條邊", "量角器的刻度", "量角器的邊"],
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
