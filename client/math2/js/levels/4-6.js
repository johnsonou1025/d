// js/levels/4-6.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["4-6"] = {
    id: "4-6",
    unitName: "四年級：平行垂直",
    levelName: "平行線與垂直線",
    type: "parallel_perpendicular",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const questions = [
            {
                prompt: "兩條直線相交的夾角是 90°，這兩條直線互相？",
                options: ["平行", "垂直", "相交", "重合"],
                correctIndex: 1
            },
            {
                prompt: "兩條直線永遠不會相交，距離處處相等，叫做？",
                options: ["垂直線", "平行線", "相交線", "曲線"],
                correctIndex: 1
            },
            {
                prompt: "同時垂直於同一條直線的兩條直線，互相是？",
                options: ["垂直", "平行", "相交", "重合"],
                correctIndex: 1
            },
            {
                prompt: "鐵軌兩條軌道互相是什麼關係？",
                options: ["垂直", "平行", "相交", "曲線"],
                correctIndex: 1
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
