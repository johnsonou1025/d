async function updateNBAMatchCard() {
    const leagueCard = document.getElementById('nba-league');
    if (!leagueCard) return;

    try {
        // 使用 ESPN 的公開 API 來獲取每日 NBA 賽事實時資料
        const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard');
        const data = await response.json();

        console.log('NBA 賽事資訊:', data);

        if (data.events && data.events.length > 0) {
            // 取當天列表中的第一場賽事
            const game = data.events[0];
            const competition = game.competitions[0];

            // 取得主客隊資料 (ESPN 通常分類為 'home' 與 'away')
            const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
            const awayTeam = competition.competitors.find(c => c.homeAway === 'away');

            // 狀態與系列賽資訊 (季後賽時會有 series，否則顯示目前比賽節數或 Final)
            const gameStatus = game.status.type.detail;
            let seriesInfo = gameStatus;
            if (competition.series && competition.series.summary) {
                seriesInfo = `${gameStatus} (${competition.series.summary})`;
            }

            // 判斷是否為 Live 狀態
            const isLive = game.status.type.state === 'in';

            // 動態替換 #nba-league 內的 HTML 結構
            leagueCard.innerHTML = `
                <div class="flex justify-between text-[10px] text-gray-500 mb-1">
                    <span>NBA League</span>
                    ${isLive ? '<span class="text-red-500">● Live</span>' : ''}
                </div>
                <div class="text-[10px] text-gray-500 mb-3 truncate" title="${seriesInfo}">
                    ${seriesInfo}
                </div>
                <div>
                    <!-- Away Team -->
                    <div class="flex items-center justify-between font-bold text-sm cursor-pointer hover:bg-gray-800/50 p-1 -mx-1 rounded transition-colors">
                        <div class="flex items-center space-x-2">
                            <div class="w-6 h-6 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
                                <img src="${awayTeam.team.logo}" alt="${awayTeam.team.abbreviation}" class="w-full h-full object-contain p-0.5">
                            </div>
                            <span class="truncate max-w-[80px]">${awayTeam.team.shortDisplayName}</span>
                        </div>
                        <div class="flex items-center">
                            <span>${awayTeam.score}</span>
                            ${awayTeam.winner ? '<svg class="w-3 h-3 ml-1.5 fill-current text-white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>' : '<div class="w-3 ml-1.5"></div>'}
                        </div>
                    </div>
                    <!-- Home Team -->
                    <div class="flex items-center justify-between font-bold text-sm cursor-pointer hover:bg-gray-800/50 p-1 -mx-1 rounded transition-colors">
                        <div class="flex items-center space-x-2">
                            <div class="w-6 h-6 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
                                <img src="${homeTeam.team.logo}" alt="${homeTeam.team.abbreviation}" class="w-full h-full object-contain p-0.5">
                            </div>
                            <span class="truncate max-w-[80px]">${homeTeam.team.shortDisplayName}</span>
                        </div>
                        <div class="flex items-center">
                            <span>${homeTeam.score}</span>
                            ${homeTeam.winner ? '<svg class="w-3 h-3 ml-1.5 fill-current text-white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>' : '<div class="w-3 ml-1.5"></div>'}
                        </div>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Failed to fetch NBA matches:', error);
    }
}

// 頁面載入後自動執行抓取資料
document.addEventListener('DOMContentLoaded', updateNBAMatchCard);