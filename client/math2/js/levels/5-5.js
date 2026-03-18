// js/levels/5-5.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["5-5"] = {
    id: "5-5",
    unitName: "五年級：多邊形面積",
    levelName: "平行四邊形、三角形與梯形",
    type: "polygon_area",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 4); // 1: 公式觀念, 2: 平行四邊形, 3: 三角形, 4: 梯形
            let prompt = "";
            let correct = 0;
            let optionSet = new Set();

            if (mode === 1) {
                // 【模式 1】公式定義辨析
                const sub = randInt(1, 3);
                if (sub === 1) {
                    prompt = "哪一種圖形的面積計算公式是「(上底＋下底) × 高 ÷ 2」？";
                    correct = "梯形";
                    ["平行四邊形", "三角形", "長方形", "梯形"].forEach(o => optionSet.add(o));
                } else if (sub === 2) {
                    prompt = "計算「三角形」面積時，比起平行四邊形多了一個什麼步驟？";
                    correct = "要除以 2";
                    optionSet.add("要除以 2");
                    optionSet.add("要乘以 2");
                    optionSet.add("要先加底再加高");
                    optionSet.add("不需要除以 2");
                } else {
                    prompt = "平行四邊形的面積公式是？";
                    correct = "底 × 高";
                    optionSet.add("底 × 高");
                    optionSet.add("底 × 高 ÷ 2");
                    optionSet.add("(底 + 高) × 2");
                    optionSet.add("邊長 × 邊長");
                }

            } else if (mode === 2) {
                // 【模式 2】平行四邊形實算
                const base = randInt(10, 20);
                const height = randInt(5, 12);
                prompt = `一個平行四邊形的底是 ${base}cm，高是 ${height}cm，面積是多少 cm²？`;
                correct = base * height;
                optionSet.add(String(correct));
                optionSet.add(String(correct / 2)); // 陷阱：誤除以 2
                optionSet.add(String((base + height) * 2)); // 陷阱：算成周長

            } else if (mode === 3) {
                // 【模式 3】三角形實算
                const base = randInt(10, 20);
                const height = randInt(6, 14);
                prompt = `一個三角形的底是 ${base}cm，高是 ${height}cm，面積是多少 cm²？`;
                correct = (base * height) / 2;
                optionSet.add(String(correct));
                optionSet.add(String(base * height)); // 陷阱：忘了除以 2
                optionSet.add(String(base + height));

            } else {
                // 【模式 4】梯形實算
                const upper = randInt(4, 10);
                const lower = randInt(11, 20);
                const height = randInt(4, 8);
                prompt = `梯形的上底 ${upper}cm、下底 ${lower}cm、高 ${height}cm，面積是多少 cm²？`;
                correct = ((upper + lower) * height) / 2;
                optionSet.add(String(correct));
                optionSet.add(String((upper + lower) * height)); // 陷阱：忘了除以 2
                optionSet.add(String(upper + lower + height));
            }

            // --- 整理選項並補足隨機項 ---
            const correctStr = String(correct);
            optionSet.add(correctStr);

            while (optionSet.size < 4) {
                const fake = randInt(20, 150);
                optionSet.add(String(fake));
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