// js/levels/5-3.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["5-3"] = {
    id: "5-3",
    unitName: "五年級：分數運算",
    levelName: "擴分、約分與通分",
    type: "fraction_ops",
    questionCount: 10,
    minCorrectToPass: 8,

    // 輔助函式：最大公因數
    _gcd(a, b) {
        return b === 0 ? a : this._gcd(b, a % b);
    },

    // 輔助函式：最小公倍數
    _lcm(a, b) {
        return (a * b) / this._gcd(a, b);
    },

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3); // 1: 擴分, 2: 約分, 3: 通分觀念
            let prompt = "";
            let correctStr = "";
            let optionSet = new Set();

            if (mode === 1) {
                // 【模式 1】擴分 (Expansion)
                const n = randInt(1, 4);
                const d = randInt(n + 1, 9);
                const factor = randInt(2, 5);

                const type = randInt(1, 2);
                if (type === 1) {
                    prompt = `將 ${n}/${d} 擴分後，若分母變成 ${d * factor}，分子應是多少？`;
                    correctStr = String(n * factor);
                } else {
                    prompt = `將 ${n}/${d} 擴分成為 ${n * factor}/${d * factor}，是分子分母同時乘以多少？`;
                    correctStr = String(factor);
                }
                optionSet.add(correctStr);
                optionSet.add(String(factor + 1));
                optionSet.add(String(n + factor));

            } else if (mode === 2) {
                // 【模式 2】約分 (Reduction)
                const common = randInt(2, 6);
                const finalN = randInt(1, 4);
                let finalD = randInt(finalN + 1, 9);
                while (this._gcd(finalN, finalD) !== 1) finalD++; // 確保是最簡分數

                const startN = finalN * common;
                const startD = finalD * common;

                prompt = `將 ${startN}/${startD} 約分到「最簡分數」是多少？`;
                correctStr = `${finalN}/${finalD}`;

                optionSet.add(correctStr);
                optionSet.add(`${startN / 2}/${startD / 2}`); // 沒約乾淨
                optionSet.add(`${finalN}/${startD}`);       // 只約分子
                optionSet.add(`${finalN + 1}/${finalD + 1}`);

            } else {
                // 【模式 3】通分 (Common Denominator)
                let d1 = randInt(2, 6);
                let d2 = randInt(d1 + 1, 9);
                const lcmVal = this._lcm(d1, d2);

                prompt = `要比較 ${randInt(1, d1 - 1)}/${d1} 和 ${randInt(1, d2 - 1)}/${d2} 的大小時，通分後的「最小公分母」是多少？`;
                correctStr = String(lcmVal);

                optionSet.add(correctStr);
                optionSet.add(String(d1 * d2 + 1));
                optionSet.add(String(Math.max(d1, d2)));
                optionSet.add(String(d1 + d2));
            }

            // --- 選項洗牌與補齊 ---
            const finalCorrect = correctStr;
            while (optionSet.size < 4) {
                optionSet.add(String(randInt(2, 30)));
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