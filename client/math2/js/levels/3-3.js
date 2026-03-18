// js/levels/3-3.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["3-3"] = {
    id: "3-3",
    unitName: "三年級：除法入門",
    levelName: "等分除（平均分給）",
    type: "division_sharing",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];
        // 生活化情境池
        const scenarios = [
            { item: "顆糖果", unit: "人", action: "平均分給" },
            { item: "張貼紙", unit: "個小朋友", action: "平分給" },
            { item: "公分長的繩子", unit: "段", action: "剪成" },
            { item: "塊餅乾", unit: "個盒子", action: "平均裝進" },
            { item: "元錢", unit: "個人", action: "平分給" }
        ];

        for (let i = 0; i < this.questionCount; i++) {
            // 先決定「答案 (商)」與「除數」，再反推「總數 (被除數)」
            // 這樣能保證 100% 整除，且數值符合三年級心算範圍
            const correct = randInt(2, 12);  // 每個分到 2~12 個
            const groups = randInt(2, 9);    // 分給 2~9 組
            const realTotal = correct * groups;

            const scene = scenarios[randInt(0, scenarios.length - 1)];
            const prompt = `有 ${realTotal}${scene.item}，${scene.action} ${groups} ${scene.unit}，每${scene.unit.replace('個小朋友', '人').replace('個盒子', '盒')}可以分到幾${scene.item.replace('元錢', '元').replace('公分長的繩子', '公分')}？`;

            const optionSet = new Set();
            optionSet.add(String(correct));

            // --- 智慧干擾項生成 ---
            while (optionSet.size < 4) {
                let distractor;
                const errorType = randInt(1, 3);

                if (errorType === 1) {
                    // 錯誤類型 1：九九乘法附近的誤差 (±1 或 ±2)
                    distractor = correct + (randInt(0, 1) ? 1 : -1) * randInt(1, 2);
                } else if (errorType === 2) {
                    // 錯誤類型 2：把除數 (groups) 當成答案
                    distractor = groups;
                } else {
                    // 錯誤類型 3：隨機 2~15 的數字
                    distractor = randInt(2, 15);
                }

                if (distractor > 1 && distractor !== correct) {
                    optionSet.add(String(distractor));
                }
            }

            // 隨機洗牌選項
            const finalOptions = shuffle(Array.from(optionSet));

            list.push({
                type: "choice",
                prompt: prompt,
                options: finalOptions,
                correctIndex: finalOptions.indexOf(String(correct))
            });
        }
        return list;
    }
};