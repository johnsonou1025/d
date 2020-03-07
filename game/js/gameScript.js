$(function() {
    // 問題初始化
    var que = new Array();
    // step1 點擊啟動遊戲按鈕隨機產生路線
    $(".question-button").click(function() {
        // 舊地圖清除
        reset();
        // 製作地圖
        makeQue();
        // 答案清除
        resetAnswer()
    });
    // step2 輸入答案
    var ans = new Array();
    $(".direction-wrap button").click(function() {
        $(".answer-wrap .answer-direction").append($(this).clone());
        var clickNum = $(this).attr("data-num");
        ans.push(clickNum);
        $(".answer-number").text(ans);
    });
    // step3 答案和問題比對
    var walk;
    $(".answer-match").click(function() {
        if (que.join("") == ans.join("")) {
            $(".answer-result").text("你很利害喔!");
            // 正確則執行動畫
            $(".start").addClass("active");
            walk = setInterval(startWalk, 1000);
        } else {
            // 錯誤清空答案
            $(".answer-result").text("差一點，再試試看～");
            resetAnswer();
        }
    });
    // 清空答案
    function resetAnswer() {
        $(".answer-number").empty();
        ans.length = 0;
    }
    // 清除地圖
    function reset() {
        que.length = 0;
        que[0] = 1;
        $(".map-wrap .start").empty();
        $(".map-wrap i").removeClass("active");
        $(".answer-wrap .answer-direction").empty();
    }
    // 製作地圖
    function makeQue() {
        // 起點
        que[0] = 1;
        num = Math.floor(Math.random() * 3) + 1;
        que.push(num);
        if (num == 1) {
            addMap(num);
            num = Math.floor(Math.random() * 3) + 1;
            que.push(num);
        }
        if (num == 2) {
            addMap(num);
            num = 4;
            que.push(num);
        }
        if (num == 3) {
            addMap(num);
            num = 6;
            que.push(num);
        }
        if (num == 4) {
            addMap(num);
            num = Math.floor(Math.random() * 2) + 4;
            que.push(num);
        }
        if (num == 5) {
            addMap(num);
            num = 1;
            que.push(num);
        }
        if (num == 6) {
            addMap(num);
            num = Math.floor(Math.random() * 2) + 6;
            que.push(num);
        }
        if (num == 7) {
            addMap(num);
            num = 1;
            que.push(num);
        }
        // 將地圖圖像化
        addMap(num);
        $(".map-wrap i")
            .last()
            .append("<i class='icon-end'></i>");
        // 將地圖數字化
        $(".question-number").text(que);
    }
    // 地圖數字圖像化
    function addMap(num) {
        $(".map-wrap i")
            .last()
            .append("<i class='icon-" + num + "'></i>");
    }

    // 答案正確時執行動畫
    var runNum = 0;

    function startWalk() {
        if (
            $("i.active")
            .last()
            .children("i").length <= 0
        ) {
            clearInterval(walk);
            console.log("stop");
        } else {
            $("i.active")
                .last()
                .children("i")
                .addClass("active");
            runNum++;
            console.log(
                runNum +
                "   " +
                $("i.active")
                .last()
                .children("i").length
            );
        }
    }
})