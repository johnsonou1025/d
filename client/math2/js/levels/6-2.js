// js/levels/6-2.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["6-2"] = {
    id: "6-2",
    unitName: "六年級：小數除法",
    levelName: "小數的直式除法與概數",
    type: "decimal_division",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3); // 1: 小數除以整數, 2: 小數除以小數, 3: 商的概數
            let prompt = "";
            let correctStr = "";
            let optionSet = new Set();

            if (mode === 1) {
                // 【模式 1】小數除以整數 (直接除)
                const divisor = randInt(2, 8);
                const quotient = (randInt(11, 49) / 10).toFixed(1); // 例如 3.2
                const dividend = parseFloat((quotient * divisor).toFixed(2));

                prompt = `${dividend} ÷ ${divisor} = ？`;
                correctStr = String(quotient);

                optionSet.add(correctStr);
                optionSet.add(String(quotient * 10)); // 陷阱：忘了小數點
                optionSet.add(String(quotient / 10)); // 陷阱：點錯位
                optionSet.add(String(Math.floor(quotient)));

            } else if (mode === 2) {
                // 【模式 2】小數除以小數 (移位觀念)
                const rawDivisor = randInt(2, 9);
                const divisor = rawDivisor / 10; // 例如 0.8
                const rawQuotient = randInt(12, 35);
                const quotient = rawQuotient / 10; // 例如 1.5
                const dividend = parseFloat((divisor * quotient).toFixed(3));

                prompt = `${dividend} ÷ ${divisor} = ？`;
                correctStr = String(quotient);

                optionSet.add(correctStr);
                optionSet.add(String(rawQuotient)); // 陷阱：移位後忘了點回來
                optionSet.add(String(quotient / 10));
                optionSet.add(String(parseFloat((dividend / rawDivisor).toFixed(3)))); // 陷阱：只移除數沒移被除數

            } else {
                // 【模式 3】商的概數 (四捨五入法)
                const divisor = 3; // 用 3 容易產生循環小數
                const dividend = randInt(10, 25);
                const realQuotient = dividend / divisor;

                prompt = `${dividend} ÷ ${divisor} = ？（用「四捨五入法」求商到小數第一位）`;
                correctStr = realQuotient.toFixed(1);

                optionSet.add(correctStr);
                optionSet.add(realQuotient.toFixed(0)); // 陷阱：取到整數位
                optionSet.add(realQuotient.toFixed(2)); // 陷阱：取到第二位
                optionSet.add(String((realQuotient + 0.1).toFixed(1)));
            }

            // --- 補齊與洗牌 ---
            const finalCorrect = correctStr;
            while (optionSet.size < 4) {
                const fake = (randInt(1, 100) / 10).toFixed(1);
                optionSet.add(String(fake));
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