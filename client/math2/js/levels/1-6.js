// js/levels/1-6.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["1-6"] = {
    id: "1-6",
    unitName: "一年級：數序認識",
    levelName: "100 以內數序",
    type: "sequence",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            const isNext = Math.random() > 0.5; // 隨機切換問「前一個」或「下一個」
            const baseNum = randInt(2, 98);
            const correctNum = isNext ? baseNum + 1 : baseNum - 1;
            const promptText = isNext ? `${baseNum} 的下一個數是？` : `${baseNum} 的前一個數是？`;

            const optionSet = new Set([correctNum]);
            while (optionSet.size < 3) {
                const wrong = correctNum + randInt(-3, 3);
                if (wrong >= 0 && wrong <= 100 && wrong !== correctNum) {
                    optionSet.add(wrong);
                }
            }

            const finalOptions = shuffle(Array.from(optionSet)).map(String);

            list.push({
                type: "choice",
                prompt: promptText,
                options: finalOptions,
                correctIndex: finalOptions.indexOf(String(correctNum))
            });
        }
        return list;
    }
};