// js/levels/2-6.js（最終修正版）
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["2-6"] = {
    id: "2-6",
    unitName: "二年級：長度單位",
    levelName: "公里公尺",
    type: "length_km_m",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3);

            if (mode === 1) {
                // ✅ 公尺 → 公里（精確到小數點後三位）
                const m = randInt(1000, 9999);  // 1000~9999公尺
                const km = m / 1000;            // 精確計算，不四捨五入
                const correctStr = km.toFixed(3) + " 公里";  // 固定三位小數

                const prompt = `${m} 公尺等於幾公里？`;

                // 生成其他選項（也用三位小數）
                const optionValues = new Set([correctStr]);
                while (optionValues.size < 4) {
                    const offset = randInt(-100, 100);  // ±0.1~0.1公里
                    const candM = m + offset;
                    const candKm = candM / 1000;
                    const candStr = candKm.toFixed(3) + " 公里";
                    if (candStr !== correctStr) {
                        optionValues.add(candStr);
                    }
                }

                const optionsArray = shuffle(Array.from(optionValues));
                const correctIndex = optionsArray.indexOf(correctStr);

                list.push({
                    type: "choice",
                    prompt,
                    options: optionsArray,
                    correctIndex
                });

            } else if (mode === 2) {
                // 公里 → 公尺（整數）
                const km = randInt(1, 20);
                const m = km * 1000;
                const correctStr = `${m} 公尺`;
                const prompt = `${km} 公里等於幾公尺？`;

                const optionValues = new Set([correctStr]);
                while (optionValues.size < 4) {
                    const offset = randInt(-1000, 1000);
                    const candM = m + offset;
                    if (candM > 0) {
                        const candStr = `${candM} 公尺`;
                        if (candStr !== correctStr) optionValues.add(candStr);
                    }
                }

                const optionsArray = shuffle(Array.from(optionValues));
                const correctIndex = optionsArray.indexOf(correctStr);

                list.push({
                    type: "choice",
                    prompt,
                    options: optionsArray,
                    correctIndex
                });

            } else {
                // 比較大小
                const prompt = "下列哪個距離最遠？";
                const options = [
                    "3 公里",
                    "3343 公尺",    // = 3.343公里
                    "3.34 公里",    // = 3.34公里  
                    "3000 公尺"     // = 3公里
                ];
                const correctIndex = 1;  // 3343公尺最遠

                list.push({
                    type: "choice",
                    prompt,
                    options,
                    correctIndex
                });
            }
        }

        return list;
    }
};
