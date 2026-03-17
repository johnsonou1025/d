// js/levels/5-2.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["5-2"] = {
    id: "5-2",
    unitName: "五年級：公因數公倍數",
    levelName: "最大公因數最小公倍數",
    type: "gcd_lcm",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const pairs = [
            { a: 12, b: 18, gcd: 6, lcm: 36 },
            { a: 15, b: 25, gcd: 5, lcm: 75 },
            { a: 20, b: 30, gcd: 10, lcm: 60 }
        ];

        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            const { a, b, gcd, lcm } = pairs[i % pairs.length];
            const type = i % 2 === 0 ? 'gcd' : 'lcm';

            const prompt = type === 'gcd'
                ? `${a} 和 ${b} 的最大公因數是？`
                : `${a} 和 ${b} 的最小公倍數是？`;

            const options = type === 'gcd'
                ? [`${gcd}`, `${gcd - 1}`, `${gcd + 1}`, `${Math.min(a, b)}`]
                : [`${lcm}`, `${lcm - 5}`, `${lcm + 5}`, `${a * b}`];

            const correctIndex = 0;

            list.push({
                type: "choice",
                prompt,
                options,
                correctIndex
            });
        }
        return list;
    }
};
