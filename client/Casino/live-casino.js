// 模擬來自 Evolution Gaming 官網的真實熱門真人視訊遊戲資料
const liveCasinoGames = [
    // 透過官網 <figure> 內的 <img> 取得的真實遊戲預覽圖
    { title: "LIVE EUROPEAN ROULETTE", img: "https://www.evolution.com/wp-content/uploads/2022/01/european_roulette_pid_2.jpg" },
    { title: "CRAPS", img: "https://www.evolution.com/wp-content/uploads/2022/01/craps_pid_16.jpg" },
    { title: "POWER BLACKJACK", img: "https://www.evolution.com/wp-content/uploads/2022/01/power_blackjack_pid_11-300x300.jpg" },
    { title: "BACCARAT", img: "https://www.evolution.com/wp-content/uploads/2022/01/bacarrat_pid_3.jpg" },
    { title: "DRAGON TIGER", img: "https://www.evolution.com/wp-content/uploads/2022/01/dragon_tiger_pid_8.jpg" },
    { title: "ULTIMATE TEXAS HOLD’EM", img: "https://www.evolution.com/wp-content/uploads/2022/01/2_hand_holdem_pid_12.jpg" }
];

function generateLiveCasinoCards() {
    const grid = document.getElementById('live-casino-grid');
    if (!grid) return;

    // 按照陣列原始順序顯示
    const selectedGames = liveCasinoGames;

    grid.innerHTML = '';

    selectedGames.forEach(game => {
        // 隨機產生 1000 ~ 10000 的在線人數 (Live Casino 的玩家人數通常比較多)
        const players = Math.floor(Math.random() * 10000) + 1000;

        const cardHTML = `
            <div class="group flex flex-col cursor-pointer snap-start">
                <div class="w-full aspect-square rounded-xl mb-2 relative flex items-end p-3">
                    <div class="absolute inset-0 overflow-hidden rounded-xl z-0">
                        <img src="${game.img}" alt="${game.title}" class="w-full h-full object-cover transition-all duration-300 group-hover:blur-[2px] group-hover:scale-110 group-hover:brightness-75">
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent z-10 rounded-xl pointer-events-none"></div>
                    <div class="absolute inset-0 transition-colors duration-300 group-hover:bg-black/20 z-20 pointer-events-none rounded-xl"></div>
                    <h3 class="text-white font-bold text-sm leading-tight drop-shadow-md relative z-30">${game.title}</h3>
                </div>
                <div class="flex items-center text-xs text-gray-400 px-1">
                    <span class="w-2 h-2 rounded-full bg-[#00ff00] mr-1.5 shadow-[0_0_4px_#00ff00]"></span>
                    <span>${players.toLocaleString()} 在玩</span>
                </div>
            </div>
        `;
        grid.insertAdjacentHTML('beforeend', cardHTML);
    });
}

document.addEventListener('DOMContentLoaded', generateLiveCasinoCards);