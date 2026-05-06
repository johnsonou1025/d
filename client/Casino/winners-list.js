// Fake Live Winners Generator
const winnerList = document.getElementById('winner-list');
const fakeNames = ['Jacob Jones', 'Courtney Henry', 'Dianne Russell', 'Cody Fisher', 'Eleanor Pena', 'Ralph Edwards', 'Arlene McCoy'];
const fakeFlags = ['🇺🇸', '🇬🇧', '🇨🇦', '🇦🇺', '🇩🇪', '🇫🇷', '🇯🇵', '🇧🇷', '🇰🇷'];
const fakeColors = ['bg-pink-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500', 'bg-indigo-500'];

function generateFakeWin() {
    const name = fakeNames[Math.floor(Math.random() * fakeNames.length)];
    const flag = fakeFlags[Math.floor(Math.random() * fakeFlags.length)];
    const color = fakeColors[Math.floor(Math.random() * fakeColors.length)];
    const amount = (Math.random() * 1500 + 10).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const winItem = document.createElement('div');
    winItem.className = 'animate-fade-in-down';
    winItem.innerHTML = `
        <div class="bg-surface border border-elevated p-3 rounded-2xl w-full">
            <div class="flex justify-between items-center">
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 rounded-full ${color} flex-shrink-0"></div>
                    <span class="text-[10px] font-bold text-secondary flex items-center">${name} <span class="ml-1 text-xs">${flag}</span></span>
                </div>
                <span class="text-[11px] font-bold text-warning font-mono">$${amount}</span>
            </div>
        </div>
    `;

    winnerList.insertAdjacentElement('afterbegin', winItem);

    // Keep the list to a maximum of 15 items to prevent performance issues
    if (winnerList.children.length > 15) {
        winnerList.lastElementChild.remove();
    }

    // Schedule next fake win (between 1.5s and 4s)
    setTimeout(generateFakeWin, Math.random() * 2500 + 1500);
}

// Start the generator
if (winnerList) {
    setTimeout(generateFakeWin, 2000);
}