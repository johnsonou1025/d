// js/levels/6-10.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["6-10"] = {
    id: "6-10",
    unitName: "六年級：邏輯應用題",
    levelName: "雞兔同籠與植樹問題",
    type: "logic_problems",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3); // 1: 雞兔同籠, 2: 植樹問題, 3: 工程/速率邏輯
            let prompt = "";
            let correct = 0;
            let optionSet = new Set();

            if (mode === 1) {
                // 【模式 1】雞兔同籠 (假設法)
                const totalHeads = randInt(20, 50);
                const rabbits = randInt(5, totalHeads - 10);
                const chickens = totalHeads - rabbits;
                const totalFeet = (chickens * 2) + (rabbits * 4);

                prompt = `雞兔同籠，共有 ${totalHeads} 個頭，${totalFeet} 隻腳，請問兔子有幾隻？`;
                correct = rabbits;

                optionSet.add(String(correct));
                optionSet.add(String(chickens)); // 陷阱：算成雞的數量
                optionSet.add(String(Math.abs(rabbits - 5)));
                optionSet.add(String(totalHeads / 2));

            } else if (mode === 2) {
                // 【模式 2】植樹問題 (兩端都種)
                const distance = randInt(5, 12) * 10; // 50~120公尺
                const interval = [2, 5, 10][randInt(0, 2)];
                const subMode = randInt(1, 2); // 1: 兩端都種, 2: 封閉圓圈

                if (subMode === 1) {
                    prompt = `在一條長 ${distance} 公尺的道路一旁植樹，每隔 ${interval} 公尺種一棵（兩端都種），共需幾棵樹？`;
                    correct = (distance / interval) + 1;
                    optionSet.add(String(correct));
                    optionSet.add(String(correct - 1)); // 陷阱：忘了加一
                    optionSet.add(String(correct - 2)); // 陷阱：兩端都不種
                } else {
                    prompt = `在一個周長 ${distance} 公尺的圓形花圃周圍植樹，每隔 ${interval} 公尺種一棵，共需幾棵樹？`;
                    correct = (distance / interval);
                    optionSet.add(String(correct));
                    optionSet.add(String(correct + 1)); // 陷阱：多加了一
                }

            } else {
                // 【模式 3】工程問題簡易版
                const daysA = [6, 8, 10, 12][randInt(0, 3)];
                const daysB = daysA * 1.5; // 確保能算出一點邏輯
                prompt = `一項工程，甲獨自做需要 ${daysA} 天完成，乙獨自做需要 ${daysB} 天完成，兩人合作一天可完成工程的幾分之幾？`;

                // 計算 (1/daysA + 1/daysB)
                const common = (daysA * daysB) / 2; // 簡化處理
                const resNum = (1 / daysA + 1 / daysB);
                // 這裡為了方便顯示，改為問「兩人合作幾天完成？」
                const workDays = 1 / (1 / daysA + 1 / daysB);
                prompt = `一項工程，甲獨做 ${daysA} 天完工，乙獨做 ${daysB} 天完工，兩人合作幾天可以完工？`;
                correct = workDays % 1 === 0 ? workDays : workDays.toFixed(1);

                optionSet.add(String(correct));
                optionSet.add(String(daysA + daysB)); // 陷阱：天數直接加總
                optionSet.add(String(Math.abs(daysA - daysB)));
            }

            // --- 整理選項 ---
            const correctStr = String(correct);
            optionSet.add(correctStr);

            while (optionSet.size < 4) {
                const fake = randInt(5, 60);
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