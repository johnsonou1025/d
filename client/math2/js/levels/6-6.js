// js/levels/6-6.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["6-6"] = {
    id: "6-6",
    unitName: "六年級：比例尺",
    levelName: "縮圖、比例尺與實際距離",
    type: "map_scale",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3); // 1: 算實際距離, 2: 算地圖距離, 3: 圖示比例尺觀念
            let prompt = "";
            let correctStr = "";
            let optionSet = new Set();

            if (mode === 1) {
                // 【模式 1】求實際距離 (通常涉及公分轉公尺/公里)
                const cmOnMap = randInt(2, 8);
                const scale = [1000, 5000, 20000, 50000][randInt(0, 3)];
                const realCm = cmOnMap * scale;

                // 決定顯示單位：公尺或公里
                let realValue, unit;
                if (realCm >= 100000) {
                    realValue = realCm / 100000;
                    unit = "公里";
                } else {
                    realValue = realCm / 100;
                    unit = "公尺";
                }

                prompt = `地圖的比例尺是 1:${scale}，若地圖上量得兩地距離為 ${cmOnMap} 公分，實際距離是多少 ${unit}？`;
                correctStr = String(realValue);

                optionSet.add(correctStr);
                optionSet.add(String(realValue * 10)); // 陷阱：單位換算少一個0
                optionSet.add(String(realValue / 10)); // 陷阱：單位換算多一個0
                optionSet.add(String(cmOnMap * scale)); // 陷阱：直接給公分數

            } else if (mode === 2) {
                // 【模式 2】求地圖距離
                const realKm = randInt(1, 10);
                const scale = 50000; // 1cm = 0.5km
                const mapCm = (realKm * 100000) / scale;

                prompt = `實際距離 ${realKm} 公里，在比例尺 1:${scale} 的地圖上，應畫成幾公分？`;
                correctStr = String(mapCm);

                optionSet.add(correctStr);
                optionSet.add(String(mapCm * 2));
                optionSet.add(String(realKm));
                optionSet.add(String(mapCm / 10));

            } else {
                // 【模式 3】圖示/文字比例尺轉化
                const baseCm = 1;
                const realMeters = [50, 100, 200, 500][randInt(0, 3)];
                const scaleRatio = realMeters * 100;

                prompt = `比例尺標示「1 公分代表實際距離 ${realMeters} 公尺」，這可以用比值表示為多少？`;
                correctStr = `1/${scaleRatio}`;

                optionSet.add(correctStr);
                optionSet.add(`1/${realMeters}`); // 陷阱：忘了換算公分
                optionSet.add(`${realMeters}/1`);
                optionSet.add(`1/${scaleRatio * 10}`);
            }

            // --- 補齊隨機項 ---
            const finalCorrect = correctStr;
            while (optionSet.size < 4) {
                const fake = randInt(1, 100);
                optionSet.add(String(fake));
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