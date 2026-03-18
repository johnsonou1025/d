// js/levels/2-8.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["2-8"] = {
    id: "2-8",
    unitName: "二年級：時間計算",
    levelName: "幾小時幾分後",
    type: "time_arithmetic",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 2);
            let prompt = "";
            let correctStr = "";
            let optionSet = new Set();

            if (mode === 1) {
                // 【模式 1】時間點 + 時間量 (進位計算)
                const startHour = randInt(1, 11); // 早上或下午的時段
                const startMin = randInt(0, 5) * 10; // 0, 10, 20... 較好閱讀
                const addHour = randInt(1, 4);
                const addMin = randInt(1, 5) * 10;

                const totalMinutes = (startHour * 60 + startMin) + (addHour * 60 + addMin);
                let finalHour = Math.floor(totalMinutes / 60);
                const finalMin = totalMinutes % 60;

                // 為了教學單純化，若超過 24 小時則減去 24
                if (finalHour > 24) finalHour -= 24;

                const startStr = `${startHour} 時 ${startMin === 0 ? "00" : startMin} 分`;
                correctStr = `${finalHour} 時 ${finalMin === 0 ? "00" : finalMin} 分`;
                prompt = `現在是 ${startStr}，再過 ${addHour} 小時 ${addMin} 分鐘後是幾時幾分？`;

            } else {
                // 【模式 2】時間單位換算 (幾分 = 幾小時幾分)
                const hours = randInt(1, 3);
                const mins = randInt(5, 55);
                const totalM = hours * 60 + mins;

                correctStr = `${hours} 小時 ${mins} 分鐘`;
                prompt = `${totalM} 分鐘可以說是幾小時幾分鐘？`;
            }

            // --- 答案隨機：生成干擾項 ---
            optionSet.add(correctStr);

            while (optionSet.size < 4) {
                let distractor = "";
                if (mode === 1) {
                    // 時間點干擾：差一小時、或分鐘沒進位
                    const hOffset = randInt(-1, 2);
                    const mOffset = randInt(-1, 1) * 10;

                    // 根據正確答案隨機微調
                    const parts = correctStr.match(/\d+/g);
                    let h = parseInt(parts[0]) + hOffset;
                    let m = parseInt(parts[1]) + mOffset;

                    if (h <= 0) h = 12;
                    if (m < 0) m = 50;
                    if (m >= 60) m = 0;

                    distractor = `${h} 時 ${m === 0 ? "00" : m} 分`;
                } else {
                    // 單位換算干擾：看錯 60 進制（如 100 分看成 1 小時 0 分）
                    const parts = correctStr.match(/\d+/g);
                    let h = parseInt(parts[0]);
                    let m = parseInt(parts[1]);
                    const choice = randInt(1, 3);
                    if (choice === 1) h += 1;
                    else if (choice === 2) m += 10;
                    else m = Math.abs(m - 10);

                    distractor = `${h} 小時 ${m} 分鐘`;
                }

                if (distractor !== correctStr) {
                    optionSet.add(distractor);
                }
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