// js/levels/2-8.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["2-8"] = {
    id: "2-8",
    unitName: "二年級：時間計算",
    levelName: "幾小時幾分後",
    type: "time_arithmetic",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            const startHour = randInt(1, 22);
            const startMin = randInt(0, 59);
            const addHour = randInt(1, 5);
            const addMin = randInt(10, 59);

            const totalMin = startMin + addMin;
            const finalHour = startHour + addHour + Math.floor(totalMin / 60);
            const finalMin = totalMin % 60;

            const correct = `${finalHour.toString().padStart(2, '0')}:${finalMin.toString().padStart(2, '0')}`;

            list.push({
                type: "choice",
                prompt: `${startHour}:${startMin.toString().padStart(2, '0')} 過 ${addHour} 小時 ${addMin} 分鐘後是？`,
                options: [
                    correct,
                    `${(finalHour + 1).toString().padStart(2, '0')}:${finalMin.toString().padStart(2, '0')}`,
                    `${finalHour.toString().padStart(2, '0')}:${(finalMin + 10).toString().padStart(2, '0')}`,
                    `${(finalHour - 1).toString().padStart(2, '0')}:${finalMin.toString().padStart(2, '0')}`
                ],
                correctIndex: 0
            });
        }
        return list;
    }
};
