$(function () {
    // 取得 CSS 變數中的顏色，確保圖表隨著主題自動搭配
    const rootStyle = getComputedStyle(document.documentElement);
    const textColor = rootStyle.getPropertyValue('--text-muted').trim() || '#94A3B8';
    const gridColor = rootStyle.getPropertyValue('--border-color').trim() || '#334155';
    const accentColor = rootStyle.getPropertyValue('--accent-color').trim() || '#3B82F6';

    // 設定 Chart.js 全局預設樣式
    Chart.defaults.color = textColor;
    Chart.defaults.font.family = rootStyle.getPropertyValue('--font-family').trim() || 'sans-serif';

    // 通用渲染圖表函式
    function renderTrendChart(canvasId, labels, dataPoints, lineColor) {
        const ctx = document.getElementById(canvasId).getContext('2d');

        // 建立漸層背景 (讓折線圖下方有平滑半透明效果)
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, lineColor + '40'); // 透明度 25%
        gradient.addColorStop(1, lineColor + '00'); // 透明度 0%

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    data: dataPoints,
                    borderColor: lineColor,
                    backgroundColor: gradient,
                    borderWidth: 2,
                    pointRadius: 0,           // 隱藏平時的數據點
                    pointHoverRadius: 5,      // Hover 時才顯示圓點
                    fill: true,
                    tension: 0.3              // 曲線平滑度
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,   // 允許透過 CSS 控制固定高度
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        displayColors: false,
                        callbacks: {
                            label: function (context) {
                                return context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { maxTicksLimit: 6 } // 限制 X 軸日期數量避免重疊
                    },
                    y: {
                        grid: { color: gridColor },
                        border: { display: false }
                    }
                },
                interaction: { mode: 'nearest', axis: 'x', intersect: false }
            }
        });
    }

    // --- 模擬取得近 30 天數據 (未來若有真實 API 可從此處替換) ---
    function generateMockData(startValue, volatility) {
        let data = [], labels = [], currentValue = startValue, today = new Date();
        for (let i = 29; i >= 0; i--) {
            let d = new Date(today); d.setDate(d.getDate() - i);
            labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
            currentValue = currentValue + (Math.random() - 0.45) * volatility;
            data.push(Math.round(currentValue));
        }
        return { labels, data };
    }

    const taiexData = generateMockData(21000, 300); // 產生加權指數模擬資料
    const tpexData = generateMockData(250, 5);      // 產生櫃買指數模擬資料

    // 繪製圖表
    renderTrendChart('taiex-chart', taiexData.labels, taiexData.data, accentColor);
    renderTrendChart('tpex-chart', tpexData.labels, tpexData.data, accentColor);
});