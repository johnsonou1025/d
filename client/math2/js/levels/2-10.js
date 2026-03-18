// js/levels/2-10.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["2-10"] = {
    id: "2-10",
    unitName: "二年級：容量比較",
    levelName: "容器多寡比較",
    type: "capacity",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];
        const maxH = 10; // 容器最大高度基準

        for (let i = 0; i < this.questionCount; i++) {
            // 隨機生成左、右容器的液面高度 (1~10)
            let leftL = randInt(1, maxH);
            let rightL = randInt(1, maxH);

            // 確保不要每一題都一樣高，增加變化
            if (i % 5 === 0) rightL = leftL;

            const mode = randInt(1, 3);
            let prompt = "";
            let options = [];
            let correctIndex = -1;

            if (mode === 1) {
                // 【模式 1】比較誰多
                prompt = "哪一個容器裝的水比較「多」？";
                options = ["左邊 (A)", "右邊 (B)", "一樣多"];
                if (leftL > rightL) correctIndex = 0;
                else if (leftL < rightL) correctIndex = 1;
                else correctIndex = 2;

            } else if (mode === 2) {
                // 【模式 2】是非判斷（多）
                prompt = `左邊的水量比右邊「多」嗎？`;
                options = ["是", "不是"];
                correctIndex = (leftL > rightL) ? 0 : 1;

            } else {
                // 【模式 3】是非判斷（少）
                prompt = `左邊的水量比右邊「少」嗎？`;
                options = ["是", "不是"];
                correctIndex = (leftL < rightL) ? 0 : 1;
            }

            list.push({
                type: "choice",
                prompt: prompt,
                options: options,
                correctIndex: correctIndex,
                visualContainers: {
                    left: leftL,
                    right: rightL,
                    maxHeight: maxH
                }
            });
        }
        return list;
    }
};