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
        const templates = [
            // A + B - C
            () => {
                const a = randInt(20, 80);
                const b = randInt(10, 50);
                const c = randInt(5, a + b - 10);
                const correct = a + b - c;
                return {
                    prompt: `小明有 ${a} 顆糖，媽媽又給他 ${b} 顆，他送給同學 ${c} 顆，最後還有幾顆？`,
                    correct
                };
            },
            // A - B + C
            () => {
                const a = randInt(50, 120);
                const b = randInt(10, a - 20);
                const c = randInt(5, 40);
                const correct = a - b + c;
                return {
                    prompt: `圖書館有 ${a} 本書，借出 ${b} 本後，又新進 ${c} 本，現在有幾本書？`,
                    correct
                };
            },
            // A + B + C
            () => {
                const a = randInt(10, 40);
                const b = randInt(10, 40);
                const c = randInt(10, 40);
                const correct = a + b + c;
                return {
                    prompt: `早上走了 ${a} 分鐘，下午走了 ${b} 分鐘，晚上又走了 ${c} 分鐘，一共走了幾分鐘？`,
                    correct
                };
            }
        ];

        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            const t = templates[randInt(0, templates.length - 1)]();
            const correct = t.correct;

            const optionValues = new Set([correct]);
            while (optionValues.size < 4) {
                const offset = randInt(-15, 15);
                const cand = correct + offset;
                if (cand >= 0 && cand !== correct) optionValues.add(cand);
            }

            const optionsArray = shuffle(Array.from(optionValues));
            const correctIndex = optionsArray.indexOf(correct);

            list.push({
                type: "choice",
                prompt: t.prompt,
                options: optionsArray.map(String),
                correctIndex
            });
        }

        return list;
    }
};
