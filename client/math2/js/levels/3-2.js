// js/levels/3-2.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["3-2"] = {
    id: "3-2",
    unitName: "三年級：應用題",
    levelName: "兩步驟加減混合",
    type: "word_two_step",
    questionCount: 8,
    minCorrectToPass: 6,

    generateQuestions() {
        // 定義不同的題目結構模組
        const templates = [
            // 模式 1: (A + B) - C (先合起來再扣掉)
            () => {
                const a = randInt(100, 300);
                const b = randInt(50, 200);
                const c = randInt(30, a + b - 20);
                const step1 = a + b;
                const correct = step1 - c;
                const scenarios = [
                    `果園採了 ${a} 個蘋果和 ${b} 個梨子，賣掉 ${c} 個水果後，還剩下幾個？`,
                    `小華存了 ${a} 元，爸爸又給他 ${b} 元，他買書花了 ${c} 元，現在小華有幾元？`
                ];
                return {
                    prompt: scenarios[randInt(0, scenarios.length - 1)],
                    correct, step1, a, b, c
                };
            },
            // 模式 2: A - (B + C) 或 A - B - C (連減)
            () => {
                const a = randInt(400, 800);
                const b = randInt(50, 150);
                const c = randInt(50, 150);
                const step1 = a - b;
                const correct = a - b - c;
                const scenarios = [
                    `一條繩子長 ${a} 公分，剪掉 ${b} 公分做手工，又剪掉 ${c} 公分繫禮物，還剩幾公分？`,
                    `遊樂園有 ${a} 人，下午走掉 ${b} 人，傍晚又走掉 ${c} 人，現在園內有幾人？`
                ];
                return {
                    prompt: scenarios[randInt(0, scenarios.length - 1)],
                    correct, step1, a, b, c
                };
            },
            // 模式 3: (A - B) + C (先減少再增加)
            () => {
                const a = randInt(200, 500);
                const b = randInt(50, 150);
                const c = randInt(80, 200);
                const step1 = a - b;
                const correct = step1 + c;
                const scenarios = [
                    `公車上原本有 ${a} 人，到站後下去 ${b} 人，又上來 ${c} 人，現在車上有幾人？`,
                    `停車場有 ${a} 輛車，開走 ${b} 輛後，又開進來 ${c} 輛，現在有幾輛車？`
                ];
                return {
                    prompt: scenarios[randInt(0, scenarios.length - 1)],
                    correct, step1, a, b, c
                };
            }
        ];

        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            const t = templates[randInt(0, templates.length - 1)]();
            const correct = t.correct;
            const optionSet = new Set();

            optionSet.add(String(correct));

            // --- 智慧干擾項設計 ---
            // 1. 中間產物（學生只算了一步就當答案）
            optionSet.add(String(t.step1));

            // 2. 運算符號看反（例如 A+B-C 變成 A+B+C 或 A-B-C）
            const wrongCalc = [t.a + t.b + t.c, Math.abs(t.a - t.b - t.c), t.a - t.b + t.c];
            wrongCalc.forEach(val => {
                if (val > 0 && val !== correct) optionSet.add(String(val));
            });

            // 3. 補足 4 個選項（隨機偏移）
            while (optionSet.size < 4) {
                const offset = randInt(-10, 10);
                const cand = correct + offset;
                if (cand > 0 && cand !== correct) optionSet.add(String(cand));
            }

            const finalOptions = shuffle(Array.from(optionSet));

            list.push({
                type: "choice",
                prompt: t.prompt,
                options: finalOptions,
                correctIndex: finalOptions.indexOf(String(correct))
            });
        }
        return list;
    }
};