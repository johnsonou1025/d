// js/levels/6-1.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["6-1"] = {
    id: "6-1",
    unitName: "六年級：分數除法",
    levelName: "倒數與分數的除法運算",
    type: "fraction_division",
    questionCount: 10,
    minCorrectToPass: 8,

    // 輔助函式：最大公因數 (用於約分)
    _gcd(a, b) {
        return b === 0 ? a : this._gcd(b, a % b);
    },

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3); // 1: 倒數定義, 2: 分數除以整數, 3: 分數除以分數
            let prompt = "";
            let correctStr = "";
            let optionSet = new Set();

            if (mode === 1) {
                // 【模式 1】倒數的基礎觀念
                const n = randInt(2, 9);
                const d = randInt(2, 9);
                if (Math.random() < 0.5) {
                    prompt = `請問「${n}/${d}」的倒數是多少？`;
                    correctStr = `${d}/${n}`;
                } else {
                    prompt = `請問整數「${n}」的倒數是多少？`;
                    correctStr = `1/${n}`;
                }
                optionSet.add(correctStr);
                optionSet.add(`${n}/${d}`);
                optionSet.add(`1`);
                optionSet.add(`0`);

            } else if (mode === 2) {
                // 【模式 2】分數除以整數 (或是整數除以分數)
                const isIntDivFrac = Math.random() < 0.5;
                const n = randInt(1, 5);
                const d = randInt(2, 6);
                const integer = randInt(2, 4);

                if (isIntDivFrac) {
                    // 整數 ÷ 分數 (例如 2 ÷ 1/3 = 6)
                    prompt = `${integer} ÷ ${n}/${d} = ？`;
                    const resNum = integer * d;
                    const resDen = n;
                    const common = this._gcd(resNum, resDen);
                    correctStr = (resDen / common === 1) ? String(resNum / common) : `${resNum / common}/${resDen / common}`;

                    optionSet.add(`${integer * n}/${d}`); // 錯誤：沒變倒數直接乘
                } else {
                    // 分數 ÷ 整數 (例如 3/4 ÷ 2 = 3/8)
                    prompt = `${n}/${d} ÷ ${integer} = ？`;
                    const resNum = n;
                    const resDen = d * integer;
                    const common = this._gcd(resNum, resDen);
                    correctStr = `${resNum / common}/${resDen / common}`;

                    optionSet.add(`${n * integer}/${d}`); // 錯誤：整數乘到分子
                }

            } else {
                // 【模式 3】分數除以分數 (最核心題型)
                let n1 = randInt(1, 4), d1 = randInt(2, 5);
                let n2 = randInt(1, 4), d2 = randInt(2, 5);
                while (n1 / d1 === n2 / d2) n2 = randInt(1, 4);

                prompt = `${n1}/${d1} ÷ ${n2}/${d2} = ？`;

                // 計算：(n1/d1) * (d2/n2)
                const resNum = n1 * d2;
                const resDen = d1 * n2;
                const common = this._gcd(resNum, resDen);

                const finalN = resNum / common;
                const finalD = resDen / common;
                correctStr = (finalD === 1) ? String(finalN) : `${finalN}/${finalD}`;

                // 錯誤設計：直接乘、沒約分、或是交叉相加
                optionSet.add(`${n1 * n2}/${d1 * d2}`); // 錯誤：變成分數乘法
                optionSet.add(`${n1 + n2}/${d1 + d2}`); // 錯誤：分子加分子
            }

            // --- 補齊與洗牌 ---
            optionSet.add(correctStr);
            while (optionSet.size < 4) {
                optionSet.add(`${randInt(1, 10)}/${randInt(2, 10)}`);
            }

            const finalOptions = shuffle(Array.from(optionSet)).map(String);

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