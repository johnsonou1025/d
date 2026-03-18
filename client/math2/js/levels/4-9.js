// js/levels/4-9.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["4-9"] = {
    id: "4-9",
    unitName: "四年級：立體圖形",
    levelName: "長方體與正方體認識",
    type: "solid_shapes",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3); // 1: 數量計算, 2: 圖形性質, 3: 關係判斷
            let prompt = "";
            let correctStr = "";
            let optionSet = new Set();

            if (mode === 1) {
                // 【模式 1】面、邊、頂點的數量 (考驗基本定義)
                const sub = randInt(1, 3);
                const shape = Math.random() < 0.5 ? "長方體" : "正方體";
                if (sub === 1) {
                    prompt = `${shape}一共有幾個「面」？`;
                    correctStr = "6 個";
                } else if (sub === 2) {
                    prompt = `${shape}一共有幾個「頂點」？`;
                    correctStr = "8 個";
                } else {
                    prompt = `${shape}一共有幾條「邊」？`;
                    correctStr = "12 條";
                }
                ["6 個", "8 個", "12 個", "6 條", "8 條", "12 條"].forEach(o => optionSet.add(o));

            } else if (mode === 2) {
                // 【模式 2】圖形構成性質
                const sub = randInt(1, 2);
                if (sub === 1) {
                    prompt = "關於「正方體」的敘述，哪一個是正確的？";
                    correctStr = "每個面都是一樣大的正方形";
                    optionSet.add(correctStr);
                    optionSet.add("每個面都是長方形");
                    optionSet.add("只有相對的面一樣大");
                    optionSet.add("有 12 個頂點");
                } else {
                    prompt = "「長方體」中，互相「相對」的面有什麼特性？";
                    correctStr = "形狀和大小都完全相同";
                    optionSet.add(correctStr);
                    optionSet.add("形狀不同但大小相同");
                    optionSet.add("形狀相同但大小不同");
                    optionSet.add("垂直但不相等");
                }

            } else {
                // 【模式 3】綜合邏輯判斷
                const sub = randInt(1, 2);
                if (sub === 1) {
                    prompt = "長方體中，與同一個頂點相接的邊共有幾條？";
                    correctStr = "3 條";
                    optionSet.add("3 條");
                    optionSet.add("4 條");
                    optionSet.add("6 條");
                    optionSet.add("8 條");
                } else {
                    prompt = "正方體的 12 條邊中，它們的長度？";
                    correctStr = "每一條都一樣長";
                    optionSet.add(correctStr);
                    optionSet.add("只有相對的邊一樣長");
                    optionSet.add("長寬高都不一樣");
                    optionSet.add("只有 4 條邊一樣長");
                }
            }

            // --- 確保包含正確答案並洗牌 ---
            optionSet.add(correctStr);
            let finalOptions = Array.from(optionSet);

            // 如果選項太多（來自模式 1），隨機刪除
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