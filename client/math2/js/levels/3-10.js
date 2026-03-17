// js/levels/3-10.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["3-10"] = {
    id: "3-10",
    unitName: "三年級：角的認識",
    levelName: "直角與角度大小",
    type: "angle_basic",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const concepts = [
            {
                prompt: "可以用什麼工具來幫助判斷是不是直角？",
                options: ["三角板", "圓規", "直尺", "分數卡"],
                correctIndex: 0
            },
            {
                prompt: "剛好是直角的角大約幾度？",
                options: ["45 度", "60 度", "90 度", "180 度"],
                correctIndex: 2
            },
            {
                prompt: "比直角小的角叫做？",
                options: ["銳角", "鈍角", "平角", "周角"],
                correctIndex: 0
            },
            {
                prompt: "比直角大的角叫做？",
                options: ["銳角", "鈍角", "平角", "周角"],
                correctIndex: 1
            },
            {
                prompt: "如果用三角板的直角去量，剛好貼合，這個角是？",
                options: ["直角", "銳角", "鈍角", "平角"],
                correctIndex: 0
            }
        ];

        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            const q = concepts[randInt(0, concepts.length - 1)];
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
