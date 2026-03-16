// js/main.js

// ===== 共用工具（給各關卡也能用）=====
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 全域關卡資料儲存
window.LEVEL_DATA = window.LEVEL_DATA || {};

// 目前關卡 ID
let currentLevelId = "1-1";
let levelConfig = null;
let questions = [];

// 載入過的腳本快取，避免重複插入 <script>
const loadedLevelScripts = new Set();

// ===== DOM 抓取 =====
const unitTitleEl = document.getElementById("unitTitle");
const levelTitleEl = document.getElementById("levelTitle");
const progressTextEl = document.getElementById("progressText");
const progressFillEl = document.getElementById("progressFill");
const subTextEl = document.getElementById("subText");
const questionTextEl = document.getElementById("questionText");
const optionsContainerEl = document.getElementById("optionsContainer");
const scoreTextEl = document.getElementById("scoreText");
const wrongTextEl = document.getElementById("wrongText");
const nextButtonEl = document.getElementById("nextButton");
const resultPanelEl = document.getElementById("resultPanel");
const resultTitleEl = document.getElementById("resultTitle");
const resultStarsEl = document.getElementById("resultStars");
const resultDetailEl = document.getElementById("resultDetail");
const retryButtonEl = document.getElementById("retryButton");
const nextLevelButtonEl = document.getElementById("nextLevelButton");

// ===== 狀態變數 =====
let currentIndex = 0;
let correctCount = 0;
let wrongCount = 0;
let questionAnswered = false;

// ===== 動態載入關卡腳本 =====
function loadLevelScript(levelId) {
    return new Promise((resolve, reject) => {
        // 已經載過就不用再載
        if (loadedLevelScripts.has(levelId)) {
            resolve();
            return;
        }

        const script = document.createElement("script");
        script.src = `js/levels/${levelId}.js`;
        script.async = false; // 保持執行順序
        script.onload = () => {
            loadedLevelScripts.add(levelId);
            resolve();
        };
        script.onerror = () => {
            console.error(`載入關卡腳本失敗：${script.src}`);
            reject(new Error("script load error"));
        };
        document.head.appendChild(script);
    });
}

// ===== 初始化 / 進入某一關 =====
function loadLevelConfig() {
    levelConfig = window.LEVEL_DATA[currentLevelId];
    if (!levelConfig) {
        console.error("找不到關卡資料：", currentLevelId);
        return false;
    }
    return true;
}

function initLevel() {
    if (!loadLevelConfig()) return;

    const [unitNo, levelNo] = currentLevelId.split("-");

    unitTitleEl.textContent = `Unit ${unitNo} · ${levelConfig.unitName}`;
    levelTitleEl.textContent = `Level ${levelNo} · ${levelConfig.levelName}`;

    if (typeof levelConfig.generateQuestions === "function") {
        questions = levelConfig.generateQuestions();
    } else if (Array.isArray(levelConfig.questions)) {
        questions = levelConfig.questions;
    } else {
        questions = [];
    }

    currentIndex = 0;
    correctCount = 0;
    wrongCount = 0;
    questionAnswered = false;

    scoreTextEl.textContent = correctCount;
    wrongTextEl.textContent = wrongCount;
    resultPanelEl.style.display = "none";
    nextButtonEl.style.display = "none";

    renderQuestion();
}

function loadAndStartLevel(levelId) {
    currentLevelId = levelId;
    loadLevelScript(levelId)
        .then(() => {
            initLevel();
        })
        .catch(() => {
            alert("關卡載入失敗，請稍後再試");
        });
}

// ===== 題目流程 =====
function renderQuestion() {
    const q = questions[currentIndex];

    // ⭐ 先清除所有視覺元素
    const existingStars = document.querySelectorAll(".visual-stars, .visual-shape, .visual-fraction, .visual-containers");
    existingStars.forEach(el => el.remove());

    subTextEl.textContent = "請選出正確的答案";
    questionTextEl.textContent = q.prompt;
    progressTextEl.textContent = `${currentIndex + 1} / ${questions.length} 題`;
    const percent = (currentIndex / questions.length) * 100;
    progressFillEl.style.width = `${percent}%`;

    // ⭐ 根據題庫 type 自動顯示視覺化內容
    switch (levelConfig.type) {
        case 'counting':
            if (q.visualCount !== undefined) {
                renderStars(q.visualCount);
                subTextEl.textContent = `（數一數星星）`;
            }
            break;
        case 'fractions_basic':  // ⭐ 新增這行
        case 'fractions':        // ⭐ 和這行
            if (q.visualFraction) {
                renderFraction(q.visualFraction.shaded, q.visualFraction.total);
                subTextEl.textContent = `（陰影部分占幾分之幾？）`;
            }
            break;
        case 'shapes':
            if (q.visualShape) {
                renderShape(q.visualShape);
                subTextEl.textContent = `（辨識圖形）`;
            }
            break;
        case 'capacity':
            if (q.visualContainers) {
                renderContainers(q.visualContainers.left, q.visualContainers.right, q.visualContainers.maxHeight);
                subTextEl.textContent = `（比較容器內液體多寡）`;
            }
            break;
        default:
            // 其他關卡（算術題）不顯示視覺化
            break;
    }

    optionsContainerEl.innerHTML = "";
    questionAnswered = false;

    q.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.dataset.index = idx;

        const left = document.createElement("span");
        left.className = "label";
        left.textContent = opt;

        const right = document.createElement("span");
        right.className = "tag";
        right.textContent = String.fromCharCode(65 + idx);

        btn.appendChild(left);
        btn.appendChild(right);

        btn.addEventListener("click", () => handleAnswerClick(idx, btn));
        optionsContainerEl.appendChild(btn);
    });
}

