// 模擬來自 PG Soft 官網的真實熱門遊戲資料
const pgSoftGames = [
    { title: "Dragon Hatch", img: "https://www.pgsoft.com/uploads/Games/Images/1de714c6-45c6-4ec1-af48-41f16e915914.jpg" },
    { title: "Dragon Tiger Luck", img: "https://www.pgsoft.com/uploads/Games/Images/65152f6d-f74b-44a9-b0f4-da11fd23fdd0.png" },
    { title: "Fortune Gods", img: "https://www.pgsoft.com/uploads/Games/Images/cd510c21-008d-4227-a8d3-419728cfd2bb.png" },
    { title: "Hip Hop Panda", img: "https://www.pgsoft.com/uploads/Games/Images/dd810b67-48b0-44c0-b303-bb67664ff9c4.png" },
    { title: "Hood vs Wolf", img: "https://www.pgsoft.com/uploads/Games/Images/ac17fa08-db73-4f1b-b757-d62752a76bca.jpg" },
    { title: "Tree Of Fortune", img: "https://www.pgsoft.com/uploads/Games/Images/361b51a2-dc61-4834-a2e2-bb9c9ac60499.png" }
];

function generatePGSoftCards() {
    const grid = document.getElementById('slot-machine-grid');
    if (!grid) return;

    // 按照陣列原始順序顯示
    const selectedGames = pgSoftGames;

    grid.innerHTML = '';

    selectedGames.forEach(game => {
        // 隨機產生 500 ~ 5000 的在線人數
        const players = Math.floor(Math.random() * 4500) + 500;

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

document.addEventListener('DOMContentLoaded', generatePGSoftCards);