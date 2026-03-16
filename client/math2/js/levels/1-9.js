// js/levels/1-9.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["1-9"] = {
    id: "1-9",
    unitName: "一年級：時間認識",
    levelName: "整點與半點",
    type: "clock",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const times = [
            { prompt: "3點整", options: ["3:00", "3:30", "2:00", "4:00"], correct: 0 },
            { prompt: "6點半", options: ["6:00", "6:30", "7:00", "5:30"], correct: 1 },
            { prompt: "9點整", options: ["9:00", "8:30", "9:30", "10:00"], correct: 0 },
            { prompt: "12點半", options: ["12:00", "12:30", "1:00", "11:30"], correct: 1 }
        ];

        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            const timeData = times[randInt(0, times.length - 1)];
            list.push({
                type: "choice",
                prompt: `${timeData.prompt} 是幾點？`,
                options: timeData.options,
                correctIndex: timeData.correct
            });
        }
        return list;
    }
};
