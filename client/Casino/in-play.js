async function updateInPlayCards() {
    // 尋找畫面上所有的預留卡片容器 (例如 sports.html 裡會有 3 個)
    const cardElements = document.querySelectorAll('.js-in-play-card');
    if (!cardElements || cardElements.length === 0) return;

    // 定義聯賽與其優先級別 (1 最高, 6 最低) 以及對應的 API
    const leagues = [
        { id: 'nba', name: 'NBA League', priority: 1, url: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard' },
        { id: 'epl', name: 'Premier League', priority: 2, url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard' },
        { id: 'ucl', name: 'Champions League', priority: 3, url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.champions/scoreboard' },
        { id: 'nhl', name: 'NHL', priority: 4, url: 'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard' },
        { id: 'mlb', name: 'MLB', priority: 5, url: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard' },
        { id: 'ufc', name: 'UFC', priority: 6, url: 'https://site.api.espn.com/apis/site/v2/sports/mma/ufc/scoreboard' }
    ];

    try {
        // 並行取得所有聯賽的資料
        const responses = await Promise.allSettled(leagues.map(async (league) => {
            const res = await fetch(league.url);
            const data = await res.json();

            if (!data.events || data.events.length === 0) return null; // 沒有賽事則跳過

            // 1. 尋找 Live 賽事
            let selectedGame = data.events.find(game => game.status.type.state === 'in');
            let isLive = !!selectedGame;

            // 2. 沒有 Live 賽事則尋找已結束的比賽
            if (!selectedGame) {
                const postGames = data.events.filter(game => game.status.type.state === 'post');
                if (postGames.length > 0) {
                    selectedGame = postGames[postGames.length - 1];
                }
            }

            // 3. 再沒有就拿第一場排定的賽事
            if (!selectedGame) {
                selectedGame = data.events[0];
            }

            return { ...league, isLive, game: selectedGame };
        }));

        // 過濾掉取得失敗或沒賽事的聯賽
        const validGames = responses
            .filter(r => r.status === 'fulfilled' && r.value)
            .map(r => r.value);

        // 排序權重：有 Live 的優先 > 若皆為 Live 或皆無 Live 則比對 priority
        validGames.sort((a, b) => {
            if (a.isLive && !b.isLive) return -1;
            if (!a.isLive && b.isLive) return 1;
            return a.priority - b.priority;
        });

        // 依照可用卡片的數量取前 N 筆
        const topGames = validGames.slice(0, cardElements.length);

        topGames.forEach((data, index) => {
            const cardEl = cardElements[index];
            const game = data.game;
            const competition = game.competitions[0];

            // UFC 或其他賽制可能沒有嚴格的 homeAway，做一個 Fallback
            const homeTeamData = competition.competitors.find(c => c.homeAway === 'home') || competition.competitors[0];
            const awayTeamData = competition.competitors.find(c => c.homeAway === 'away') || competition.competitors[1] || competition.competitors[0];

            // 擷取隊伍 / 選手資料的函式
            const getTeamInfo = (c) => {
                const team = c.team || c.athlete || {};
                return {
                    name: team.shortDisplayName || team.displayName || team.name || team.abbreviation || 'TBA',
                    logo: team.logo || (team.flag ? team.flag.href : '') || (c.athlete && c.athlete.headshot ? c.athlete.headshot.href : '') || 'https://placehold.co/24x24/1e293b/fff?text=?',
                    score: c.score || '-',
                    winner: c.winner
                };
            };

            const homeTeam = getTeamInfo(homeTeamData);
            const awayTeam = getTeamInfo(awayTeamData);

            const gameStatus = game.status.type.detail;
            let seriesInfo = gameStatus;
            if (competition.series && competition.series.summary) {
                seriesInfo = `${gameStatus} (${competition.series.summary})`;
            }

            // 動態填寫對應的資料進卡片
            cardEl.innerHTML = `
                <div class="flex justify-between text-[10px] text-secondary mb-1">
                    <span>${data.name}</span>
                    ${data.isLive ? '<span class="text-critical font-bold">● Live</span>' : ''}
                </div>
                <div class="text-[10px] text-secondary mb-3 truncate" title="${seriesInfo}">
                    ${seriesInfo}
                </div>
                <div>
                    <!-- Away Team -->
                    <div class="flex items-center justify-between font-bold text-sm cursor-pointer hover:bg-elevated/50 p-1 -mx-1 rounded transition-colors">
                        <div class="flex items-center space-x-2">
                            <div class="w-6 h-6 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
                                <img src="${awayTeam.logo}" alt="${awayTeam.name}" class="w-full h-full object-contain p-0.5" onerror="this.src='https://placehold.co/24x24/1e293b/fff?text=?'">
                            </div>
                            <span class="truncate max-w-[80px]">${awayTeam.name}</span>
                        </div>
                        <div class="flex items-center">
                            <span>${awayTeam.score}</span>
                            ${awayTeam.winner ? '<svg class="w-3 h-3 ml-1.5 fill-current text-primary" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>' : '<div class="w-3 ml-1.5"></div>'}
                        </div>
                    </div>
                    <!-- Home Team -->
                    <div class="flex items-center justify-between font-bold text-sm cursor-pointer hover:bg-elevated/50 p-1 -mx-1 rounded transition-colors mt-1">
                        <div class="flex items-center space-x-2">
                            <div class="w-6 h-6 rounded-full bg-white flex items-center justify-center overflow-hidden shrink-0">
                                <img src="${homeTeam.logo}" alt="${homeTeam.name}" class="w-full h-full object-contain p-0.5" onerror="this.src='https://placehold.co/24x24/1e293b/fff?text=?'">
                            </div>
                            <span class="truncate max-w-[80px]">${homeTeam.name}</span>
                        </div>
                        <div class="flex items-center">
                            <span>${homeTeam.score}</span>
                            ${homeTeam.winner ? '<svg class="w-3 h-3 ml-1.5 fill-current text-primary" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>' : '<div class="w-3 ml-1.5"></div>'}
                        </div>
                    </div>
                </div>
            `;
        });

    } catch (error) {
        console.error('Failed to fetch in-play matches:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateInPlayCards();
    setInterval(updateInPlayCards, 30000);
});