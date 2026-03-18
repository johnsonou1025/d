// js/levels/2-6.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["2-6"] = {
    id: "2-6",
    unitName: "二年級：長度單位",
    levelName: "公里公尺換算",
    type: "length_km_m",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3);
            let prompt = "";
            let correctStr = "";
            let optionSet = new Set();

            if (mode === 1) {
                // 【模式 1】公尺 → 公里 (含小數)
                const m = randInt(1001, 9999);
                const km = (m / 1000).toFixed(3);
                correctStr = `${km} 公里`;
                prompt = `${m} 公尺等於幾公里？`;

                optionSet.add(correctStr);
                while (optionSet.size < 4) {
                    // 隨機偏移 10~500 公尺產生的干擾項
                    const distKm = ((m + (randInt(0, 1) ? 1 : -1) * randInt(10, 500)) / 1000).toFixed(3);
                    optionSet.add(`${distKm} 公里`);
                }

            } else if (mode === 2) {
                // 【模式 2】公里 → 公尺 (整數)
                const km = randInt(1, 15);
                const m = km * 1000;
                correctStr = `${m} 公尺`;
                prompt = `${km} 公里等於幾公尺？`;

                optionSet.add(correctStr);
                while (optionSet.size < 4) {
                    const distM = m + (randInt(0, 1) ? 1 : -1) * randInt(1, 5) * 100;
                    if (distM > 0) optionSet.add(`${distM} 公尺`);
                }

            } else {
                // 【模式 3】比較大小 (動態隨機生成)
                const baseKm = randInt(2, 5); // 隨機一個公里基準，例如 3 公里
                const baseM = baseKm * 1000;

                // 生成四個接近但不同的長度
                const vals = [
                    { label: `${baseKm} 公里`, val: baseM },
                    { label: `${baseM + randInt(100, 500)} 公尺`, val: baseM + randInt(100, 500) },
                    { label: `${(baseM + randInt(10, 90)) / 1000} 公里`, val: baseM + randInt(10, 90) },
                    { label: `${baseM - randInt(100, 500)} 公尺`, val: baseM - randInt(100, 500) }
                ];

                // 找出最大的作為正確答案
                const maxObj = vals.reduce((prev, current) => (prev.val > current.val) ? prev : current);
                correctStr = maxObj.label;
                prompt = "下列哪個距離「最遠」？";

                vals.forEach(v => optionSet.add(v.label));
            }

            // 隨機洗牌選項
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