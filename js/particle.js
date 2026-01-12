// ===========================================
// 可調整變數
// ===========================================
const config = {
    targetText: "JOINJO\nSTUDIO",// 粒子要組成的文字，用 \n 換行
    fontFamily: "Roboto",// 字體
    baseFontSize: 160,// 字體大小
    lineHeightRatio: 1,// 行高
    particleCount: 1600,//粒子數量
    particleSize: 2,// 粒子半徑
    friction: .9,// 摩擦力
    textToParticleRatio: 4,// 像素點取樣比例，越大粒子越稀疏
    mouseRepelRadius: 50,// 滑鼠排斥範圍
    mouseRepelForce: 0.2,// 滑鼠排斥力道
    particleReturnForce: 0.02,// 粒子回歸目標位置的拉力
    gradientColors: [
        { stop: 0, color: "#FF1493" },
        // { stop: 0.5, color: "#ff7b00" },
        { stop: 1, color: "#00CED1" }
    ]
};

const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d', { alpha: false }); // 優化效能：關閉透明度緩衝
let particles = [];
let mouse = { x: -9999, y: -9999, active: false };
let isMobile = window.innerWidth < 768;

// ===========================================
// 核心邏輯
// ===========================================

function updateScreenSettings() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    isMobile = window.innerWidth < 765;
    initParticles();
}

// 監測滑鼠位置與 Z-index 判定
window.addEventListener('mousemove', (e) => {
    if (isMobile) return; // 手機版直接跳過

    // 檢測滑鼠指向的最上層元素
    const topElement = document.elementFromPoint(e.clientX, e.clientY);

    // 只有當最上層是 Canvas 時才啟動粒子排斥
    if (topElement === canvas) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    } else {
        mouse.active = false; // 被其他 z-index 遮住
    }
});

window.addEventListener('resize', updateScreenSettings);

function getGradientColor(ratio) {
    let start = config.gradientColors[0];
    let end = config.gradientColors[config.gradientColors.length - 1];

    for (let i = 0; i < config.gradientColors.length - 1; i++) {
        if (ratio >= config.gradientColors[i].stop && ratio <= config.gradientColors[i + 1].stop) {
            start = config.gradientColors[i];
            end = config.gradientColors[i + 1];
            break;
        }
    }
    const t = (ratio - start.stop) / (end.stop - start.stop);
    const hexToRgb = hex => hex.match(/\w\w/g).map(x => parseInt(x, 16));
    const c1 = hexToRgb(start.color);
    const c2 = hexToRgb(end.color);
    const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
    const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
    const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
    return `rgb(${r},${g},${b})`;
}

class Particle {
    constructor(tx, ty, color) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.targetX = tx;
        this.targetY = ty;
        this.color = color;
        this.vx = 0;
        this.vy = 0;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, config.particleSize, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        // 回歸力
        this.vx += (this.targetX - this.x) * config.particleReturnForce;
        this.vy += (this.targetY - this.y) * config.particleReturnForce;

        // 滑鼠排斥 (僅限非手機且無遮蓋)
        if (!isMobile && mouse.active) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < config.mouseRepelRadius) {
                let force = (config.mouseRepelRadius - dist) / config.mouseRepelRadius;
                this.vx -= dx * force * config.mouseRepelForce;
                this.vy -= dy * force * config.mouseRepelForce;
            }
        }

        this.vx *= config.friction;
        this.vy *= config.friction;
        this.x += this.vx;
        this.y += this.vy;
    }
}

function initParticles() {
    particles = [];
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    let size = isMobile ? config.baseFontSize * 0.5 : config.baseFontSize;
    tempCtx.font = `bold ${size}px ${config.fontFamily}`;
    tempCtx.textAlign = 'center';
    tempCtx.textBaseline = 'middle';

    const lines = config.targetText.split('\n');
    const lHeight = size * config.lineHeightRatio;
    const startY = (canvas.height / 2) - ((lines.length - 1) * lHeight / 2);

    lines.forEach((line, i) => {
        tempCtx.fillText(line, canvas.width / 2, startY + i * lHeight);
    });

    const data = tempCtx.getImageData(0, 0, canvas.width, canvas.height).data;
    let positions = [];
    let minX = canvas.width, maxX = 0;

    for (let y = 0; y < canvas.height; y += config.textToParticleRatio) {
        for (let x = 0; x < canvas.width; x += config.textToParticleRatio) {
            if (data[(y * canvas.width + x) * 4 + 3] > 128) {
                positions.push({ x, y });
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
            }
        }
    }

    for (let i = 0; i < config.particleCount; i++) {
        const pos = positions[Math.floor(Math.random() * positions.length)];
        if (pos) {
            const ratio = (pos.x - minX) / (maxX - minX || 1);
            particles.push(new Particle(pos.x, pos.y, getGradientColor(ratio)));
        }
    }
}

function animate() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
        p.update();
        p.draw();
    }
    requestAnimationFrame(animate);
}

updateScreenSettings();
animate();