// js/levels/5-6.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["5-6"] = {
    id: "5-6",
    unitName: "五年級：分數乘法",
    levelName: "分數的乘法運算",
    type: "fraction_multiply",
    questionCount: 10,
    minCorrectToPass: 8,

    // 輔助函式：最大公因數 (用於簡化分數)
    _gcd(a, b) {
        return b === 0 ? a : this._gcd(b, a % b);
    },

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const isMultiplyByInteger = Math.random() < 0.5;
            let prompt = "";
            let correctStr = "";
            let optionSet = new Set();

            if (isMultiplyByInteger) {
                // 【模式 1】分數 × 整數
                const num = randInt(1, 5);
                const den = randInt(6, 9);
                const integer = randInt(2, 5);

                prompt = `${num}/${den} × ${integer} = ？`;

                const resNum = num * integer;
                const common = this._gcd(resNum, den);

                // 正解可能是帶分數或假分數（依教學進度通常接受假分數，但要處理約分）
                correctStr = common > 1 ? `${resNum / common}/${den / common}` : `${resNum}/${den}`;

                // 增加未約分的選項作為干擾
                if (common > 1) optionSet.add(`${resNum}/${den}`);
                // 錯誤：整數乘到分母去了
                optionSet.add(`${num}/${den * integer}`);
                // 錯誤：分子分母都加了整數
                optionSet.add(`${num + integer}/${den + integer}`);

            } else {
                // 【模式 2】分數 × 分數
                const n1 = randInt(1, 5);
                const d1 = randInt(2, 6);
                const n2 = randInt(1, 5);
                const d2 = randInt(2, 6);

                prompt = `${n1}/${d1} × ${n2}/${d2} = ？`;

                const finalNum = n1 * n2;
                const finalDen = d1 * d2;
                const common = this._gcd(finalNum, finalDen);

                correctStr = common > 1 ? `${finalNum / common}/${finalDen / common}` : `${finalNum}/${finalDen}`;

                // 干擾項：分子加分子、分母加分母 (學生的經典錯誤)
                optionSet.add(`${n1 + n2}/${d1 + d2}`);
                // 干擾項：交叉相乘的錯誤概念
                optionSet.add(`${n1 * d2}/${d1 * n2}`);
                // 干擾項：未約分版本
                if (common > 1) optionSet.add(`${finalNum}/${finalDen}`);
            }

            // 處理結果為整數的情況 (例如 8/4 -> 2)
            if (correctStr.includes("/")) {
                const parts = correctStr.split("/");
                if (parts[0] % parts[1] === 0) correctStr = String(parts[0] / parts[1]);
            }

            optionSet.add(correctStr);

            // 補足 4 個隨機干擾項
            while (optionSet.size < 4) {
                const rN = randInt(1, 10);
                const rD = randInt(2, 12);
                optionSet.add(`${rN}/${rD}`);
            }

            let finalOptions = shuffle(Array.from(optionSet)).slice(0, 4);

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