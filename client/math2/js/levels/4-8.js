// js/levels/4-8.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["4-8"] = {
    id: "4-8",
    unitName: "四年級：面積計算",
    levelName: "長方形與正方形面積",
    type: "rectangle_area",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3); // 1: 長方形, 2: 正方形, 3: 逆向思考/單位觀念
            let prompt = "";
            let correct = 0;
            let perimeter = 0; // 周長，用作智慧干擾項
            let optionSet = new Set();

            if (mode === 1) {
                // 【模式 1】長方形面積
                const length = randInt(4, 15);
                const width = randInt(2, length - 1);
                correct = length * width;
                perimeter = (length + width) * 2;
                prompt = `有一個長方形，長 ${length} 公分、寬 ${width} 公分，請問面積是多少「平方公分」？`;

            } else if (mode === 2) {
                // 【模式 2】正方形面積
                const side = randInt(3, 12);
                correct = side * side;
                perimeter = side * 4;
                prompt = `一個邊長 ${side} 公方的正方形，請問面積是多少「平方公分」？`;

            } else {
                // 【模式 3】逆向思考：已知面積求邊長
                const sides = [2, 3, 4, 5, 6, 7, 8, 9, 10];
                const s = sides[randInt(0, sides.length - 1)];
                const area = s * s;
                prompt = `一個正方形的面積是 ${area} 平方公分，請問它的「邊長」是多少公分？`;
                correct = s;
                perimeter = area * 2; // 隨機干擾
            }

            optionSet.add(String(correct));

            // --- 智慧干擾項設計 ---
            // 1. 誤用周長公式 (最常見錯誤)
            if (perimeter > 0 && perimeter !== correct) {
                optionSet.add(String(perimeter));
            }

            // 2. 只有長+寬 (忘了乘2也忘了相乘)
            if (mode === 1) {
                const parts = prompt.match(/\d+/g);
                if (parts) optionSet.add(String(parseInt(parts[0]) + parseInt(parts[1])));
            }

            // 3. 補足 4 個選項
            while (optionSet.size < 4) {
                const offset = [1, 2, 5, 10, -1, -2][randInt(0, 5)];
                const cand = correct + offset;
                if (cand > 0 && !optionSet.has(String(cand))) {
                    optionSet.add(String(cand));
                }
            }

            const finalOptions = shuffle(Array.from(optionSet));

            list.push({
                type: "choice",
                prompt: prompt,
                options: finalOptions.map(v => (mode === 3 ? `${v} 公分` : `${v} 平方公分`)),
                correctIndex: finalOptions.indexOf(String(correct))
            });
        }
        return list;
    }
};