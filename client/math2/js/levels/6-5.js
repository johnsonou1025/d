// js/levels/6-5.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["6-5"] = {
    id: "6-5",
    unitName: "六年級：速率",
    levelName: "距離、時間與速率的運算",
    type: "speed_calculation",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3); // 1: 求速率, 2: 求距離, 3: 求時間
            let prompt = "";
            let correctStr = "";
            let optionSet = new Set();

            if (mode === 1) {
                // 【模式 1】求速率 (距離 ÷ 時間)
                const hours = randInt(2, 5);
                const speed = randInt(1, 15) * 5; // 確保好除
                const distance = speed * hours;

                prompt = `某車在 ${hours} 小時內行駛了 ${distance} 公里，請問該車的時速是多少公里？`;
                correctStr = `${speed} km/h`;

                optionSet.add(correctStr);
                optionSet.add(`${distance * hours} km/h`); // 陷阱：距離 × 時間
                optionSet.add(`${distance + hours} km/h`);
                optionSet.add(`${Math.round(hours / distance * 100) / 100} km/h`); // 陷阱：時間 ÷ 距離

            } else if (mode === 2) {
                // 【模式 2】求距離 (速率 × 時間)
                const speed = [60, 80, 100, 50][randInt(0, 3)];
                const hours = randInt(2, 4);
                const distance = speed * hours;

                prompt = `火車的時速是 ${speed} 公里，連續行駛 ${hours} 小時後，共行駛了多少公里？`;
                correctStr = `${distance} 公里`;

                optionSet.add(correctStr);
                optionSet.add(`${speed / hours} 公里`); // 陷阱：速率 ÷ 時間
                optionSet.add(`${speed + hours} 公里`);
                optionSet.add(`${distance + 20} 公里`);

            } else {
                // 【模式 3】求時間 (距離 ÷ 速率)
                const speed = randInt(4, 12) * 10;
                const distance = speed * randInt(2, 5);
                const hours = distance / speed;

                prompt = `一輛巴士的平均時速是 ${speed} 公里，要行駛 ${distance} 公里需要多少小時？`;
                correctStr = `${hours} 小時`;

                optionSet.add(correctStr);
                optionSet.add(`${distance * speed} 小時`); // 陷阱：相乘
                optionSet.add(`${hours + 1} 小時`);
                optionSet.add(`${Math.abs(distance - speed)} 小時`);
            }

            // --- 整理選項與洗牌 ---
            const finalCorrect = correctStr;
            while (optionSet.size < 4) {
                const fake = randInt(5, 200);
                optionSet.add(`${fake} ${mode === 1 ? 'km/h' : (mode === 2 ? '公里' : '小時')}`);
            }

            const finalOptions = shuffle(Array.from(optionSet)).map(String);

            list.push({
                type: "choice",
                prompt: prompt,
                options: finalOptions,
                correctIndex: finalOptions.indexOf(finalCorrect)
            });
        }
        return list;
    }
};