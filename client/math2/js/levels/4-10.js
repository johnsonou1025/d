// js/levels/4-10.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["4-10"] = {
    id: "4-10",
    unitName: "四年級：統計圖表",
    levelName: "長條圖折線圖",
    type: "charts_reading",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const questions = [
            {
                prompt: "長條圖中，每條長條的高度代表什麼？",
                options: ["時間", "數量", "角度", "長度"],
                correctIndex: 1
            },
            {
                prompt: "折線圖用來表示什麼資料？",
                options: ["單一時間點", "連續變化的數值", "面積大小", "角度大小"],
                correctIndex: 1
            },
            {
                prompt: "長條圖裡最高的長條代表什麼？",
                options: ["最小的數值", "最大的數值", "平均數值", "中間數值"],
                correctIndex: 1
            },
            {
                prompt: "從長條圖可以直接看出來的資訊是？",
                options: ["平均值", "總和", "每個類別的數量", "變化趨勢"],
                correctIndex: 2
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