// ⭐ 星星渲染函式
function renderStars(count) {
    const starsDiv = document.createElement("div");
    starsDiv.className = "visual-stars";
    starsDiv.style.cssText = `
    display: flex;
    gap: 4px;
    justify-content: center;
    margin: 16px 0;
    flex-wrap: wrap;
  `;

    for (let i = 0; i < count; i++) {
        const star = document.createElement("span");
        star.textContent = "⭐";
        star.style.fontSize = "26px";
        star.style.lineHeight = "1";
        starsDiv.appendChild(star);
    }

    questionTextEl.parentNode.insertBefore(starsDiv, questionTextEl.nextSibling);
}

// 陰影
function renderFraction(shaded, total) {
    const pieDiv = document.createElement("div");
    pieDiv.className = "visual-fraction";
    pieDiv.style.cssText = `
    display: flex;
    justify-content: center;
    margin: 20px 0;
    gap: 12px;
  `;

    for (let i = 0; i < total; i++) {
        const slice = document.createElement("div");
        slice.className = "fraction-slice";
        slice.style.cssText = `
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 3px solid #fbbf24;
      margin: 0 4px;
    `;

        if (i < shaded) {
            slice.style.background = "linear-gradient(135deg, #fbbf24, #f59e0b)";
        } else {
            slice.style.background = "rgba(255,255,255,0.2)";
        }

        pieDiv.appendChild(slice);
    }

    questionTextEl.parentNode.insertBefore(pieDiv, questionTextEl.nextSibling);
}

// ⭐ 新增 renderContainers 函式
function renderContainers(leftLevel, rightLevel, maxHeight) {
    const containerDiv = document.createElement("div");
    containerDiv.className = "visual-containers";
    containerDiv.style.cssText = `
    display: flex;
    justify-content: center;
    gap: 24px;
    margin: 20px 0;
  `;

    // 左容器
    const leftContainer = createContainer(leftLevel, maxHeight);
    leftContainer.innerHTML += '<div style="text-align:center;font-size:12px;color:#9ca3af;">左邊</div>';

    // 右容器
    const rightContainer = createContainer(rightLevel, maxHeight);
    rightContainer.innerHTML += '<div style="text-align:center;font-size:12px;color:#9ca3af;">右邊</div>';

    containerDiv.appendChild(leftContainer);
    containerDiv.appendChild(rightContainer);
    questionTextEl.parentNode.insertBefore(containerDiv, questionTextEl.nextSibling);
}

function createContainer(level, maxHeight) {
    const container = document.createElement("div");
    container.style.cssText = `
    width: 60px;
    height: 120px;
    border: 3px solid #4ade80;
    border-radius: 8px 8px 20px 20px;
    background: linear-gradient(to top, #10b981 ${level / maxHeight * 100}%, rgba(255,255,255,0.3) ${level / maxHeight * 100}%);
    position: relative;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    box-shadow: 0 4px 12px rgba(16,185,129,0.3);
  `;

    // 液體高度標示
    const levelLabel = document.createElement("div");
    levelLabel.textContent = `${level}/${maxHeight}`;
    levelLabel.style.cssText = `
    position: absolute;
    top: 4px;
    font-size: 11px;
    color: #10b981;
    font-weight: 600;
  `;
    container.appendChild(levelLabel);

    return container;
}


// ⭐ 圖形渲染函式
function renderShape(shapeType) {
    const shapeDiv = document.createElement("div");
    shapeDiv.className = "visual-shape";
    shapeDiv.style.cssText = `
    display: flex;
    justify-content: center;
    margin: 20px 0;
    padding: 24px;
    background: rgba(255,255,255,0.08);
    border-radius: 16px;
    border: 2px solid rgba(251, 191, 36, 0.4);
  `;

    const shape = document.createElement("div");
    shape.className = `shape-${shapeType}`;
    shape.style.cssText = `
    width: 90px;
    height: 90px;
    margin: 0 auto;
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    border: 3px solid #d97706;
    position: relative;
  `;

    // 根據 shapeType 設定樣式
    switch (shapeType) {
        case 'circle':
            shape.style.borderRadius = '50%';
            break;
        case 'triangle':
            shape.style.width = '0';
            shape.style.height = '0';
            shape.style.borderLeft = '45px solid transparent';
            shape.style.borderRight = '45px solid transparent';
            shape.style.borderBottom = '80px solid #fbbf24';
            shape.style.background = 'none';
            shape.style.border = 'none';
            break;
        case 'square':
            shape.style.borderRadius = '8px';
            break;
        case 'fractions':
            if (q.visualFraction) {
                renderFraction(q.visualFraction.shaded, q.visualFraction.total);
                subTextEl.textContent = `（陰影部分占幾分之幾？）`;
            }
            break;
    }

    shapeDiv.appendChild(shape);
    questionTextEl.parentNode.insertBefore(shapeDiv, questionTextEl.nextSibling);
}

