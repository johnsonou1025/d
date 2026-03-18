// js/levels/6-3.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["6-3"] = {
    id: "6-3",
    unitName: "六年級：比與比值",
    levelName: "比的意義與等比性質",
    type: "ratio_proportion",
    questionCount: 10,
    minCorrectToPass: 8,

    // 輔助函式：求最大公因數用於簡化比
    _getGCD(a, b) {
        return b === 0 ? a : this._getGCD(b, a % b);
    },

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3); // 1: 求未知項, 2: 求比值, 3: 判斷相等的比
            let prompt = "";
            let correctStr = "";
            let optionSet = new Set();

            if (mode === 1) {
                // 【模式 1】求未知項 (等比性質擴分)
                const a = randInt(2, 5);
                const b = randInt(3, 7);
                const factor = randInt(2, 6);
                const isMissingA = Math.random() < 0.5;

                if (isMissingA) {
                    prompt = `${a} : ${b} = ？ : ${b * factor}`;
                    correctStr = String(a * factor);
                } else {
                    prompt = `${a} : ${b} = ${a * factor} : ？`;
                    correctStr = String(b * factor);
                }
                optionSet.add(correctStr);
                optionSet.add(String(isMissingA ? a + factor : b + factor)); // 陷阱：用加的
                optionSet.add(String(isMissingA ? a * (factor + 1) : b * (factor + 1)));
                optionSet.add(String(a + b));

            } else if (mode === 2) {
                // 【模式 2】求比值 (前項 ÷ 後項)
                const a = randInt(2, 9);
                const b = randInt(2, 9);
                if (a === b) continue; // 避免比值為 1 太簡單

                const common = this._getGCD(a, b);
                prompt = `請問「${a} : ${b}」的比值是多少？`;
                correctStr = (b / common === 1) ? String(a / common) : `${a / common}/${b / common}`;

                optionSet.add(correctStr);
                optionSet.add(`${b / common}/${a / common}`); // 陷阱：前後項顛倒
                optionSet.add(`${a}/${a + b}`);               // 陷阱：部分與全體
                optionSet.add(`${a + b}`);

            } else {
                // 【模式 3】判斷相等的比 (簡化比)
                const baseA = randInt(2, 4);
                const baseB = randInt(3, 5);
                const factor = randInt(2, 4);

                prompt = `下列哪一個比與「${baseA} : ${baseB}」相等？`;
                correctStr = `${baseA * factor} : ${baseB * factor}`;

                optionSet.add(correctStr);
                optionSet.add(`${baseA + 2} : ${baseB + 2}`); // 陷阱：同時加 2
                optionSet.add(`${baseA * 2} : ${baseB * 3}`); // 陷阱：擴分倍數不同
                optionSet.add(`${baseB} : ${baseA}`);         // 陷阱：前後項顛倒
            }

            // --- 補齊與洗牌 ---
            const finalCorrect = correctStr;
            while (optionSet.size < 4) {
                optionSet.add(`${randInt(2, 20)} : ${randInt(2, 20)}`);
            }

            const finalOptions = shuffle(Array.from(optionSet)).map(String);

            list.push({
                type: "choice",
                prompt: prompt,
                options: finalOptions,
                correctIndex: finalOptions.indexOf(finalCorrect)
            });
        }
        return list;
    }
};