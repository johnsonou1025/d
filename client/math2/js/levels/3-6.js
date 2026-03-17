// js/levels/3-6.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["3-6"] = {
    id: "3-6",
    unitName: "三年級：分數加減",
    levelName: "同分母分數加減",
    type: "fraction_add_sub",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const denom = randInt(2, 9);          // 分母 2~9
            const a = randInt(1, denom - 1);      // 分子
            const b = randInt(1, denom - 1);

            const isAdd = Math.random() < 0.5;
            let correct;
            let prompt;

            if (isAdd) {
                correct = a + b;
                prompt = `${a}/${denom} + ${b}/${denom} = ？`;
            } else {
                const bigger = Math.max(a, b);
                const smaller = Math.min(a, b);
                correct = bigger - smaller;
                prompt = `${bigger}/${denom} - ${smaller}/${denom} = ？`;
            }

            const correctStr = `${correct}/${denom}`;

            const optionValues = new Set([correctStr]);
            while (optionValues.size < 4) {
                const num = randInt(0, denom);   // 允許 0/denom
                const cand = `${num}/${denom}`;
                if (cand !== correctStr) optionValues.add(cand);
            }

            const optionsArray = shuffle(Array.from(optionValues));
            const correctIndex = optionsArray.indexOf(correctStr);

            list.push({
                type: "choice",
                prompt,
                options: optionsArray,
                correctIndex
            });
        }

        return list;
    }
};
