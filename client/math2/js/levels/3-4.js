// js/levels/3-4.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["3-4"] = {
    id: "3-4",
    unitName: "三年級：除法入門",
    levelName: "包含除與等分除",
    type: "division_grouping",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];
        // 物品情境池
        const scenarios = [
            { item: "顆草莓", unit: "個一盤", container: "盤" },
            { item: "枝鉛筆", unit: "枝裝一盒", container: "盒" },
            { item: "球巧克力", unit: "球裝一袋", container: "袋" },
            { item: "片餅乾", unit: "片放一疊", container: "疊" },
            { item: "位小朋友", unit: "位分一組", container: "組" }
        ];

        for (let i = 0; i < this.questionCount; i++) {
            const groups = randInt(2, 9);    // 答案（組數）
            const perGroup = randInt(2, 9);  // 每組個數
            const total = groups * perGroup; // 總數

            const scene = scenarios[randInt(0, scenarios.length - 1)];

            // 隨機切換問法：包含除或等分除
            const mode = randInt(1, 2);
            let prompt = "";
            let correct = 0;

            if (mode === 1) {
                // 【模式 1】包含除：求組數
                prompt = `有 ${total} ${scene.item}，每 ${perGroup} ${scene.unit}，一共可以分成幾${scene.container}？`;
                correct = groups;
            } else {
                // 【模式 2】等分除：求每組幾個
                prompt = `有 ${total} ${scene.item}，平分放到 ${groups} 個${scene.container}裡，一${scene.container}有幾${scene.item.replace('位', '')}？`;
                correct = perGroup;
            }

            const optionSet = new Set();
            optionSet.add(String(correct));

            // --- 智慧干擾項生成 ---
            while (optionSet.size < 4) {
                let distractor;
                const errorType = randInt(1, 3);

                if (errorType === 1) {
                    // 錯誤類型 1：除數與商看反（例如 24/6 答案應該是 4，但選項放 6）
                    distractor = (mode === 1) ? perGroup : groups;
                } else if (errorType === 2) {
                    // 錯誤類型 2：計算誤差 ±1
                    distractor = correct + (randInt(0, 1) ? 1 : -1);
                } else {
                    // 錯誤類型 3：九九乘法附近的數字
                    distractor = randInt(2, 9);
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