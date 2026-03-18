// js/levels/6-9.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["6-9"] = {
    id: "6-9",
    unitName: "六年級：基準量與和差應用",
    levelName: "和差問題與基準比較量",
    type: "reference_comparison",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3); // 1: 標準和差, 2: 基準量(倍數關係), 3: 相對速度/追趕
            let prompt = "";
            let correctStr = "";
            let optionSet = new Set();

            if (mode === 1) {
                // 【模式 1】標準和差問題
                const diff = randInt(2, 10) * 2; // 確保是偶數好除
                const smaller = randInt(10, 30);
                const larger = smaller + diff;
                const total = smaller + larger;

                const findLarger = Math.random() < 0.5;
                prompt = `甲、乙兩數的和是 ${total}，兩數的差是 ${diff}。請問「${findLarger ? '較大' : '較小'}」的數是多少？`;

                const result = findLarger ? larger : smaller;
                correctStr = String(result);

                optionSet.add(correctStr);
                optionSet.add(String(total / 2)); // 陷阱：直接除以 2
                optionSet.add(String(findLarger ? smaller : larger)); // 陷阱：算成另一個數
                optionSet.add(String(total - diff));

            } else if (mode === 2) {
                // 【模式 2】基準量與比較量 (和倍/差倍問題)
                const base = randInt(5, 15) * 5; // 基準量
                const multiple = randInt(2, 4); // 倍數
                const comparison = base * multiple; // 比較量

                const subMode = randInt(1, 2);
                if (subMode === 1) {
                    prompt = `父子兩人年齡相差 ${comparison - base} 歲，已知父親年齡是兒子的 ${multiple} 倍，請問兒子幾歲？`;
                    correctStr = String(base);
                } else {
                    const totalAge = base + comparison;
                    prompt = `甲、乙兩人的零用錢共 ${totalAge} 元，已知甲的錢是乙的 ${multiple} 倍，請問乙有多少元？`;
                    correctStr = String(base);
                }

                optionSet.add(correctStr);
                optionSet.add(String(comparison)); // 陷阱：算成比較量
                optionSet.add(String(base * (multiple + 1)));
                optionSet.add(String(Math.abs(base - 10)));

            } else {
                // 【模式 3】相對速度與追趕 (簡化版)
                const speedDiff = randInt(2, 6) * 10; // 速度差 (km/h)
                const hours = randInt(2, 4);
                const distance = speedDiff * hours;

                prompt = `快車時速比慢車快 ${speedDiff} 公里，兩車同時同地出發，經過 ${hours} 小時後，兩車相距多少公里？`;
                correctStr = String(distance);

                optionSet.add(correctStr);
                optionSet.add(String(speedDiff));
                optionSet.add(String(distance / 2));
                optionSet.add(String(distance + speedDiff));
            }

            // --- 補齊隨機選項 ---
            optionSet.add(correctStr);
            while (optionSet.size < 4) {
                const fake = randInt(5, 100);
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