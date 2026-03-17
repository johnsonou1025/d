// js/levels/6-10.js
window.LEVEL_DATA = window.LEVEL_DATA || {};

window.LEVEL_DATA["6-10"] = {
    id: "6-10",
    unitName: "六年級：邏輯題",
    levelName: "雞兔同籠植樹",
    type: "logic_problems",
    questionCount: 10,
    minCorrectToPass: 8,

    generateQuestions() {
        const questions = [
            {
                prompt: "雞兔同籠36隻頭，100隻腳，兔子幾隻？",
                options: ["16", "20", "24", "28"],
                correctIndex: 0  // (100-36×2)/2=16
            },
            {
                prompt: "路長240公尺，每端2棵樹，中間每3公尺1棵，共幾棵？",
                options: ["82", "80", "84", "78"],
                correctIndex: 0  // 2×2+(240/3)-1=82
            },
            {
                prompt: "A工作8天完成，B12天完成，同做幾天完成 3/4？",
                options: ["6", "7.2", "5.4", "9"],
                correctIndex: 1  // 3/4÷(1/8+1/12)=7.2
            }
        ];

        const list = [];
        for (let i = 0; i < this.questionCount; i++) {
            const q = questions[i % questions.length];
            list.push({
                type: "choice",
                prompt: q.prompt,
                options: q.options,
                correctIndex: q.correctIndex
            });
        }
        return list;
    }
};
