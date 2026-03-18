// js/levels/5-8.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["5-8"] = {
    id: "5-8",
    unitName: "五年級：線對稱圖形",
    levelName: "對稱性質與對稱軸",
    type: "line_symmetry",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3); // 1: 對稱軸數量, 2: 對稱性質判斷, 3: 生活與特殊圖形
            let prompt = "";
            let correctStr = "";
            let optionSet = new Set();

            if (mode === 1) {
                // 【模式 1】常見幾何圖形的對稱軸數量
                const shapes = [
                    { n: "正方形", c: "4 條" },
                    { n: "長方形", c: "2 條" },
                    { n: "等腰三角形", c: "1 條" },
                    { n: "正三角形", c: "3 條" },
                    { n: "圓形", c: "無限多條" },
                    { n: "等腰梯形", c: "1 條" },
                    { n: "菱形", c: "2 條" },
                    { n: "平行四邊形", c: "0 條" }
                ];
                const selected = shapes[randInt(0, shapes.length - 1)];
                prompt = `請問「${selected.n}」共有幾條對稱軸？`;
                correctStr = selected.c;
                ["0 條", "1 條", "2 條", "3 條", "4 條", "無限多條"].forEach(o => optionSet.add(o));

            } else if (mode === 2) {
                // 【模式 2】對稱性質（點、線、角）
                const sub = randInt(1, 3);
                if (sub === 1) {
                    prompt = "在線對稱圖形中，連接一對「對稱點」的線段會被對稱軸？";
                    correctStr = "垂直平分";
                    optionSet.add("垂直平分");
                    optionSet.add("平行");
                    optionSet.add("隨意相交");
                    optionSet.add("完全重合");
                } else if (sub === 2) {
                    prompt = "將線對稱圖形沿著對稱軸對折後，兩邊的圖形會？";
                    correctStr = "完全重合";
                    optionSet.add("完全重合");
                    optionSet.add("大小不同");
                    optionSet.add("左右顛倒但不重合");
                    optionSet.add("面積變兩倍");
                } else {
                    prompt = "線對稱圖形中，兩組對應的「對稱角」大小關係為何？";
                    correctStr = "一樣大";
                    optionSet.add("一樣大");
                    optionSet.add("相加 180 度");
                    optionSet.add("左邊比較大");
                    optionSet.add("不一定");
                }

            } else {
                // 【模式 3】生活與英文字母應用
                const letters = [
                    { l: "字母 A", c: "1 條" },
                    { l: "字母 H", c: "2 條" },
                    { l: "字母 O", c: "2 條 (或視為無限)" },
                    { l: "字母 E", c: "1 條" },
                    { l: "字母 N", c: "0 條" },
                    { l: "字母 M", c: "1 條" }
                ];
                const selected = letters[randInt(0, letters.length - 1)];
                prompt = `請問英文字母「${selected.l}」是線對稱圖形嗎？若是，有幾條對稱軸？`;
                correctStr = selected.c === "0 條" ? "不是對稱圖形" : selected.c;

                optionSet.add("1 條");
                optionSet.add("2 條");
                optionSet.add("不是對稱圖形");
                optionSet.add("4 條");
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