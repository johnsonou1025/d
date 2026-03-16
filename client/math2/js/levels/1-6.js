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
            const baseNum = randInt(0, 98); // 確保 +1 不超過 99
            const correctNum = baseNum + 1;

            const optionValues = new Set();
            optionValues.add(correctNum);

            // 產生錯誤選項：前一個數、後兩個數、隨機數
            const wrong1 = baseNum;           // 前一個
            const wrong2 = baseNum + 2;       // 後兩個
            const wrong3 = randInt(0, 99);    // 隨機

            optionValues.add(wrong1);
            if (wrong2 <= 99) optionValues.add(wrong2);
            optionValues.add(wrong3);

            const optionsArray = shuffle(Array.from(optionValues));
            const correctIndex = optionsArray.indexOf(correctNum);

            list.push({
                type: "choice",
                prompt: `${baseNum} 的下一個數是？`,
                options: Array.from(optionValues).map(String),
                correctIndex
            });
        }
        return list;
    }
};
