// js/levels/1-10.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["1-10"] = {
    id: "1-10",
    unitName: "一年級：長度比較",
    levelName: "直接比長短",
    type: "length_comparison",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            let lenA = randInt(3, 9) * 10;
            let lenB = randInt(3, 9) * 10;
            while (lenA === lenB) lenB = randInt(3, 9) * 10;

            const askLonger = Math.random() > 0.5;
            const promptText = askLonger ? "哪一個比較長？" : "哪一個比較短？";

            const options = ["紅色水管", "綠色水管"];
            const correctIndex = askLonger ? (lenA > lenB ? 0 : 1) : (lenA < lenB ? 0 : 1);

            list.push({
                type: "choice",
                prompt: promptText,
                visualLength: { a: lenA, b: lenB }, // 傳遞給渲染函式
                options: options,
                correctIndex: correctIndex
            });
        }
        return list;
    }
};