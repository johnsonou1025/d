// js/levels/2-7.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["2-7"] = {
    id: "2-7",
    unitName: "二年級：錢幣計算",
    levelName: "幣值轉換",
    type: "money",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const coins = [100, 50, 10, 1];
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const total = randInt(50, 500);
            const coinType = coins[randInt(0, coins.length - 1)];
            const count = Math.floor(total / coinType);

            const prompts = [
                `需要幾張 ${coinType} 元幣，才能湊到 ${total} 元？`,
                `${total} 元可以用幾張 ${coinType} 元幣來付？`,
                `付 ${total} 元，要準備幾張 ${coinType} 元？`
            ];

            const prompt = prompts[randInt(0, 2)];

            const optionValues = new Set();
            optionValues.add(count);

            while (optionValues.size < 4) {
                const wrong = randInt(Math.max(0, count - 2), count + 3);
                if (wrong !== count) optionValues.add(wrong);
            }

            const optionsArray = shuffle(Array.from(optionValues));
            const correctIndex = optionsArray.indexOf(count);

            list.push({
                type: "choice",
                prompt: prompt,
                options: optionsArray.map(String),
                correctIndex
            });
        }
        return list;
    }
};
