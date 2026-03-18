// js/levels/4-6.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["4-6"] = {
    id: "4-6",
    unitName: "四年級：平行垂直",
    levelName: "平行線與垂直線概念",
    type: "parallel_perpendicular",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3); // 1: 基本定義, 2: 性質判斷, 3: 生活應用
            let prompt = "";
            let correctStr = "";
            let optionSet = new Set();

            if (mode === 1) {
                // 【模式 1】基本定義
                const isVertical = Math.random() < 0.5;
                if (isVertical) {
                    prompt = "兩條直線相交成直角（90°），我們說這兩條線互相？";
                    correctStr = "垂直";
                } else {
                    prompt = "在平面上，兩條直線無論怎麼延長都不會相交，這兩條線互相？";
                    correctStr = "平行";
                }
                optionSet.add("垂直");
                optionSet.add("平行");
                optionSet.add("重合");
                optionSet.add("交叉但不垂直");

            } else if (mode === 2) {
                // 【模式 2】延伸性質 (四年級的大重點)
                const subMode = randInt(1, 2);
                if (subMode === 1) {
                    prompt = "如果甲線垂直於丙線，乙線也垂直於丙線，那麼甲、乙兩線的關係是？";
                    correctStr = "互相平行";
                    optionSet.add("互相平行");
                    optionSet.add("互相垂直");
                    optionSet.add("互相交錯");
                    optionSet.add("沒有關係");
                } else {
                    prompt = "在兩條平行線之間，畫出所有與它們垂直的線段，這些線段的長度？";
                    correctStr = "全都一樣長";
                    optionSet.add("全都一樣長");
                    optionSet.add("越來越長");
                    optionSet.add("長短不一");
                    optionSet.add("無法比較");
                }

            } else {
                // 【模式 3】生活場景應用
                const scenarios = [
                    { q: "數學作業本上的橫格線，它們彼此之間的關係通常是？", a: "平行" },
                    { q: "時鐘在 3 點整的時候，時針與分針的關係是？", a: "垂直" },
                    { q: "十字路口的兩條馬路正好正交，這兩條馬路的關係是？", a: "垂直" },
                    { q: "火車鐵軌的兩條鋼軌，它們彼此之間的關係是？", a: "平行" },
                    { q: "正方形相鄰的兩條邊，它們的關係是？", a: "垂直" }
                ];
                const selected = scenarios[randInt(0, scenarios.length - 1)];
                prompt = selected.q;
                correctStr = selected.a;
                optionSet.add("平行");
                optionSet.add("垂直");
                optionSet.add("相交但不垂直");
                optionSet.add("不確定");
            }

            // --- 確保包含正確答案並洗牌 ---
            optionSet.add(correctStr);
            let finalOptions = Array.from(optionSet);

            // 保持 4 個選項
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