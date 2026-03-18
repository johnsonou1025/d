// js/levels/6-7.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["6-7"] = {
    id: "6-7",
    unitName: "六年級：百分率應用",
    levelName: "折扣、加成與利潤",
    type: "percentage",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const list = [];

        for (let i = 0; i < this.questionCount; i++) {
            const mode = randInt(1, 3); // 1: 算折扣後價格, 2: 算原價, 3: 算省多少或利潤
            let prompt = "";
            let correctStr = "";
            let optionSet = new Set();

            if (mode === 1) {
                // 【模式 1】求折扣後價格 (打折觀念)
                const originalPrice = randInt(10, 100) * 10;
                const discount = randInt(7, 9); // 7折 ~ 9折
                const salePrice = originalPrice * (discount / 10);

                prompt = `一件商品原價 ${originalPrice} 元，現在打 ${discount} 折出售，請問售價是多少元？`;
                correctStr = String(salePrice);

                optionSet.add(correctStr);
                optionSet.add(String(originalPrice * (1 - discount / 10))); // 陷阱：算出省下的錢
                optionSet.add(String(originalPrice - discount));          // 陷阱：直接減去折數
                optionSet.add(String(originalPrice * (discount / 100)));    // 陷阱：誤認百分率

            } else if (mode === 2) {
                // 【模式 2】求原價 (基準量運算)
                // 為了好算，結果設計成百元整數
                const originalPrice = randInt(2, 10) * 100;
                const markupPercent = [10, 20, 25, 50][randInt(0, 3)]; // 加成比例
                const salePrice = originalPrice * (1 + markupPercent / 100);

                prompt = `某商品依成本加成 ${markupPercent}% 作為定價，若定價是 ${salePrice} 元，請問成本是多少元？`;
                correctStr = String(originalPrice);

                optionSet.add(correctStr);
                optionSet.add(String(salePrice * (1 - markupPercent / 100))); // 陷阱：直接減去%數
                optionSet.add(String(salePrice - originalPrice));            // 陷阱：算出利潤
                optionSet.add(String(salePrice - markupPercent));

            } else {
                // 【模式 3】求省下的金額 (差值觀念)
                const originalPrice = randInt(5, 20) * 100;
                const offPercent = [10, 15, 20, 30][randInt(0, 3)]; // 幾% off
                const savedMoney = originalPrice * (offPercent / 100);

                prompt = `一雙鞋子標價 ${originalPrice} 元，週年慶期間打 ${100 - offPercent} 折（即 ${offPercent}% off），請問可以省下多少元？`;
                correctStr = String(savedMoney);

                optionSet.add(correctStr);
                optionSet.add(String(originalPrice - savedMoney)); // 陷阱：算出售價
                optionSet.add(String(originalPrice * (offPercent / 10))); // 陷阱：小數點位數錯誤
                optionSet.add(String(offPercent));
            }

            // --- 整理選項 ---
            const finalCorrect = correctStr;
            while (optionSet.size < 4) {
                const fake = randInt(1, 20) * 20;
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