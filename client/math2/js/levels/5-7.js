// js/levels/5-7.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["5-7"] = {
    id: "5-7",
    unitName: "五年級：未知數",
    levelName: "等式列式與求解",
    type: "unknown_equation",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3); // 1: 加減互逆, 2: 乘除互逆, 3: 兩步驟運算 (進階)
            let prompt = "";
            let correct = 0;
            let optionSet = new Set();

            if (mode === 1) {
                // 【模式 1】加減法未知數
                const type = randInt(1, 3);
                const a = randInt(20, 150);
                const b = randInt(10, a - 5);

                if (type === 1) { // x + b = a
                    prompt = `一個數加上 ${b} 等於 ${a}，請問這個數是多少？`;
                    correct = a - b;
                } else if (type === 2) { // x - b = a
                    prompt = `有一袋糖果，分掉 ${b} 顆後還剩下 ${a} 顆，原有多少顆？`;
                    correct = a + b;
                } else { // a - x = b
                    prompt = `老師有 ${a} 元，買書花掉若干元後剩下 ${b} 元，請問買書花多少元？`;
                    correct = a - b;
                }

            } else if (mode === 2) {
                // 【模式 2】乘除法未知數
                const type = randInt(1, 2);
                const q = randInt(3, 15);
                const d = randInt(4, 12);
                const total = q * d;

                if (type === 1) { // x * d = total
                    prompt = `一箱飲料有 ${d} 瓶，若干箱共有 ${total} 瓶，請問共有幾箱？`;
                    correct = q;
                } else { // total / x = q
                    prompt = `將 ${total} 公升的水平均分裝成若干桶，每桶裝 ${q} 公升，共裝幾桶？`;
                    correct = d;
                }

            } else {
                // 【模式 3】兩步驟運算：ax + b = c (五年級挑戰題)
                const x = randInt(4, 9);
                const a = randInt(2, 6);
                const b = randInt(5, 20);
                const c = a * x + b;
                prompt = `某數的 ${a} 倍再加上 ${b} 等於 ${c}，請問某數是多少？`;
                correct = x;
            }

            optionSet.add(String(correct));

            // --- 智慧干擾項設計 ---
            while (optionSet.size < 4) {
                let distractor = 0;
                const errorType = randInt(1, 3);

                if (errorType === 1) {
                    // 運算符號誤用 (例如該減卻用加)
                    const nums = prompt.match(/\d+/g);
                    if (nums && nums.length >= 2) {
                        distractor = parseInt(nums[0]) + parseInt(nums[1]);
                    }
                } else {
                    // 鄰近數值或常見乘法錯誤
                    distractor = correct + [1, -1, 10, -10, 2][randInt(0, 4)];
                }

                if (distractor > 0 && distractor !== correct) {
                    optionSet.add(String(distractor));
                }
            }

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