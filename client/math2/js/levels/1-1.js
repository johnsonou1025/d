// js/levels/1-1.js（修正版）
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["1-1"] = {
    id: "1-1",
    unitName: "一年級：數數入門",
    levelName: "10 以內數數與比較（包含 0）",
    type: "counting",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            const correctNum = randInt(0, 9); // 0~9

            const optionValues = new Set();
            optionValues.add(correctNum);

            // 產生 3 個錯誤選項
            while (optionValues.size < 4) {
                const wrong = randInt(0, 9);
                if (wrong !== correctNum) {
                    optionValues.add(wrong);
                }
            }

            const optionsArray = shuffle(Array.from(optionValues));
            const correctIndex = optionsArray.indexOf(correctNum);

            list.push({
                type: "choice",
                prompt: `數一數有多少個星星？`,
                options: optionsArray.map(String),
                correctIndex,
                visualCount: correctNum // 新增：顯示多少個星星
            });
        }
        return list;
    }
};
