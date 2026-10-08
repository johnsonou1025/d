/**
 * --- 渲染市場指數 (由 API 取得數據) ---
 */
window.renderMarketSummary = function (marketStatus) {
    if (!marketStatus) return;

    // --- 1. 多空判斷渲染 ---
    // 輔助函式：透過字串關鍵字判斷訊號為多、空或中立
    function parseSignal(text, type) {
        if (!text) return {
            type: 'neutral',
            color: 'var(--text-muted)'
        };
        // 1. 預先對應明確定義的狀態 (綠、黃、紅)
        if (text.includes('多頭排列') || text.includes('安全動能') || text.includes('多頭主控') || text.includes('中軌走揚')) {
            return { type: 'bull', color: 'var(--success-color)' }; // 綠
        } else if (text.includes('短線過熱') || text.includes('長線多空轉折期') || text.includes('中軌橫盤震盪') || text.includes('多頭減速') || text.includes('空頭收斂')) {
            return { type: 'neutral', color: '#eab308' }; // 黃
        } else if (text.includes('蓋頂空頭') || text.includes('動能渙散') || text.includes('空頭控制') || text.includes('中軌下彎') || text.includes('空頭主控')) {
            return { type: 'bear', color: 'var(--danger-color)' }; // 紅
        }
        // 2. 針對「短線乖離」等特定指標的專屬防呆判定
        if (type === 'bias') {
            if (text.includes('過熱') || text.includes('乖離過大')) {
                return { type: 'neutral', color: '#eab308' }; // 過熱為黃色警示
            } else if (text.includes('負乖離') || text.includes('超跌')) {
                return { type: 'bull', color: 'var(--success-color)' }; // 跌深反彈視為多方機會 (綠)
            }
        }
        // 3. 通用備用關鍵字判斷
        if (text.includes('多') || text.includes('上') || text.includes('正') || text.includes('強')) {
            return { type: 'bull', color: 'var(--success-color)' };
        } else if (text.includes('空') || text.includes('下') || text.includes('負') || text.includes('跌') || text.includes('弱')) {
            return { type: 'bear', color: 'var(--danger-color)' };
        }
        return { type: 'neutral', color: 'var(--text-muted)' }; // 如果以上條件都不符合，回傳中立
    }

    function formatNumber(numStr) {
        if (!numStr || numStr === '-') return '-';
        const n = parseFloat(String(numStr).replace(/,/g, ''));
        if (isNaN(n)) return numStr;
        return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    const indMa = parseSignal(marketStatus.maStatus, 'ma');
    const indBias = parseSignal(marketStatus.biasStatus, 'bias');
    const indMacd = parseSignal(marketStatus.macdStatus, 'macd');
    const indBb = parseSignal(marketStatus.bbTrendStatus, 'bb');

    function updateIndicator(id, data, text) {
        const cleanText = text ? text.replace(/^[\p{Emoji_Presentation}\s]+/u, '').replace(/\s*\(.*\)\s*$/, '').trim() : '-';
        $(`#${id} .dot`).css({ 'background-color': data.color, 'color': data.color });
        $(`#${id} .value`).text(cleanText);
    }

    updateIndicator('ind-ma', indMa, marketStatus.maStatus);
    updateIndicator('ind-bias', indBias, marketStatus.biasStatus);
    updateIndicator('ind-macd', indMacd, marketStatus.macdStatus);
    updateIndicator('ind-bb', indBb, marketStatus.bbTrendStatus);

    let bullCount = [indMa, indBias, indMacd, indBb].filter(i => i.type === 'bull').length;
    let bearCount = [indMa, indBias, indMacd, indBb].filter(i => i.type === 'bear').length;

    // 2. 綜合研判燈號標籤與說明
    let verdictLabel = marketStatus.finalVerdict || '-';
    let verdictDesc = "綜合各項技術指標狀態，建議保持觀望。";
    if (bullCount >= 3) verdictDesc = "技術面多頭訊號明確，建議持多觀察突破。";
    else if (bearCount >= 3) verdictDesc = "技術面空頭訊號強烈，建議保守應對、控管風險。";
    else if (bullCount > bearCount) verdictDesc = "技術面呈現震盪偏多，適合逢低佈局。";
    else if (bearCount > bullCount) verdictDesc = "技術面呈現震盪偏空，注意下檔支撐。";

    const bracketMatch = verdictLabel.match(/【(.*?)】/);
    if (bracketMatch) {
        verdictLabel = bracketMatch[1].trim();
        verdictDesc = marketStatus.finalVerdict.replace(bracketMatch[0], '').replace(/^[\p{Emoji_Presentation}\s]+/u, '').trim() || verdictDesc;
    } else if (verdictLabel.includes('：') || verdictLabel.includes(':')) {
        let parts = verdictLabel.split(/：|:/);
        verdictLabel = parts[0].replace(/^[\p{Emoji_Presentation}\s]+/u, '').trim();
        verdictDesc = parts[1].trim() || verdictDesc;
    } else {
        verdictDesc = marketStatus.finalVerdict ? marketStatus.finalVerdict.replace(/^[\p{Emoji_Presentation}\s]+/u, '').trim() : verdictDesc;
    }

    // 燈號標籤文字與樣式 (符合 Casino Bet Pro 視覺)
    let badgeText = `${verdictLabel} 🟢`;
    let badgeBg = 'rgba(0, 231, 1, 0.15)';
    let badgeBorder = 'rgba(0, 231, 1, 0.4)';
    let badgeColor = '#00E701';

    if (verdictLabel.includes('多') || verdictLabel.includes('強')) {
        badgeText = bullCount >= 3 ? '多頭主控燈號 🟢' : `${verdictLabel} 🟢`;
        badgeBg = 'rgba(0, 231, 1, 0.15)';
        badgeBorder = 'rgba(0, 231, 1, 0.4)';
        badgeColor = '#00E701';
    } else if (verdictLabel.includes('空') || verdictLabel.includes('弱')) {
        badgeText = bearCount >= 3 ? '空頭防禦燈號 🔴' : `${verdictLabel} 🔴`;
        badgeBg = 'rgba(255, 51, 102, 0.15)';
        badgeBorder = 'rgba(255, 51, 102, 0.4)';
        badgeColor = '#FF3366';
    } else {
        badgeText = `${verdictLabel} 🟡`;
        badgeBg = 'rgba(234, 179, 8, 0.15)';
        badgeBorder = 'rgba(234, 179, 8, 0.4)';
        badgeColor = '#eab308';
    }

    $('#verdict-label')
        .text(badgeText)
        .css({
            'background-color': badgeBg,
            'border-color': badgeBorder,
            'color': badgeColor
        });
    $('#verdict-desc').text(verdictDesc);

    // 3. 今日加權指數大字與乖離動能標籤
    const rawClose = marketStatus.closePrice || '-';
    $('#taiex-today').text(formatNumber(rawClose));

    // 動能乖離率標籤 (從 biasStatus 取得，例如 "🟢 安全動能 (1.37%)")
    let biasText = marketStatus.biasStatus ? marketStatus.biasStatus.replace(/^[\p{Emoji_Presentation}\s]+/u, '').trim() : '';
    if (biasText) {
        $('#taiex-bias-badge')
            .text(biasText)
            .css('color', indBias.color)
            .css('border-color', indBias.color === 'var(--success-color)' ? 'rgba(0, 231, 1, 0.3)' : 'rgba(234, 179, 8, 0.3)')
            .show();
    } else {
        $('#taiex-bias-badge').hide();
    }

    // 4. 指數支撐壓力數值與雷達滑軌
    $('#taiex-high').text(formatNumber(marketStatus.high20D));
    $('#taiex-low').text(formatNumber(marketStatus.low20D));

    const closePrice = parseFloat(String(marketStatus.closePrice).replace(/,/g, ''));
    const high20D = parseFloat(String(marketStatus.high20D).replace(/,/g, ''));
    const low20D = parseFloat(String(marketStatus.low20D).replace(/,/g, ''));

    if (!isNaN(closePrice) && !isNaN(high20D) && !isNaN(low20D) && high20D > low20D) {
        let percentage = ((closePrice - low20D) / (high20D - low20D)) * 100;
        percentage = Math.max(0, Math.min(100, percentage));
        const roundedPct = Math.round(percentage);

        let posLabel = `● 當前位置 (${roundedPct}% 極度亢奮)`;
        let posColor = '#00E701';

        if (roundedPct >= 80) {
            posLabel = `● 當前位置 (${roundedPct}% 極度亢奮)`;
            posColor = '#00E701';
        } else if (roundedPct >= 60) {
            posLabel = `● 當前位置 (${roundedPct}% 多頭控盤)`;
            posColor = '#00E701';
        } else if (roundedPct >= 40) {
            posLabel = `● 當前位置 (${roundedPct}% 中性震盪)`;
            posColor = '#eab308';
        } else if (roundedPct >= 20) {
            posLabel = `● 當前位置 (${roundedPct}% 偏空回檔)`;
            posColor = '#FF3366';
        } else {
            posLabel = `● 當前位置 (${roundedPct}% 超跌恐慌)`;
            posColor = '#FF3366';
        }

        $('#taiex-pos-label').text(posLabel).css('color', posColor);
        $('#taiex-gauge').css('width', percentage + '%');
    } else {
        $('#taiex-gauge').css('width', '0%');
        $('#taiex-pos-label').text('● 當前位置');
    }

    $('#market-summary-section').fadeIn(400);
};

/**
 * --- 渲染外部市場數據 (匯率、期貨) ---
 */
window.renderExternalData = function (forceRefresh = false) {
    const USD_CACHE_KEY = 'JOINJO_USDTWD_CACHE_V1';
    if (!forceRefresh) {
        try {
            const cached = localStorage.getItem(USD_CACHE_KEY);
            if (cached) {
                const { rate, timestamp } = JSON.parse(cached);
                // 匯率若在 2 小時內，直接使用快取數值
                if (Date.now() - timestamp < 2 * 60 * 60 * 1000) {
                    $('#usdtwd-rate').text(rate);
                    return;
                }
            }
        } catch (e) {}
    }

    // 1. 取得美金兌台幣匯率 (使用支援 CORS 的公開 API)
    $.getJSON('https://open.er-api.com/v6/latest/USD')
        .done(function (data) {
            if (data && data.rates && data.rates.TWD) {
                const rate = parseFloat(data.rates.TWD).toFixed(3);
                $('#usdtwd-rate').text(rate);
                try {
                    localStorage.setItem(USD_CACHE_KEY, JSON.stringify({ rate, timestamp: Date.now() }));
                } catch (e) {}
            }
        })
        .fail(function () {
            if (!$('#usdtwd-rate').text() || $('#usdtwd-rate').text() === '-') {
                $('#usdtwd-rate').text('讀取失敗');
            }
        });
};