// js/levels/5-10.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["5-10"] = {
    id: "5-10",
    unitName: "五年級：扇形面積",
    levelName: "圓心角與圓的比例",
    type: "sector_angle",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3); // 1: 基本定義, 2: 角度轉比例, 3: 比例轉角度
            let prompt = "";
            let correctStr = "";
            let optionSet = new Set();

            if (mode === 1) {
                // 【模式 1】扇形基本觀念
                const sub = randInt(1, 2);
                if (sub === 1) {
                    prompt = "關於扇形的敘述，哪一個是正確的？";
                    correctStr = "由兩條半徑和一段圓弧圍成的圖形";
                    optionSet.add(correctStr);
                    optionSet.add("由一條直徑和一段圓弧圍成的圖形");
                    optionSet.add("由三條半徑組成的三角形");
                    optionSet.add("頂點位在圓周上的圖形");
                } else {
                    prompt = "扇形的「頂點」剛好會落在圓的哪一個位置？";
                    correctStr = "圓心";
                    optionSet.add("圓心");
                    optionSet.add("圓周");
                    optionSet.add("半徑的中點");
                    optionSet.add("不一定");
                }

            } else if (mode === 2) {
                // 【模式 2】已知圓心角，求比例
                const angleData = [
                    { a: 45, r: "1/8" },
                    { a: 60, r: "1/6" },
                    { a: 90, r: "1/4" },
                    { a: 120, r: "1/3" },
                    { a: 180, r: "1/2" },
                    { a: 240, r: "2/3" },
                    { a: 270, r: "3/4" }
                ];
                const selected = angleData[randInt(0, angleData.length - 1)];
                prompt = `圓心角為 ${selected.a} 度的扇形，是幾分之幾圓？`;
                correctStr = selected.r + " 圓";

                optionSet.add(correctStr);
                optionSet.add("1/5 圓");
                optionSet.add("1/10 圓");
                optionSet.add("1/12 圓");

            } else {
                // 【模式 3】已知比例，求圓心角 (逆向題)
                const ratioData = [
                    { r: "1/4", a: 90 },
                    { r: "1/8", a: 45 },
                    { r: "1/3", a: 120 },
                    { r: "1/6", a: 60 },
                    { r: "1/2", a: 180 },
                    { r: "1/5", a: 72 },
                    { r: "1/10", a: 36 }
                ];
                const selected = ratioData[randInt(0, ratioData.length - 1)];
                prompt = `一個「${selected.r} 圓」的扇形，其圓心角是多少度？`;
                correctStr = selected.a + " 度";

                optionSet.add(correctStr);
                optionSet.add((selected.a + 10) + " 度");
                optionSet.add((selected.a - 20) + " 度");
                optionSet.add("360 度");
            }

            // --- 確保包含正確答案並洗牌 ---
            optionSet.add(correctStr);
            let finalOptions = Array.from(optionSet);

            while (finalOptions.length > 4) {
                const idx = randInt(0, finalOptions.length - 1);
                if (finalOptions[idx] !== correctStr) finalOptions.splice(idx, 1);
            }

            finalOptions = shuffle(finalOptions);

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