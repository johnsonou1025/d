const titleElement = document.getElementById('typewriter-title');
const heroWrapper = document.getElementById('heroWrapper');
const textArray = [
    'JOINJO <span>STUDIO</span>',
    'UI <span>DESIGNER</span>',
    'FRONT-END <span>DEVELOPER</span>'
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentText = textArray[textIndex];
    const speed = isDeleting ? 75 : 150;

    titleElement.innerHTML = currentText.substring(0, charIndex);

    if (!isDeleting && charIndex === currentText.length) {
        setTimeout(() => isDeleting = true, 2000); // 打完後停留 2 秒
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % textArray.length;
    }

    charIndex += isDeleting ? -1 : 1;
    setTimeout(type, speed);
}

function mouseParallaxEffect() {
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (isTouchDevice) return;

    heroWrapper.addEventListener('mousemove', (e) => {
        const rect = heroWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left - (rect.width / 2);
        const y = e.clientY - rect.top - (rect.height / 2);
        heroWrapper.style.backgroundPosition = `calc(50% + ${x * -0.01}px) calc(50% + ${y * -0.01}px)`;
    });

    heroWrapper.addEventListener('mouseleave', () => {
        heroWrapper.style.backgroundPosition = 'center center';
    });
}

function hudCoordsEffect() {
    const hud = document.getElementById('hudCoords');
    setInterval(() => {
        const randomLat = (25.0339 + (Math.random() - 0.5) * 0.0008).toFixed(4);
        const randomLon = (121.5645 + (Math.random() - 0.5) * 0.0008).toFixed(4);
        hud.innerHTML = `LAT: ${randomLat}° N // LON: ${randomLon}° E | STATUS: <span style="color:#00f3ff;">ONLINE</span>`;
    }, 2500);
}

function createBuildingLights() {
    const lightsContainer = document.getElementById('buildingLights');
    if (!lightsContainer) return;

    const numberOfLights = 20;
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < numberOfLights; i++) {
        const light = document.createElement('div');
        light.className = 'light-block';
        light.style.setProperty('--i', i); // 設定 CSS 變數
        fragment.appendChild(light);
    }
    lightsContainer.appendChild(fragment);
}

function randomizeMeteor(meteor, index, meteorsPerSide, colors) {
    let startLeft, endLeft;

    if (index < meteorsPerSide) {
        // 左半邊流星
        startLeft = 25 + Math.random() * 23; // 25% ~ 48%
        endLeft = 45 + Math.random() * 3;    // 45% ~ 48%
    } else {
        // 右半邊流星
        startLeft = 55 + Math.random() * 15; // 55% ~ 70%
        endLeft = 52 + Math.random() * 3;    // 52% ~ 55%
    }

    const translateX = endLeft - startLeft;      // 計算 X 軸位移量 (vw)
    const translateY = 360; // 固定 Y 軸位移量 (px), 結束點 top 在 50%

    // 計算角度 (dy/dx)
    // 假設一個平均視窗寬度 (e.g., 1600px) 來計算角度
    const dx = translateX * 16; // 1% of 1600px is 16px
    const angle = Math.atan2(translateY, dx) * (180 / Math.PI); // 弧度轉角度

    // 隨機選擇顏色
    const color = colors[Math.floor(Math.random() * colors.length)];
    meteor.style.setProperty('--meteor-core-color', color.core);
    meteor.style.setProperty('--meteor-glow-color', color.glow);

    // 設定動畫屬性
    meteor.style.setProperty('--meteor-start-left', `${startLeft}%`);
    meteor.style.setProperty('--meteor-translate-x', `${translateX}vw`);
    meteor.style.setProperty('--meteor-translate-y', `${translateY}px`);
    meteor.style.setProperty('--meteor-angle', `${angle}deg`);
    meteor.style.setProperty('--meteor-duration', `${4 + Math.random() * 4}s`); // 增加持續時間以減慢速度
}

function createMeteors() {
    const meteorContainer = document.getElementById('meteorShower');
    if (!meteorContainer) return;

    const colors = [
        { core: '#00f3ff', glow: '#00a1ff' }, // Electric Blue
    ];

    const numberOfMeteors = 4; // 總共四顆流星
    const meteorsPerSide = numberOfMeteors / 2;
    const fragment = document.createDocumentFragment();

    function createSingleMeteor(index) {
        const meteor = document.createElement('div');
        meteor.className = 'meteor';

        randomizeMeteor(meteor, index, meteorsPerSide, colors);
        meteor.style.setProperty('--meteor-delay', `${3 + Math.random() * 17}s`);

        // 當單次動畫結束時
        meteor.addEventListener('animationend', () => {
            meteor.remove(); // 移除當前流星
            createSingleMeteor(index); // 創建一顆新的流星來替換它
        });

        meteorContainer.appendChild(meteor);
    }

    for (let i = 0; i < numberOfMeteors; i++) {
        createSingleMeteor(i);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    createBuildingLights();
    createMeteors();
    // 延遲 1.8 秒，等待電視開機動畫完成後開始打字
    setTimeout(type, 1800);
    mouseParallaxEffect();
    hudCoordsEffect();
});