// js/levels/6-4.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["6-4"] = {
    id: "6-4",
    unitName: "六年級：圓周率",
    levelName: "圓周長與圓面積",
    type: "circle_circumference_area",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];
        const PI = 3.14;

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3); // 1: 求周長, 2: 求面積, 3: 逆推(周長求直徑/半徑)
            let prompt = "";
            let correctStr = "";
            let optionSet = new Set();

            if (mode === 1) {
                // 【模式 1】求圓周長 (L = d * π)
                const isRadiusGiven = Math.random() < 0.5;
                const val = randInt(2, 10); // 半徑或直徑
                const circumference = isRadiusGiven ? (val * 2 * PI) : (val * PI);
                const finalC = parseFloat(circumference.toFixed(2));

                prompt = `一個圓的${isRadiusGiven ? '半徑' : '直徑'}是 ${val} 公分，請問它的「圓周長」大約是多少公分？(π=3.14)`;
                correctStr = String(finalC);

                optionSet.add(correctStr);
                optionSet.add(String(parseFloat((val * PI).toFixed(2)))); // 陷阱：若是半徑則少乘2
                optionSet.add(String(parseFloat((val * val * PI).toFixed(2)))); // 陷阱：帶入面積公式
                optionSet.add(String(val * 2)); // 陷阱：只算直徑忘了乘PI

            } else if (mode === 2) {
                // 【模式 2】求圓面積 (A = r * r * π)
                const radius = randInt(2, 10);
                const area = radius * radius * PI;
                const finalA = parseFloat(area.toFixed(2));

                prompt = `一個圓的「半徑」是 ${radius} 公分，請問它的「圓面積」大約是多少平方公分？(π=3.14)`;
                correctStr = String(finalA);

                optionSet.add(correctStr);
                optionSet.add(String(parseFloat((radius * 2 * PI).toFixed(2)))); // 陷阱：帶入周長公式
                optionSet.add(String(parseFloat((radius * PI).toFixed(2))));   // 陷阱：忘了平方
                optionSet.add(String(radius * radius)); // 陷阱：忘了乘PI

            } else {
                // 【模式 3】逆推 (由周長求直徑)
                const diameter = randInt(2, 12);
                const circumference = parseFloat((diameter * PI).toFixed(2));

                prompt = `已知一個圓的「圓周長」是大約 ${circumference} 公分，請問它的「直徑」大約是多少公分？(π=3.14)`;
                correctStr = String(diameter);

                optionSet.add(correctStr);
                optionSet.add(String(diameter / 2)); // 陷阱：算出半徑
                optionSet.add(String(diameter * 2));
                optionSet.add(String(Math.round(circumference / 2)));
            }

            // --- 補齊隨機選項與洗牌 ---
            const finalCorrect = correctStr;
            while (optionSet.size < 4) {
                const fake = (randInt(5, 50) * 3.14).toFixed(1);
                optionSet.add(String(parseFloat(fake)));
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