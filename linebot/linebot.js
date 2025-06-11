var CHANNEL_ACCESS_TOKEN = '1LHRoZn+/LbROB0O7CYy24Eau3x+gEv9WVUXzhwfVT9lMWN47+oZVjWhQhDOo17dbJJ6unvUX+yfI7d15JjLdkkl5T2Sw5XpEPlA7x9VIw+krV5B9/kr+52daAbeZD/YHV1FWRCuM9hgAPJ745KESAdB04t89/1O/w1cDnyilFU=';
var message = new Array();


//line機械人主結構
function doPost(e) {

    /*--取得對話訊息--*/
    var msg = JSON.parse(e.postData.contents);
    console.log(msg);
    // 取出 replayToken 和發送的訊息文字
    var replyToken = msg.events[0].replyToken;
    var userMessage = msg.events[0].message.text;
    var groupId = msg.events[0].source;
    //將訊息存成陣列（指令 關鍵字 內容）
    var userMessageArray = new Array();
    var rangeName, rangeType, rangeContent;
    if (userMessage == undefined) {
        userMessage = "";
    } else {
        userMessageArray = userMessage.split(/\s/);
    }

    /*--和google docs sheet串連--*/
    //比對 google docs 資料
    var urlGoogleDocs = 'https://docs.google.com/spreadsheets/d/1vpAWvon2yDTEYfL6XIzgxbnT1YWim0Vr31T0gYbdQvs/edit?usp=sharing';
    var SpreadSheet = SpreadsheetApp.openByUrl(urlGoogleDocs);
    var messageType;


    /*--判斷指令--*/
    if (userMessage.indexOf("歐巴油價") >= 0) {
        var oil = Oil(SpreadSheet);
        userMessage = oil;
    } else if (userMessageArray.indexOf("歐巴滾") >= 0) {
        if (typeof msg.events[0].source.roomId === 'undefined') {
            UrlFetchApp.fetch("https://api.line.me/v2/bot/group/" + msg.events[0].source.groupId + "/leave", {
                'headers': {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
                },
                'method': 'post',
            });
        } else {
            UrlFetchApp.fetch("https://api.line.me/v2/bot/room/" + msg.events[0].source.roomId + "/leave", {
                'headers': {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
                },
                'method': 'post',
            });
        }
    }

    //當對話訊息為不可辨示時，跳出
    if (typeof replyToken === 'undefined') {
        return;
    }
}

/*-----油價-----*/
function Oil(SpreadSheet) {
    //讀取文件的chat頁籤
    var SheetName = SpreadSheet.getSheetByName("oil");
    //取得列最後一位置數字
    var lastRow = SheetName.getLastRow();
    //讀取到值，並將讀到的陣列轉成字串
    var getContent = SheetName.getSheetValues(1, 4, 1, 1).join('');
    userMessage = getContent;
    return userMessage;
}

function oilTest() {
    var urlGoogleDocs = 'https://docs.google.com/spreadsheets/d/1vpAWvon2yDTEYfL6XIzgxbnT1YWim0Vr31T0gYbdQvs/edit?usp=sharing';
    var SpreadSheet = SpreadsheetApp.openByUrl(urlGoogleDocs);
    var oil = Oil(SpreadSheet);
    userMessage = oil;
    doReplyText(userMessage);
}


/*-----leave----*/
function robotLeave() {
    UrlFetchApp.fetch("https://api.line.me/v2/bot/room/" + "R68f47c7c3f803a61e5c3edafb09a9b74" + "/leave", {
        'headers': {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
        },
        'method': 'post',
    });
}




/*歐巴回覆*/
// 文字訊息
function doReplyText(userMessage) {
    //執行reply行為
    UrlFetchApp.fetch("https://api.line.me/v2/bot/message/push", {
        'headers': {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
        },
        'method': 'post',
        //'muteHttpExceptions' : true,
        'payload': JSON.stringify({
            'to': 'U5720921a03894f552323e6796793eec5',
            'messages': [{
                'type': 'text',
                'text': userMessage,
            }],
        }),
    });
    // UrlFetchApp.fetch 結束 
}
// 圖片訊息
function doReplyImage(userMessage) {
    //執行reply行為 
    UrlFetchApp.fetch("https://api.line.me/v2/bot/message/push", {
        'headers': {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
        },
        'method': 'post',
        //'muteHttpExceptions' : true,
        'payload': JSON.stringify({
            'to': 'U5720921a03894f552323e6796793eec5',
            'messages': [{
                "type": "image",
                "originalContentUrl": userMessage,
                "previewImageUrl": userMessage
            }],
        }),
    });
    // UrlFetchApp.fetch 結束 
}