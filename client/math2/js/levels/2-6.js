// js/levels/2-6.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["2-6"] = {
    id: "2-6",
    unitName: "二年級：長度單位",
    levelName: "公分與公尺換算",
    type: "length_units",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];
        const conversions = [
            { from: "公分", to: "公尺", factor: 100 },
            { from: "公尺", to: "公分", factor: 0.01 }
        ];

        for (let i = 0; i < this.questionCount; i++) {
            const conv = conversions[randInt(0, 1)];
            let value;

            if (conv.from === "公分") {
                value = randInt(50, 500); // 50cm ~ 5m
                const correct = (value / 100).toFixed(1);
                list.push({
                    type: "choice",
                    prompt: `${value} ${conv.from} 等於幾 ${conv.to}？`,
                    options: [correct, (Number(correct) + 0.5).toFixed(1), (Number(correct) - 0.5).toFixed(1), (Number(correct) + 1).toFixed(1)],
                    correctIndex: 0
                });
            } else {
                value = randInt(1, 10); // 1m ~ 10m
                const correct = value * 100;
                list.push({
                    type: "choice",
                    prompt: `${value} ${conv.from} 等於幾 ${conv.to}？`,
                    options: [correct.toString(), (correct + 50).toString(), (correct - 50).toString(), (correct + 100).toString()],
                    correctIndex: 0
                });
            }
        }
        return list;
    }
};
