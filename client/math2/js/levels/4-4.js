// js/levels/4-4.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["4-4"] = {
    id: "4-4",
    unitName: "四年級：角度測量",
    levelName: "量角器與角度分類",
    type: "angle_measurement",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3); // 1: 角度分類, 2: 操作觀念, 3: 角度計算與讀數
            let prompt = "";
            let correctStr = "";
            let optionSet = new Set();

            if (mode === 1) {
                // 【模式 1】角度命名與分類
                const angle = randInt(10, 179);
                prompt = `測量出來的角度是 ${angle} 度，請問這屬於哪一種角？`;

                if (angle < 90) {
                    correctStr = "銳角";
                } else if (angle === 90) {
                    correctStr = "直角";
                } else {
                    correctStr = "鈍角";
                }
                ["銳角", "直角", "鈍角", "平角"].forEach(o => optionSet.add(o));

            } else if (mode === 2) {
                // 【模式 2】量角器操作觀念
                const sub = randInt(1, 2);
                if (sub === 1) {
                    prompt = "使用量角器量角時，量角器的「中心點」必須對準角的哪裡？";
                    correctStr = "頂點";
                    optionSet.add("頂點");
                    optionSet.add("邊長");
                    optionSet.add("開口方向");
                    optionSet.add("隨便一個位置");
                } else {
                    prompt = "量角器的「0度線」應該要對準角的哪一部分？";
                    correctStr = "其中一條邊";
                    optionSet.add("其中一條邊");
                    optionSet.add("頂點");
                    optionSet.add("中心點");
                    optionSet.add("角的開口");
                }

            } else {
                // 【模式 3】角度計算與刻度讀取陷阱
                const sub = randInt(1, 3);
                if (sub === 1) {
                    const a = randInt(30, 60);
                    const b = randInt(30, 60);
                    prompt = `兩個角度分別是 ${a} 度和 ${b} 度，把它們拼在一起後的總角度是多少度？`;
                    correctStr = `${a + b} 度`;
                    optionSet.add(`${a + b} 度`);
                    optionSet.add(`${Math.abs(a - b)} 度`);
                    optionSet.add(`${180 - a - b} 度`);
                    optionSet.add(`${90} 度`);
                } else if (sub === 2) {
                    prompt = "當量角器顯示為「180 度」時，這個角又被稱為什麼？";
                    correctStr = "平角";
                    optionSet.add("平角");
                    optionSet.add("周角");
                    optionSet.add("直角");
                    optionSet.add("鈍角");
                } else {
                    // 內外圈讀數陷阱 (4年級常見錯誤)
                    const actual = 60;
                    const trap = 120; // 180 - 60
                    prompt = "小明量角時沒注意看刻度，把 60 度的角看成另一圈的讀數，他可能會看成幾度？";
                    correctStr = "120 度";
                    optionSet.add("120 度");
                    optionSet.add("60 度");
                    optionSet.add("180 度");
                    optionSet.add("90 度");
                }
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