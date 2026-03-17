// js/levels/4-8.js（完全修正版）
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["4-8"] = {
    id: "4-8",
    unitName: "四年級：面積計算",
    levelName: "長方形面積",
    type: "rectangle_area",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const isRectangle = Math.random() < 0.7;
            let prompt, correct;

            if (isRectangle) {
                // 長方形面積
                const length = randInt(3, 15);
                const width = randInt(2, 10);
                correct = length * width;
                prompt = `長 ${length} 公分、寬 ${width} 公分的長方形，面積是幾平方公分？`;
            } else {
                // 正方形面積
                const side = randInt(3, 12);
                correct = side * side;
                prompt = `一邊長 ${side} 公分的正方形，面積是幾平方公分？`;
            }

            // 生成選項
            const optionValues = new Set([correct]);
            while (optionValues.size < 4) {
                const offset = randInt(-5, 5);
                const cand = correct + offset;
                if (cand > 0 && cand !== correct) {
                    optionValues.add(cand);
                }
            }

            const optionsArray = shuffle(Array.from(optionValues));
            const correctIndex = optionsArray.indexOf(correct);

            list.push({
                type: "choice",
                prompt,
                options: optionsArray.map(String),
                correctIndex
            });
        }

        return list;
    }
};
