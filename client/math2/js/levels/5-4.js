// js/levels/5-4.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["5-4"] = {
    id: "5-4",
    unitName: "五年級：分數加減",
    levelName: "異分母分數的加減",
    type: "unlike_fractions",
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
            const isAddition = Math.random() < 0.6; // 60% 加法, 40% 減法

            // 隨機生成兩個分數，確保分母不同
            let d1 = randInt(2, 6);
            let d2 = randInt(3, 8);
            while (d1 === d2) d2 = randInt(3, 8);

            let n1 = randInt(1, d1 - 1);
            let n2 = randInt(1, d2 - 1);

            // 如果是減法，確保結果為正數
            if (!isAddition && (n1 / d1 < n2 / d2)) {
                [n1, d1, n2, d2] = [n2, d2, n1, d1];
            }

            const commonDen = this._lcm(d1, d2);
            const newN1 = n1 * (commonDen / d1);
            const newN2 = n2 * (commonDen / d2);

            const resNum = isAddition ? newN1 + newN2 : newN1 - newN2;
            const finalGcd = this._gcd(resNum, commonDen);

            // 正解字串 (自動約分)
            const simplifiedNum = resNum / finalGcd;
            const simplifiedDen = commonDen / finalGcd;
            const correctStr = simplifiedDen === 1 ? String(simplifiedNum) : `${simplifiedNum}/${simplifiedDen}`;

            const optionSet = new Set();
            optionSet.add(correctStr);

            // --- 智慧干擾項設計 ---
            // 1. 經典錯誤：分子加分子、分母加分母
            const errorN = isAddition ? n1 + n2 : Math.abs(n1 - n2);
            const errorD = d1 + d2;
            const errorGcd = this._gcd(errorN, errorD);
            optionSet.add(`${errorN / errorGcd}/${errorD / errorGcd}`);

            // 2. 通分錯誤：分母直接相乘但分子沒變
            const wrongN = isAddition ? n1 + n2 : Math.abs(n1 - n2);
            optionSet.add(`${wrongN}/${d1 * d2}`);

            // 3. 鄰近數值干擾
            while (optionSet.size < 4) {
                const off = randInt(-1, 2);
                if (off === 0) continue;
                const candN = Math.max(1, simplifiedNum + off);
                optionSet.add(`${candN}/${simplifiedDen}`);
            }

            const finalOptions = shuffle(Array.from(optionSet)).slice(0, 4);

            list.push({
                type: "choice",
                prompt: `${n1}/${d1} ${isAddition ? '+' : '-'} ${n2}/${d2} = ？`,
                options: finalOptions,
                correctIndex: finalOptions.indexOf(correctStr)
            });
        }
        return list;
    }
};