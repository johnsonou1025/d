// js/levels/2-1.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["2-1"] = {
    id: "2-1",
    unitName: "二年級：位值概念",
    levelName: "三位數位值",
    type: "place_value",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];
        // 這裡不重複定義 randInt, 直接使用 main.js 的

        for (let i = 0; i < this.questionCount; i++) {
            const h = randInt(1, 9);
            const t = randInt(0, 9);
            const o = randInt(0, 9);
            const num = h * 100 + t * 10 + o;

            const modes = [
                { p: `${num} 的百位數字是多少？`, c: h },
                { p: `${num} 的十位數字是多少？`, c: t },
                { p: `${num} 的個位數字是多少？`, c: o },
                { p: `${num} 中，數字「${h}」是在什麼位？`, c: "百位", isText: true },
                { p: `${h}個百、${t}個十和${o}個一合起來是多少？`, c: num, isFull: true }
            ];

            const selected = modes[randInt(0, modes.length - 1)];
            const correct = String(selected.c);

            const optionSet = new Set([correct]);

            // ⭐ 關鍵修正：針對文字題型，選項上限設為 3 (因為位值只有三個)
            const targetSize = selected.isText ? 3 : 4;

            let safetyNet = 0; // 安全防護，防止極端狀況下的死迴圈
            while (optionSet.size < targetSize && safetyNet < 50) {
                safetyNet++;
                let distractor;
                if (selected.isText) {
                    const positions = ["百位", "十位", "個位"];
                    distractor = positions[randInt(0, 2)];
                } else if (selected.isFull) {
                    const errors = [h * 100 + o * 10 + t, t * 100 + h * 10 + o, num + 10, num - 10, num + 1];
                    distractor = String(errors[randInt(0, errors.length - 1)]);
                } else {
                    distractor = String(randInt(0, 9));
                }

                if (distractor !== correct) {
                    optionSet.add(distractor);
                }
            }

            const finalOptions = shuffle(Array.from(optionSet));

            list.push({
                type: "choice",
                prompt: selected.p,
                visualPlaceValue: { h, t, o },
                options: finalOptions,
                correctIndex: finalOptions.indexOf(correct)
            });
        }
        return list;
    }
};