// js/levels/6-8.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["6-8"] = {
    id: "6-8",
    unitName: "六年級：柱體運算",
    levelName: "角柱與圓柱的體積與面積",
    type: "cylinder_prism",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];
        const PI = 3.14;

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3); // 1: 角柱體積, 2: 圓柱體積, 3: 側面積觀念
            let prompt = "";
            let correctStr = "";
            let optionSet = new Set();

            if (mode === 1) {
                // 【模式 1】角柱體積 (底面積已給出)
                const baseArea = randInt(10, 30) * 2;
                const height = randInt(5, 12);
                const volume = baseArea * height;

                prompt = `一個角柱的底面積是 ${baseArea} 平方公分，高是 ${height} 公分，體積是多少立方公分？`;
                correctStr = String(volume);

                optionSet.add(correctStr);
                optionSet.add(String(baseArea + height)); // 陷阱：相加
                optionSet.add(String(volume / 2));       // 陷阱：誤除以 2 (像三角形)
                optionSet.add(String(baseArea * 2 + height));

            } else if (mode === 2) {
                // 【模式 2】圓柱體積 (給半徑)
                const radius = randInt(2, 5);
                const height = randInt(5, 10);
                const baseArea = radius * radius * PI;
                const volume = parseFloat((baseArea * height).toFixed(2));

                prompt = `圓柱的底面半徑是 ${radius} 公分，高是 ${height} 公分，體積是多少立方公分？(π=3.14)`;
                correctStr = String(volume);

                optionSet.add(correctStr);
                optionSet.add(String(radius * 2 * PI * height)); // 陷阱：用周長算體積
                optionSet.add(String(radius * radius * height));    // 陷阱：忘了乘 PI
                optionSet.add(String(parseFloat((radius * PI * height).toFixed(2)))); // 陷阱：半徑沒平方

            } else {
                // 【模式 3】側面積觀念
                const perimeter = randInt(15, 40);
                const height = randInt(5, 15);
                const sideArea = perimeter * height;

                prompt = `已知一個柱體的「底面周長」是 ${perimeter} 公分，高是 ${height} 公分，請問它的「側面積」是多少平方公分？`;
                correctStr = String(sideArea);

                optionSet.add(correctStr);
                optionSet.add(String(perimeter + height));
                optionSet.add(String(sideArea / 2));
                optionSet.add(String(perimeter * 2 + height * 2)); // 陷阱：周長公式
            }

            // --- 選項洗牌與補齊 ---
            optionSet.add(correctStr);
            while (optionSet.size < 4) {
                optionSet.add(String(randInt(50, 500)));
            }

            const finalOptions = shuffle(Array.from(optionSet)).map(String);

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