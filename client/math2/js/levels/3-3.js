// js/levels/3-3.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["3-3"] = {
    id: "3-3",
    unitName: "三年級：除法入門",
    levelName: "等分除（平均分給）",
    type: "division_sharing",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            const total = randInt(12, 60);          // 總數
            const groups = randInt(2, 9);          // 人數或組數
            const correct = Math.floor(total / groups);

            // 確保可以整除：重新算一次
            const realTotal = correct * groups;

            const prompt = `${realTotal} 個蘋果平均分給 ${groups} 個人，每個人可以分到幾個？`;

            const optionValues = new Set([correct]);
            while (optionValues.size < 4) {
                const offset = randInt(-3, 3);
                const cand = correct + offset;
                if (cand > 0 && cand !== correct) optionValues.add(cand);
            }

            const optionsArray = shuffle(Array.from(optionValues));
            const correctIndex = optionsArray.indexOf(correct);

            list.push({
                type: "choice",
                prompt,
                options: optionsArray.map(String),
                correctIndex
            });
        }
        return list;
    }
};
