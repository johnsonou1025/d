// js/levels/2-10.js（修正版）
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["2-10"] = {
    id: "2-10",
    unitName: "二年級：容量比較",
    levelName: "容器多寡比較",
    type: "capacity",  // ⭐ 新增 capacity type
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const containers = [
            {
                prompt: "左邊容器比右邊多嗎？",
                leftLevel: 6, rightLevel: 3,  // 左邊裝 6/10，右邊 3/10
                options: ["多", "少", "一樣"],
                correct: 0
            },
            {
                prompt: "A 容器和 B 哪個裝的多？",
                leftLevel: 8, rightLevel: 5,
                options: ["A", "B", "一樣"],
                correct: 0
            },
            {
                prompt: "C 容器比 D 少嗎？",
                leftLevel: 2, rightLevel: 7,
                options: ["是", "不是"],
                correct: 0
            }
        ];

        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            const container = containers[randInt(0, containers.length - 1)];
            list.push({
                type: "choice",
                prompt: container.prompt,
                options: container.options,
                correctIndex: container.correct,
                visualContainers: {    // ⭐ 關鍵：容器圖形資料
                    left: container.leftLevel,
                    right: container.rightLevel,
                    maxHeight: 10
                }
            });
        }
        return list;
    }
};
