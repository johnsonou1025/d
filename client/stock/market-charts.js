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

    const indMa = parseSignal(marketStatus.maStatus, 'ma');
    const indBias = parseSignal(marketStatus.biasStatus, 'bias');
    const indMacd = parseSignal(marketStatus.macdStatus, 'macd');
    const indBb = parseSignal(marketStatus.bbTrendStatus, 'bb');

    function updateIndicator(id, data, text) {
        // 移除 Emoji、括號及括號內文字，讓顯示更簡潔
        const cleanText = text ? text.replace(/^[\p{Emoji_Presentation}\s]+/u, '').replace(/\s*\(.*\)\s*$/, '').trim() : '-';
        const nameText = $(`#${id} .name`).text();

        $(`#${id} .dot`).css('background-color', data.color);
        $(`#${id} .name`).text(nameText.replace(':', '') + ':');
        $(`#${id} .value`).text(cleanText); // 填入 API 狀態文字
    }

    updateIndicator('ind-ma', indMa, marketStatus.maStatus);
    updateIndicator('ind-bias', indBias, marketStatus.biasStatus);
    updateIndicator('ind-macd', indMacd, marketStatus.macdStatus);
    updateIndicator('ind-bb', indBb, marketStatus.bbTrendStatus);

    let bullCount = [indMa, indBias, indMacd, indBb].filter(i => i.type === 'bull').length;
    let bearCount = [indMa, indBias, indMacd, indBb].filter(i => i.type === 'bear').length;

    let verdictLabel = marketStatus.finalVerdict || '-';

    // 自動配對建議說明 (作為預設值)
    let verdictDesc = "綜合各項技術指標狀態，建議保持觀望。";
    if (bullCount >= 3) verdictDesc = "技術面多頭訊號明確，建議持多觀察突破。";
    else if (bearCount >= 3) verdictDesc = "技術面空頭訊號強烈，建議保守應對、控管風險。";
    else if (bullCount > bearCount) verdictDesc = "技術面呈現震盪偏多，適合逢低佈局。";
    else if (bearCount > bullCount) verdictDesc = "技術面呈現震盪偏空，注意下檔支撐。";

    // 解析 GAS 回傳的文字格式
    const bracketMatch = verdictLabel.match(/【(.*?)】/);
    if (bracketMatch) {
        // 取出【】裡的文字作為標題，其餘作為說明
        verdictLabel = bracketMatch[1].trim();
        verdictDesc = marketStatus.finalVerdict.replace(bracketMatch[0], '').trim() || verdictDesc;
    } else if (verdictLabel.includes('：') || verdictLabel.includes(':')) {
        // 相容舊版冒號分隔邏輯
        let parts = verdictLabel.split(/：|:/);
        verdictLabel = parts[0].trim();
        verdictDesc = parts[1].trim() || verdictDesc;
    }

    let mainColor = 'var(--text-muted)';
    let strength = 2; // 預設訊號強度為 2 格
    if (verdictLabel.includes('多') || verdictLabel.includes('強')) {
        mainColor = 'var(--success-color)';
        strength = bullCount || 3; // 依多頭指標數作為滿格數
    } else if (verdictLabel.includes('空') || verdictLabel.includes('弱')) {
        mainColor = 'var(--danger-color)';
        strength = bearCount || 3; // 依空頭指標數作為滿格數
    } else {
        mainColor = '#eab308'; // 中立狀態以偏黃顯示
        strength = 2;
    }

    strength = Math.max(1, Math.min(4, strength)); // 確保長條顯示在 1~4 之內

    $('#verdict-label').text(verdictLabel).css('color', mainColor);
    $('#verdict-desc').text(verdictDesc);

    $('#verdict-bars .bar').each(function (index) {
        if (index < strength) {
            $(this).css('background-color', mainColor);
        } else {
            $(this).css('background-color', ''); // 恢復為 CSS 預設的淺灰色
        }
    });

    // --- 2. 指數數值與進度條 ---
    $('#taiex-today').text(marketStatus.closePrice || '-');
    $('#taiex-high').text(marketStatus.high20D || '-');
    $('#taiex-low').text(marketStatus.low20D || '-');

    // 清理字串逗號並轉為數字，因 GAS 傳回的資料可能包含千分位逗號
    const closePrice = parseFloat(String(marketStatus.closePrice).replace(/,/g, ''));
    const high20D = parseFloat(String(marketStatus.high20D).replace(/,/g, ''));
    const low20D = parseFloat(String(marketStatus.low20D).replace(/,/g, ''));

    // 計算進度條比例
    if (!isNaN(closePrice) && !isNaN(high20D) && !isNaN(low20D) && high20D > low20D) {
        let percentage = ((closePrice - low20D) / (high20D - low20D)) * 100;
        // 限制在 0% ~ 100% 之間，避免超跌或突破時破版
        percentage = Math.max(0, Math.min(100, percentage));
        $('#taiex-gauge').css('width', percentage + '%');
    } else {
        $('#taiex-gauge').css('width', '0%');
    }

    $('#market-summary-section').fadeIn(400);
};

/**
 * --- 渲染外部市場數據 (匯率、期貨) ---
 */
window.renderExternalData = function () {
    // 1. 取得美金兌台幣匯率
    // 使用支援 CORS 的公開 API (open.er-api.com)
    $.getJSON('https://open.er-api.com/v6/latest/USD')
        .done(function (data) {
            if (data && data.rates && data.rates.TWD) {
                const rate = parseFloat(data.rates.TWD).toFixed(3);
                $('#usdtwd-rate').text(rate);
            }
        })
        .fail(function () {
            $('#usdtwd-rate').text('讀取失敗');
        });
};