function handleAnswerClick(selectedIndex, buttonEl) {
    if (questionAnswered) return;

    const q = questions[currentIndex];
    const isCorrect = selectedIndex === q.correctIndex;
    questionAnswered = true;

    const allButtons = optionsContainerEl.querySelectorAll(".option-btn");
    allButtons.forEach(btn => btn.classList.add("disabled"));

    if (isCorrect) {
        buttonEl.classList.add("correct");
        correctCount++;
        scoreTextEl.textContent = correctCount;
        subTextEl.textContent = "太棒了！答對了！";
    } else {
        buttonEl.classList.add("incorrect");
        wrongCount++;
        wrongTextEl.textContent = wrongCount;
        subTextEl.textContent = "沒關係，我們一起看看正確答案。";
        allButtons[q.correctIndex].classList.add("correct");
    }

    if (currentIndex < questions.length - 1) {
        nextButtonEl.textContent = "下一題";
        nextButtonEl.style.display = "block";
    } else {
        progressFillEl.style.width = "100%";
        nextButtonEl.textContent = "看結果";
        nextButtonEl.style.display = "block";
    }
}

nextButtonEl.addEventListener("click", () => {
    if (currentIndex < questions.length - 1) {
        currentIndex++;
        nextButtonEl.style.display = "none";
        renderQuestion();
    } else {
        showResult();
    }
});

function showResult() {
    const total = questions.length;
    const ratio = correctCount / total;
    let stars = 1;
    if (ratio >= 0.8) stars = 3;
    else if (ratio >= 0.6) stars = 2;

    const starStr = "★".repeat(stars) + "☆".repeat(3 - stars);
    resultStarsEl.textContent = starStr;
    resultDetailEl.textContent = `你答對 ${correctCount} / ${total} 題`;

    const need = levelConfig.minCorrectToPass || 0;
    if (correctCount >= need) {
        // 過關：顯示「本關過關！」＋「下一關」按鈕
        resultTitleEl.textContent = "本關過關！";
        nextLevelButtonEl.style.display = "block";
    } else {
        // 沒過關：顯示鼓勵訊息，不顯示「下一關」
        resultTitleEl.textContent = "再試一次就會更厲害！";
        nextLevelButtonEl.style.display = "none";
    }

    // 不論是否過關，結果面板跟「重新挑戰」都要出現
    resultPanelEl.style.display = "block";
    retryButtonEl.style.display = "block";

    // 關掉題目區的「下一題 / 看結果」按鈕
    nextButtonEl.style.display = "none";
}

// ===== 重新挑戰 / 下一關 =====
retryButtonEl.addEventListener("click", () => {
    // 同一關重新開始（不需要重載 js，只重新出題）
    initLevel();
});

nextLevelButtonEl.addEventListener("click", () => {
    const [unitNo, levelNo] = currentLevelId.split("-");
    const nextLevelNo = Number(levelNo) + 1;
    const nextId = `${unitNo}-${nextLevelNo}`;
    loadAndStartLevel(nextId);
});

// ===== 年級 → 起始關卡 =====
function getFirstLevelIdByGrade(grade) {
    // 年級 1~6 對應 unit 編號 1~6，起始都是 X-1
    const unitNo = Number(grade);
    if (unitNo >= 1 && unitNo <= 6) {
        return `${unitNo}-1`;
    }
    return "1-1";
}

// 綁定年級按鈕
function setupGradeButtons() {
    const container = document.getElementById("gradeButtons");
    if (!container) return;

    const buttons = container.querySelectorAll(".grade-btn");

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            const grade = btn.dataset.grade;
            const targetLevelId = getFirstLevelIdByGrade(grade);

            // 切換 active 樣式
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // 載入該年級的起始關卡
            loadAndStartLevel(targetLevelId);
        });
    });
}

// ===== 進入遊戲：從 1-1 開始，並啟用年級按鈕 =====
document.addEventListener("DOMContentLoaded", () => {
    setupGradeButtons();
    // 預設一年級（建議一開始讓「一年級」按鈕有 active class）
    loadAndStartLevel("1-1");
});

// ===== 測試用：快速跳關 =====
function setupLevelSelect() {
    const levelSelectEl = document.getElementById("levelSelect");
    if (!levelSelectEl) return;

    levelSelectEl.addEventListener("change", (e) => {
        const levelId = e.target.value;
        if (levelId) {
            loadAndStartLevel(levelId);
            // 可選：清空選單
            e.target.value = "";
        }
    });
}

// 在 DOMContentLoaded 裡加上
document.addEventListener("DOMContentLoaded", () => {
    setupGradeButtons();
    setupLevelSelect(); // ⭐ 新增這行
    loadAndStartLevel("1-1");
});


