// js/levels/5-1.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["5-1"] = {
    id: "5-1",
    unitName: "五年級：因數倍數",
    levelName: "找出所有的因數",
    type: "factors",
    questionCount: 10,
    minCorrectToPass: 8,

    // 內部輔助函式：找出一個數的所有因數
    _getFactors(n) {
        const factors = [];
        // 優化迴圈：只需要跑到 n 的平方根即可成對找出因數
        for (let i = 1; i <= Math.sqrt(n); i++) {
            if (n % i === 0) {
                factors.push(i);
                if (i !== n / i) {
                    factors.push(n / i);
                }
            }
        }
        return factors.sort((a, b) => a - b);
    },

    generateQuestions() {
        const list = [];
        // 挑選因數數量較豐富的數字，增加挑戰性
        const targetNumbers = [12, 16, 18, 20, 24, 28, 30, 32, 36, 42, 45, 48, 50, 56, 60];

        // 預先洗牌目標數字
        let pool = shuffle([...targetNumbers]);

        for (let i = 0; i < this.questionCount; i++) {
            // 如果題目數超過 pool 長度，重新補充並洗牌
            if (pool.length === 0) pool = shuffle([...targetNumbers]);

            const n = pool.pop();
            const allFactors = this._getFactors(n);
            const correctStr = allFactors.join(", ");

            const optionSet = new Set();
            optionSet.add(correctStr);

            // --- 智慧干擾項設計 ---
            let attempts = 0; // 防止無窮迴圈
            while (optionSet.size < 4 && attempts < 20) {
                attempts++;
                let distractor = "";
                const errorType = randInt(1, 4);

                if (errorType === 1) {
                    // 錯誤 1：漏掉 1 或自己
                    const missed = allFactors.filter(f => f !== 1 && f !== n);
                    if (missed.length > 0) distractor = missed.join(", ");
                } else if (errorType === 2) {
                    // 錯誤 2：漏掉奇數項（學生常以為只有偶數是因數）
                    const evens = allFactors.filter(f => f % 2 === 0 || f === 1);
                    if (evens.length !== allFactors.length) distractor = evens.join(", ");
                } else if (errorType === 3) {
                    // 錯誤 3：混入一個非因數的鄰近數字
                    const fake = [...allFactors];
                    const trap = n % 3 === 0 ? n / 3 + 1 : 3; // 根據數字特性找陷阱
                    if (!allFactors.includes(trap)) {
                        fake.push(trap);
                        distractor = fake.sort((a, b) => a - b).join(", ");
                    }
                } else {
                    // 錯誤 4：少掉中間某個關鍵對應因數
                    if (allFactors.length > 3) {
                        const midIndex = Math.floor(allFactors.length / 2);
                        const broke = allFactors.filter((_, idx) => idx !== midIndex);
                        distractor = broke.join(", ");
                    }
                }

                if (distractor && distractor !== correctStr) {
                    optionSet.add(distractor);
                }
            }

            // 轉回陣列並洗牌選項
            const finalOptions = shuffle(Array.from(optionSet));

            list.push({
                type: "choice",
                prompt: `請選出「${n}」的所有因數：`,
                options: finalOptions,
                correctIndex: finalOptions.indexOf(correctStr)
            });
        }
        return list;
    }
};