// js/levels/2-7.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["2-7"] = {
    id: "2-7",
    unitName: "二年級：錢幣計算",
    levelName: "幣值轉換與應用",
    type: "money",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3);
            let prompt = "";
            let correctValue = 0;
            let optionSet = new Set();

            if (mode === 1) {
                // 【模式 1】大換小：一個大硬幣/鈔票可以換幾個小硬幣
                const bigCoins = [100, 50, 10];
                const big = bigCoins[randInt(0, bigCoins.length - 1)];
                const smallOptions = big === 100 ? [50, 10, 5, 1] : (big === 50 ? [10, 5, 1] : [5, 1]);
                const small = smallOptions[randInt(0, smallOptions.length - 1)];

                correctValue = big / small;
                prompt = `1 張 ${big} 元可以換成幾個 ${small} 元硬幣？`;

            } else if (mode === 2) {
                // 【模式 2】總額組成：湊到指定整數金額需要幾個硬幣
                const coinTypes = [50, 10, 5];
                const coin = coinTypes[randInt(0, coinTypes.length - 1)];
                const count = randInt(2, 10);
                const total = coin * count;

                correctValue = count;
                prompt = `需要幾枚 ${coin} 元硬幣，才能湊成 ${total} 元？`;

            } else {
                // 【模式 3】混合計算：給定組合問總額
                const h = randInt(1, 4); // 百元
                const t = randInt(1, 9); // 十元
                const o = randInt(1, 9); // 一元

                correctValue = h * 100 + t * 10 + o;
                prompt = `${h}張100元、${t}個10元和${o}個1元，合起來是多少元？`;
            }

            // --- 答案隨機：生成干擾項 ---
            const correctStr = String(correctValue);
            optionSet.add(correctStr);

            while (optionSet.size < 4) {
                let distractor;
                if (mode === 3) {
                    // 總額題的干擾：數字位元易位或增減
                    const offsets = [10, -10, 1, -1, 100, -100];
                    distractor = String(correctValue + offsets[randInt(0, offsets.length - 1)]);
                } else {
                    // 數量題的干擾：鄰近數字
                    distractor = String(Math.max(1, correctValue + (randInt(0, 1) ? 1 : -1) * randInt(1, 3)));
                }

                if (distractor !== correctStr && parseInt(distractor) > 0) {
                    optionSet.add(distractor);
                }
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