// js/levels/2-9.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["2-9"] = {
    id: "2-9",
    unitName: "二年級：分數入門",
    levelName: "認識幾分之一",
    type: "fractions",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];
        // 二年級重點在於「單位分數」，即分子為 1 的情況
        const possibleTotals = [2, 3, 4, 5, 6, 8, 10, 12];
        const fractionNames = {
            2: "二分之一", 3: "三分之一", 4: "四分之一",
            5: "五分之一", 6: "六分之一", 8: "八分之一",
            10: "十分之一", 12: "十二分之一"
        };

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 2);
            let prompt = "";
            let correctStr = "";
            let optionSet = new Set();

            // 隨機挑選分母
            const total = possibleTotals[randInt(0, possibleTotals.length - 1)];
            const fracName = fractionNames[total];
            const visualData = { shaded: 1, total: total };

            if (mode === 1) {
                // 【模式 1】圖形看分數：問「陰影部分占幾分之幾？」
                prompt = "看圖想一想，陰影部分占了全部的幾分之幾？";
                correctStr = `1/${total}`;

                optionSet.add(correctStr);
                while (optionSet.size < 4) {
                    const wrongTotal = possibleTotals[randInt(0, possibleTotals.length - 1)];
                    if (wrongTotal !== total) optionSet.add(`1/${wrongTotal}`);
                    // 加入常見錯誤：分子不為 1
                    if (optionSet.size < 4) optionSet.add(`${randInt(2, total)}/${total}`);
                }
            } else {
                // 【模式 2】文字轉分數：問「八分之一怎麼寫？」
                prompt = `「${fracName}」用數字要怎麼表示？`;
                correctStr = `1/${total}`;

                optionSet.add(correctStr);
                while (optionSet.size < 4) {
                    const wrongTotal = randInt(2, 12);
                    // 模擬分子分母顛倒的錯誤
                    if (optionSet.size === 1) optionSet.add(`${total}/1`);
                    else optionSet.add(`1/${wrongTotal}`);
                }
            }

            // 隨機洗牌選項
            const finalOptions = shuffle(Array.from(optionSet));

            list.push({
                type: "choice",
                prompt: prompt,
                options: finalOptions,
                correctIndex: finalOptions.indexOf(correctStr),
                visualFraction: visualData
            });
        }
        return list;
    }
};