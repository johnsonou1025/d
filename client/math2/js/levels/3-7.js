// js/levels/3-7.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["3-7"] = {
    id: "3-7",
    unitName: "三年級：圓形認識",
    levelName: "中心、半徑與直徑",
    type: "circle_basic",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3);
            let prompt = "";
            let correctStr = "";
            let optionSet = new Set();

            if (mode === 1) {
                // 【模式 1】名詞定義題
                const subMode = randInt(1, 3);
                const terms = ["半徑", "直徑", "圓心", "圓周"];
                if (subMode === 1) {
                    prompt = "從圓心到圓上任何一點的線段叫做什麼？";
                    correctStr = "半徑";
                } else if (subMode === 2) {
                    prompt = "通過圓心且兩端都在圓上的線段叫做什麼？";
                    correctStr = "直徑";
                } else {
                    prompt = "圓最中心的一個點叫做什麼？";
                    correctStr = "圓心";
                }
                terms.forEach(t => optionSet.add(t));

            } else if (mode === 2) {
                // 【模式 2】半徑求直徑 (R -> D)
                const r = randInt(2, 25);
                const d = r * 2;
                prompt = `一個圓的「半徑」是 ${r} 公分，請問它的「直徑」是多少公分？`;
                correctStr = `${d} 公分`;

                optionSet.add(correctStr);
                while (optionSet.size < 4) {
                    const distractors = [`${r} 公分`, `${r + 2} 公分`, `${d * 2} 公分`, `${r + 10} 公分`];
                    optionSet.add(distractors[randInt(0, distractors.length - 1)]);
                }

            } else {
                // 【模式 3】直徑求半徑 (D -> R)
                // 確保直徑是偶數，方便三年級學生除以 2
                const r = randInt(3, 20);
                const d = r * 2;
                prompt = `一個圓的「直徑」是 ${d} 公分，請問它的「半徑」是多少公分？`;
                correctStr = `${r} 公分`;

                optionSet.add(correctStr);
                while (optionSet.size < 4) {
                    const distractors = [`${d} 公分`, `${d * 2} 公分`, `${r + 5} 公分`, `${Math.floor(d / 4)} 公分`];
                    const cand = distractors[randInt(0, distractors.length - 1)];
                    if (parseInt(cand) > 0) optionSet.add(cand);
                }
            }

            // --- 答案隨機：洗牌選項並找出索引 ---
            const finalOptions = shuffle(Array.from(optionSet));

            list.push({
                type: "choice",
                prompt: prompt,
                options: finalOptions,
                correctIndex: finalOptions.indexOf(correctStr)
            });
        }
        return list;
    }
};