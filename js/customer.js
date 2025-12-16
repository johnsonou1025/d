// Copyright 2025 Johnson
$(function () {
    const SVG_NS = "http://www.w3.org/2000/svg";
    const NUM_PARTICLES = 1600;
    const PARTICLE_SIZE = 2;
    const PARTICLE_RADIUS = PARTICLE_SIZE / 2;
    const SVG_WIDTH = 600;
    const SVG_HEIGHT = 150;
    const particlesGroup = document.getElementById("particles-group");

    // 粒子資料
    const particles = [];

    // 粒子逐步增加的控制
    let currentParticleCount = 0;      // 現在已建立的粒子數
    const particlesPerFrame = 10;      // 每 frame 新增幾顆
    let particlesReady = false;        // 是否已經建立完 1000 顆

    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    function randOpacity() {
        return Math.round(Math.random() * 10) / 10;
    }

    // 建立一顆粒子
    function createParticle() {
        const minX = PARTICLE_RADIUS;
        const maxX = SVG_WIDTH - PARTICLE_RADIUS;
        const minY = PARTICLE_RADIUS;
        const maxY = SVG_HEIGHT - PARTICLE_RADIUS;

        const circle = document.createElementNS(SVG_NS, "circle");
        circle.setAttribute("r", PARTICLE_RADIUS);
        // circle.setAttribute("fill", "white");

        const x = rand(minX, maxX);
        const y = rand(minY, maxY);

        const particle = {
            element: circle,
            x,
            y,
            vx: rand(-0.5, 0.7),
            vy: rand(-0.5, 0.7),
            opacity: randOpacity()
        };

        circle.setAttribute("fill", getColorFromX(x)); // 顏色依照 x 位置
        circle.setAttribute("fill-opacity", particle.opacity);

        particles.push(particle);
        particlesGroup.appendChild(circle);
    }

    // 初始化：一開始不一次塞滿，只是設定狀態
    function initParticles() {
        // 先清空
        particles.length = 0;
        particlesGroup.innerHTML = "";
        currentParticleCount = 0;
        particlesReady = false;
    }

    // 每 frame 嘗試補粒子，直到到達 1000 顆
    function growParticles() {
        if (currentParticleCount >= NUM_PARTICLES) {
            particlesReady = true;
            return;
        }

        const createCount = Math.min(particlesPerFrame, NUM_PARTICLES - currentParticleCount);
        for (let i = 0; i < createCount; i++) {
            createParticle();
            currentParticleCount++;
        }
    }

    // 更新所有粒子（位置＋閃爍）
    function updateParticles() {
        const minX = PARTICLE_RADIUS;
        const maxX = SVG_WIDTH - PARTICLE_RADIUS;
        const minY = PARTICLE_RADIUS;
        const maxY = SVG_HEIGHT - PARTICLE_RADIUS;

        particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < minX || p.x > maxX) {
                p.vx *= -1;
                p.x = p.x < minX ? minX : maxX;
            }

            if (p.y < minY || p.y > maxY) {
                p.vy *= -1;
                p.y = p.y < minY ? minY : maxY;
            }

            p.opacity = randOpacity();

            p.element.setAttribute("cx", p.x);
            p.element.setAttribute("cy", p.y);
            p.element.setAttribute("fill", getColorFromX(p.x)); // 跟著位置變成紅→藍
        });
    }

    // 動畫 loop：先長粒子，再更新
    function animate() {
        growParticles();
        updateParticles();
        requestAnimationFrame(animate);
    }

    // 線性插值
    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    // 根據 x 計算「紅到藍」顏色
    function getColorFromX(x) {
        const t = Math.min(Math.max(x / SVG_WIDTH, 0), 1); // 0 = 最左, 1 = 最右
        // #FF1493 (DeepPink) -> #00CED1 (DarkTurquoise)
        const r = Math.round(lerp(255, 0, t));
        const g = Math.round(lerp(20, 206, t));
        const b = Math.round(lerp(147, 209, t));
        return `rgb(${r}, ${g}, ${b})`;
    }

    // 啟動
    initParticles();
    animate();
})