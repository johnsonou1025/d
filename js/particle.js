// Copyright 2025 Johnson
const config = {
    targetText: "JOINJO\nSTUDIO", // 粒子要組成的文字，用 \n 換行
    fontFamily: 'Roboto, Arial', // 建議使用你網站已載入的字體，例如 'Roboto Bold'
    baseFontSize: 160, // 基礎字體大小，會在 resize 時調整
    lineHeightRatio: .9, // 行高比例，字體大小的 1.2 倍 (例如 1.2 * 160px)
    particleCount: 2000, // 粒子數量 (可調整，數量越多越細緻但也越吃效能)
    particleSize: 2, // 粒子半徑
    friction: 0.92, // 摩擦力，讓粒子逐漸停止 (0-1, 越接近1停止越慢)
    textToParticleRatio: 8, // 像素點取樣比例，越大粒子越稀疏，越省效能
    mouseRepelRadius: 50, // 滑鼠排斥範圍 (像素)
    mouseRepelForce: .1, // 滑鼠排斥力道 (越高推越遠)
    particleReturnForce: 0.01, // 粒子回歸目標位置的拉力 (越高拉越快)

    // 漸層顏色設定 (從左到右)
    gradientColors: [
        { stop: 0, color: "#FF1493" }, // 粉紫
        // { stop: 0.5, color: "#ff7b00" }, // 橘色
        { stop: 1, color: "#00CED1" }  // 黃色
    ]
};

// ===========================================
// 可調整參數設定區塊 結束
// ===========================================


const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouse = { x: null, y: null }; // 儲存滑鼠座標

// 監聽滑鼠移動，更新 mouse 座標
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

// 當視窗大小改變時，重新設定 Canvas 尺寸並初始化粒子
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

// 粒子物件定義
class Particle {
    constructor(x, y, targetX, targetY, color) {
        this.x = x;
        this.y = y;
        this.targetX = targetX; // 粒子最終目標的 X 座標 (文字像素位置)
        this.targetY = targetY; // 粒子最終目標的 Y 座標 (文字像素位置)
        this.baseX = x; // 粒子原始生成位置 X
        this.baseY = y; // 粒子原始生成位置 Y
        this.color = color; // 粒子顏色 (來自漸層)
        this.vx = 0; // 速度向量 X
        this.vy = 0; // 速度向量 Y
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, config.particleSize, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        // 粒子回歸目標位置的力
        let dxToTarget = this.targetX - this.x;
        let dyToTarget = this.targetY - this.y;
        let distanceToTarget = Math.sqrt(dxToTarget * dxToTarget + dyToTarget * dyToTarget);

        this.vx += dxToTarget * config.particleReturnForce;
        this.vy += dyToTarget * config.particleReturnForce;

        // 如果有滑鼠互動 (排斥力)
        if (mouse.x !== undefined && mouse.y !== undefined) {
            let dxFromMouse = mouse.x - this.x;
            let dyFromMouse = mouse.y - this.y;
            let distanceToMouse = Math.sqrt(dxFromMouse * dxFromMouse + dyFromMouse * dyFromMouse);

            if (distanceToMouse < config.mouseRepelRadius) {
                let repelForce = (config.mouseRepelRadius - distanceToMouse) / config.mouseRepelRadius; // 距離越近，推力越大
                this.vx -= dxFromMouse * repelForce * config.mouseRepelForce;
                this.vy -= dyFromMouse * repelForce * config.mouseRepelForce;
            }
        }

        // 施加摩擦力
        this.vx *= config.friction;
        this.vy *= config.friction;

        // 更新位置
        this.x += this.vx;
        this.y += this.vy;
    }
}

// 獲取漸層顏色
function getGradientColor(xRatio) {
    // 找到對應 xRatio 所在的兩個顏色 stop
    let startColor = config.gradientColors[0];
    let endColor = config.gradientColors[config.gradientColors.length - 1];

    for (let i = 0; i < config.gradientColors.length - 1; i++) {
        if (xRatio >= config.gradientColors[i].stop && xRatio <= config.gradientColors[i + 1].stop) {
            startColor = config.gradientColors[i];
            endColor = config.gradientColors[i + 1];
            break;
        }
    }

    const t = (xRatio - startColor.stop) / (endColor.stop - startColor.stop);

    // 將 HEX 顏色轉換為 RGB 陣列
    const hexToRgb = hex => {
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        return [r, g, b];
    };

    const rgb1 = hexToRgb(startColor.color);
    const rgb2 = hexToRgb(endColor.color);

    // 線性插值計算混合顏色
    const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * t);
    const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * t);
    const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * t);

    return `rgb(${r}, ${g}, ${b})`;
}


// 初始化粒子
function initParticles() {
    particles = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 根據視窗寬度調整字體大小，保持響應式
    let currentFontSize = config.baseFontSize;
    if (canvas.width < 768) { // 例如，在手機上字體縮小
        currentFontSize = config.baseFontSize * (canvas.width / 768);
        if (currentFontSize < 80) currentFontSize = 80; // 最小字體
    }
    if (currentFontSize > config.baseFontSize) currentFontSize = config.baseFontSize; // 最大不超過設定值

    // 繪製文字到 Canvas (隱藏或透明)
    ctx.font = `bold ${currentFontSize}px ${config.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white'; // 使用白色以便讀取像素

    // 處理多行文字繪製
    const lines = config.targetText.split('\n');
    const calculatedLineHeight = currentFontSize * config.lineHeightRatio;
    const totalTextHeight = (lines.length - 1) * calculatedLineHeight;
    const startY = (canvas.height / 2) - (totalTextHeight / 2); // 計算起始 Y 座標讓整體垂直居中

    lines.forEach((line, index) => {
        const currentY = startY + (index * calculatedLineHeight);
        ctx.fillText(line, canvas.width / 2, currentY);
    });

    // 獲取文字的像素數據
    const textData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空 Canvas，只留下像素數據

    let targetPositions = [];
    let minX = canvas.width, maxX = 0; // 記錄文字的左右邊界，用於計算漸層

    for (let y = 0; y < canvas.height; y += config.textToParticleRatio) {
        for (let x = 0; x < canvas.width; x += config.textToParticleRatio) {
            const alpha = textData[((y * canvas.width + x) * 4) + 3]; // 獲取像素的 alpha 值
            if (alpha > 128) { // 如果像素不是透明的 (代表是文字的一部分)
                targetPositions.push({ x: x, y: y });
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
            }
        }
    }

    // 創建粒子
    for (let i = 0; i < config.particleCount; i++) {
        // 隨機選擇一個目標位置
        const targetPos = targetPositions[Math.floor(Math.random() * targetPositions.length)];

        if (targetPos) {
            // 計算粒子的漸層顏色
            const xRatio = (targetPos.x - minX) / (maxX - minX);
            const particleColor = getGradientColor(xRatio);

            // 粒子初始位置可以隨機，然後會被拉向 targetPos
            const startX = Math.random() * canvas.width;
            const startY = Math.random() * canvas.height;
            particles.push(new Particle(startX, startY, targetPos.x, targetPos.y, particleColor));
        }
    }
}

// 動畫循環
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除上一幀
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    requestAnimationFrame(animate); // 優化動畫，由瀏覽器控制幀率
}

// 啟動程式 (在 DOM 加載後，確保 Canvas 元素已存在)
document.addEventListener('DOMContentLoaded', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
    animate();
});
