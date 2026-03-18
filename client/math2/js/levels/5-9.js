// js/levels/5-9.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["5-9"] = {
    id: "5-9",
    unitName: "五年級：體積容積",
    levelName: "單位換算與容積計算",
    type: "volume_capacity",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3); // 1: 基本單位換算, 2: 體積與容量連結, 3: 簡單容積計算
            let prompt = "";
            let correctStr = "";
            let optionSet = new Set();

            if (mode === 1) {
                // 【模式 1】基本單位換算 (L, mL)
                const isLtoML = Math.random() < 0.5;
                if (isLtoML) {
                    const l = (randInt(1, 50) / 10).toFixed(1); // 0.1 ~ 5.0 L
                    prompt = `${l} 公升等於多少毫升？`;
                    correctStr = `${Math.round(l * 1000)} 毫升`;
                    optionSet.add(`${Math.round(l * 100)} 毫升`);
                    optionSet.add(`${Math.round(l * 10)} 毫升`);
                } else {
                    const ml = randInt(100, 5000);
                    prompt = `${ml} 毫升等於多少公升？`;
                    correctStr = `${ml / 1000} 公升`;
                    optionSet.add(`${ml / 100} 公升`);
                    optionSet.add(`${ml / 10} 公升`);
                }

            } else if (mode === 2) {
                // 【模式 2】立方公分與容量的關係 (cm³ <-> mL/L)
                const sub = randInt(1, 2);
                const val = [100, 250, 500, 1000, 1500, 2000][randInt(0, 5)];
                if (sub === 1) {
                    prompt = `${val} 立方公分的水，倒入量筒後是多少「毫升」？`;
                    correctStr = `${val} 毫升`;
                    optionSet.add(`${val / 10} 毫升`);
                    optionSet.add(`${val / 100} 毫升`);
                } else {
                    prompt = `${val} 立方公分的水，等於多少「公升」？`;
                    correctStr = `${val / 1000} 公升`;
                    optionSet.add(`${val / 100} 公升`);
                    optionSet.add(`${val} 公升`);
                }

            } else {
                // 【模式 3】長方體容器容積計算
                const l = randInt(5, 10);
                const w = randInt(5, 10);
                const h = randInt(2, 5);
                const volume = l * w * h; // cm³

                const unitType = Math.random() < 0.5 ? "毫升" : "公升";
                prompt = `一個長方體容器內部長 ${l}cm、寬 ${w}cm、高 ${h}cm，容量是多少${unitType}？`;

                if (unitType === "毫升") {
                    correctStr = `${volume} 毫升`;
                    optionSet.add(`${volume / 10} 毫升`);
                    optionSet.add(`${volume * 10} 毫升`);
                } else {
                    correctStr = `${volume / 1000} 公升`;
                    optionSet.add(`${volume / 100} 公升`);
                    optionSet.add(`${volume / 10} 公升`);
                }
            }

            // --- 確保包含正確答案並洗牌 ---
            optionSet.add(correctStr);
            let finalOptions = Array.from(optionSet);

            while (finalOptions.length < 4) {
                const randomVal = randInt(1, 100);
                optionSet.add(`${randomVal}`);
                finalOptions = Array.from(optionSet);
            }

            // 限制 4 個選項並洗牌
            finalOptions = shuffle(finalOptions.slice(0, 4));

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