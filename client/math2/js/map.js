/**
 * map.js - 處理地圖渲染與關卡進度邏輯
 */
window.GAME_MAP = {
    allLevels: [
        "1-1", "1-2", "1-3", "2-1", "2-2", "3-1", "3-2", "3-3",
        "4-1", "4-2", "5-1", "5-2", "6-1", "6-2", "6-3", "6-4",
        "6-5", "6-6", "6-7", "6-8", "6-9", "6-10"
    ],

    getProgress() {
        const saved = localStorage.getItem('math_game_progress');
        return saved ? JSON.parse(saved) : { "1-1": { stars: 0, unlocked: true } };
    },

    saveProgress(levelId, stars) {
        const progress = this.getProgress();
        if (!progress[levelId] || stars > progress[levelId].stars) {
            progress[levelId] = { stars: stars, unlocked: true };
        }
        if (stars >= 2) {
            const currentIndex = this.allLevels.indexOf(levelId);
            const nextLevelId = this.allLevels[currentIndex + 1];
            if (nextLevelId && !progress[nextLevelId]) {
                progress[nextLevelId] = { stars: 0, unlocked: true };
            }
        }
        localStorage.setItem('math_game_progress', JSON.stringify(progress));
    },

    render() {
        const container = document.getElementById('mapContainer');
        if (!container) return;

        container.innerHTML = '';
        const progress = this.getProgress();

        this.allLevels.forEach((levelId) => {
            const node = document.createElement('div');
            node.className = 'level-node';
            const data = progress[levelId];
            const isUnlocked = data && data.unlocked;

            if (isUnlocked) {
                node.classList.add('unlocked');
                const starDisplay = '★'.repeat(data.stars) + '☆'.repeat(3 - data.stars);
                node.innerHTML = `
                    <div class="node-id">${levelId}</div>
                    <div class="node-stars">${starDisplay}</div>
                `;
                node.onclick = () => this.enterLevel(levelId);
            } else {
                node.classList.add('locked');
                node.innerHTML = `<div class="node-id">${levelId}</div><div class="lock-icon">🔒</div>`;
            }
            container.appendChild(node);
        });

        const totalStars = Object.values(progress).reduce((sum, item) => sum + item.stars, 0);
        const starEl = document.querySelector('.total-stars');
        if (starEl) starEl.innerText = totalStars;
    },

    enterLevel(levelId) {
        // 直接呼叫 main.js 提供的全域載入函式
        if (window.loadAndStartLevel) {
            window.loadAndStartLevel(levelId);
        } else {
            console.error("找不到 loadAndStartLevel 函式");
        }
    },

    exitToMap() {
        const mapScreen = document.getElementById('mapScreen');
        const gameScreen = document.getElementById('gameScreen');
        const modal = document.getElementById('modalOverlay');

        if (mapScreen) mapScreen.style.display = 'block';
        if (gameScreen) gameScreen.style.display = 'none';
        if (modal) modal.style.display = 'none';

        this.render();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.GAME_MAP.render();
});