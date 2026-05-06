function initFIFACountdown() {
    // 設定 FIFA World Cup 2026 開賽目標日期 (2026-06-11 UTC)
    const targetDate = new Date('2026-06-11T00:00:00Z').getTime();

    const daysElement = document.getElementById('fifa-days');
    const hoursElement = document.getElementById('fifa-hours');
    const minsElement = document.getElementById('fifa-mins');
    const secsElement = document.getElementById('fifa-secs');

    // 若找不到對應的 DOM，則不執行
    if (!daysElement || !hoursElement || !minsElement || !secsElement) return;

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            // 倒數結束時歸零
            daysElement.textContent = "00";
            hoursElement.textContent = "00";
            minsElement.textContent = "00";
            secsElement.textContent = "00";
            return;
        }

        // 計算天、時、分、秒
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // 更新 HTML 的內容，並保持 2 位數的格式 (例如 09)
        daysElement.textContent = String(days).padStart(2, '0');
        hoursElement.textContent = String(hours).padStart(2, '0');
        minsElement.textContent = String(minutes).padStart(2, '0');
        secsElement.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown(); // 網頁載入時立刻更新一次
    setInterval(updateCountdown, 1000); // 之後每 1000 毫秒 (1秒) 更新一次
}

document.addEventListener('DOMContentLoaded', initFIFACountdown);