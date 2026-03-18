// js/levels/3-10.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["3-10"] = {
    id: "3-10",
    unitName: "三年級：角的認識",
    levelName: "直角、銳角與鈍角",
    type: "angle_basic",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3);
            let prompt = "";
            let correctStr = "";
            let optionSet = new Set();
            let visualAngle = 90; // 預設提供給前端繪圖的角度

            if (mode === 1) {
                // 【模式 1】看圖辨識：直角、銳角、鈍角
                const subMode = randInt(1, 3);
                if (subMode === 1) {
                    visualAngle = 90;
                    correctStr = "直角";
                } else if (subMode === 2) {
                    visualAngle = randInt(30, 70);
                    correctStr = "銳角";
                } else {
                    visualAngle = randInt(110, 150);
                    correctStr = "鈍角";
                }
                prompt = "觀察畫面上的角，這是一個什麼角？";

                optionSet.add("直角").add("銳角").add("鈍角").add("平角");

            } else if (mode === 2) {
                // 【模式 2】角度定義與大小比較
                const type = randInt(1, 2);
                if (type === 1) {
                    prompt = "比直角小的角叫做什麼角？";
                    correctStr = "銳角";
                    visualAngle = 45;
                } else {
                    prompt = "比直角大的角叫做什麼角？";
                    correctStr = "鈍角";
                    visualAngle = 135;
                }
                optionSet.add("直角").add("銳角").add("鈍角").add("周角");

            } else {
                // 【模式 3】工具與度數常識
                const type = randInt(1, 2);
                if (type === 1) {
                    prompt = "一個標準的直角是多少度？";
                    correctStr = "90 度";
                    optionSet.add("90 度").add("180 度").add("45 度").add("60 度");
                    visualAngle = 90;
                } else {
                    prompt = "判斷一個角是不是直角，可以用三角板的哪裡來量？";
                    correctStr = "直角處";
                    optionSet.add("直角處").add("最長的一邊").add("尖尖的角").add("中間的洞");
                    visualAngle = 90;
                }
            }

            // --- 答案隨機：洗牌選項 ---
            const finalOptions = shuffle(Array.from(optionSet));

            list.push({
                type: "choice",
                prompt: prompt,
                options: finalOptions,
                correctIndex: finalOptions.indexOf(correctStr),
                visualAngle: visualAngle // 傳遞給渲染引擎畫出對應角度
            });
        }
        return list;
    }
};