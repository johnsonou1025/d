// ===========================================
// 可調整參數設定區塊 (依需求獨立)
// ===========================================
const config = {
    targetText: "JOINJO\nSTUDIO",
    fontFamily: "Arial, sans-serif",
    baseFontSize: 160,
    lineHeightRatio: .9,
    particleCount: 2400,
    particleSize: 2,
    friction: 0.92,
    textToParticleRatio: 6,
    mouseRepelRadius: 50,
    mouseRepelForce: 1,
    particleReturnForce: 0.02,
    gradientColors: [
        { stop: 0, color: "#FF1493" },
        // { stop: 0.5, color: "#ff7b00" },
        { stop: 1, color: "#00CED1" }
    ]
};

const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d', { alpha: true }); // 優化效能

let particles = [];
let mouse = { x: null, y: null };

// ===========================================
// 核心邏輯
// ===========================================

window.addEventListener('mousemove', (e) => {
    // 檢測目前滑鼠下方的元素 z-index
    // 如果你使用標準的 HTML 層級，瀏覽器會優先觸發 z-index 最高的元素
    // 當滑鼠在 .overlay-section 上時，這段 code 依然會跑，但我們可以透過座標判斷
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('resize', () => {
    setupCanvas();
    initParticles();
});

function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor(targetX, targetY, color) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.targetX = targetX;
        this.targetY = targetY;
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
        let dx = this.targetX - this.x;
        let dy = this.targetY - this.y;
        this.vx += dx * config.particleReturnForce;
        this.vy += dy * config.particleReturnForce;

        // 滑鼠排斥 (檢查 Z-Index 感應)
        // 技巧：利用 elementFromPoint 檢查滑鼠當前位置的最上層元素是否為 canvas
        if (mouse.x !== null) {
            const topElement = document.elementFromPoint(mouse.x, mouse.y);
            // 只有當最上層是 canvas 或 hero-section 時才觸發動力
            if (topElement === canvas || topElement?.classList.contains('hero-section')) {
                let mdx = mouse.x - this.x;
                let mdy = mouse.y - this.y;
                let dist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (dist < config.mouseRepelRadius) {
                    let force = (config.mouseRepelRadius - dist) / config.mouseRepelRadius;
                    this.vx -= mdx * force * config.mouseRepelForce;
                    this.vy -= mdy * force * config.mouseRepelForce;
                }
            }
        }

        this.vx *= config.friction;
        this.vy *= config.friction;
        this.x += this.vx;
        this.y += this.vy;
    }
}

function getGradientColor(xRatio) {
    const colors = config.gradientColors;
    let start, end;
    for (let i = 0; i < colors.length - 1; i++) {
        if (xRatio >= colors[i].stop && xRatio <= colors[i + 1].stop) {
            start = colors[i];
            end = colors[i + 1];
            break;
        }
    }
    if (!start) return colors[colors.length - 1].color;

    const t = (xRatio - start.stop) / (end.stop - start.stop);
    const c1 = hexToRgb(start.color);
    const c2 = hexToRgb(end.color);
    const r = Math.round(c1.r + (c2.r - c1.r) * t);
    const g = Math.round(c1.g + (c2.g - c1.g) * t);
    const b = Math.round(c1.b + (c2.b - c1.b) * t);
    return `rgb(${r},${g},${b})`;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function initParticles() {
    particles = [];
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    const fontSize = window.innerWidth < 768 ? config.baseFontSize * 0.5 : config.baseFontSize;
    tempCtx.font = `bold ${fontSize}px ${config.fontFamily}`;
    tempCtx.textAlign = 'center';
    tempCtx.textBaseline = 'middle';

    const lines = config.targetText.split('\n');
    const lh = fontSize * config.lineHeightRatio;
    const totalH = (lines.length - 1) * lh;
    const startY = (canvas.height / 2) - (totalH / 2);

    lines.forEach((line, i) => {
        tempCtx.fillText(line, canvas.width / 2, startY + (i * lh));
    });

    const data = tempCtx.getImageData(0, 0, canvas.width, canvas.height).data;
    let points = [];
    let minX = canvas.width, maxX = 0;

    for (let y = 0; y < canvas.height; y += config.textToParticleRatio) {
        for (let x = 0; x < canvas.width; x += config.textToParticleRatio) {
            if (data[((y * canvas.width + x) * 4) + 3] > 128) {
                points.push({ x, y });
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
            }
        }
    }

    for (let i = 0; i < config.particleCount; i++) {
        const pt = points[Math.floor(Math.random() * points.length)];
        if (pt) {
            const color = getGradientColor((pt.x - minX) / (maxX - minX));
            particles.push(new Particle(pt.x, pt.y, color));
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

setupCanvas();
initParticles();
animate();