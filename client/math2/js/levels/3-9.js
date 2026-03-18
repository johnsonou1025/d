// js/levels/3-9.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["3-9"] = {
    id: "3-9",
    unitName: "三年級：重量單位",
    levelName: "公克與公斤的換算",
    type: "weight_g_kg",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3);
            let prompt = "";
            let correctStr = "";
            let optionSet = new Set();

            if (mode === 1) {
                // 【模式 1】公克 → 公斤 (整數換算)
                const kg = randInt(1, 9);
                const g = kg * 1000;
                prompt = `${g} 公克等於幾公斤？`;
                correctStr = `${kg} 公斤`;

                optionSet.add(correctStr);
                while (optionSet.size < 4) {
                    const wrongKg = [kg * 10, kg / 10, kg + 1, kg + 2][randInt(0, 3)];
                    if (wrongKg > 0 && Number.isInteger(wrongKg)) {
                        optionSet.add(`${wrongKg} 公斤`);
                    } else {
                        optionSet.add(`${randInt(1, 15)} 公斤`);
                    }
                }

            } else if (mode === 2) {
                // 【模式 2】公斤 → 公克
                const kg = randInt(1, 12);
                const g = kg * 1000;
                prompt = `${kg} 公斤等於幾公克？`;
                correctStr = `${g} 公克`;

                optionSet.add(correctStr);
                while (optionSet.size < 4) {
                    // 模擬常見錯誤：少一個 0 或多一個 0
                    const distractors = [kg * 100, kg * 10000, g + 500, g - 500];
                    const cand = distractors[randInt(0, distractors.length - 1)];
                    if (cand > 0) optionSet.add(`${cand} 公克`);
                }

            } else {
                // 【模式 3】重量估測 (動態隨機物體)
                const items = [
                    { name: "一顆西瓜", weight: 3000, label: "3 公斤的西瓜" },
                    { name: "一隻大象", weight: 5000000, label: "5 公噸的大象" },
                    { name: "一枚硬幣", weight: 5, label: "5 公克的硬幣" },
                    { name: "一包食鹽", weight: 1000, label: "1 公斤的食鹽" },
                    { name: "一隻小貓", weight: 2000, label: "2 公斤的小貓" },
                    { name: "一支鉛筆", weight: 10, label: "10 公克的鉛筆" },
                    { name: "一顆蘋果", weight: 200, label: "200 公克的蘋果" }
                ];

                // 隨機選 4 個不重複的物體
                const selectedItems = [];
                const tempItems = [...items];
                while (selectedItems.length < 4) {
                    const idx = randInt(0, tempItems.length - 1);
                    selectedItems.push(tempItems.splice(idx, 1)[0]);
                }

                const isAskingHeavy = Math.random() < 0.5;
                prompt = isAskingHeavy ? "下列哪一個東西「最重」？" : "下列哪一個東西「最輕」？";

                // 排序找出正確答案
                const sorted = [...selectedItems].sort((a, b) => b.weight - a.weight);
                const target = isAskingHeavy ? sorted[0] : sorted[sorted.length - 1];

                correctStr = target.label;
                selectedItems.forEach(item => optionSet.add(item.label));
            }

            // 隨機洗牌選項
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