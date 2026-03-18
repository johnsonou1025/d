// js/levels/5-2.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["5-2"] = {
    id: "5-2",
    unitName: "五年級：公因數公倍數",
    levelName: "最大公因數與最小公倍數",
    type: "gcd_lcm",
    questionCount: 10,
    minCorrectToPass: 8,

    // 輔助函式：最大公因數 (Euclidean Algorithm)
    _getGCD(a, b) {
        return b === 0 ? a : this._getGCD(b, a % b);
    },

    // 輔助函式：最小公倍數
    _getLCM(a, b) {
        return (a * b) / this._getGCD(a, b);
    },

    generateQuestions() {
        const list = [];
        // 適合練習的數值池
        const basePairs = [
            [12, 18], [15, 20], [8, 12], [9, 15], [14, 21],
            [16, 24], [20, 30], [25, 15], [10, 25], [18, 27],
            [6, 9], [12, 16], [24, 36], [15, 45], [20, 50]
        ];

        let shuffledPairs = shuffle([...basePairs]);

        for (let i = 0; i < this.questionCount; i++) {
            if (shuffledPairs.length === 0) shuffledPairs = shuffle([...basePairs]);

            const [a, b] = shuffledPairs.pop();
            const type = Math.random() < 0.5 ? 'gcd' : 'lcm';
            const gcd = this._getGCD(a, b);
            const lcm = this._getLCM(a, b);

            let prompt = "";
            let correctStr = "";
            let optionSet = new Set();

            if (type === 'gcd') {
                prompt = `請問 ${a} 和 ${b} 的「最大公因數」是多少？`;
                correctStr = String(gcd);
                optionSet.add(correctStr);
                optionSet.add("1"); // 學生常誤以為互質
                optionSet.add(String(Math.min(a, b))); // 誤以為較小數就是公因數
                optionSet.add(String(gcd * 2));
            } else {
                prompt = `請問 ${a} 和 ${b} 的「最小公倍數」是多少？`;
                correctStr = String(lcm);
                optionSet.add(correctStr);
                optionSet.add(String(a * b)); // 陷阱：直接相乘（非最小）
                optionSet.add(String(Math.max(a, b))); // 誤以為較大數就是公倍數
                optionSet.add(String(lcm * 2));
            }

            // 補齊隨機選項並洗牌
            while (optionSet.size < 4) {
                const randomVal = type === 'gcd' ? randInt(2, 10) : randInt(20, 100);
                optionSet.add(String(randomVal));
            }

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