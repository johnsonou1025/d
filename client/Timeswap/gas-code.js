/**
 * TimeQuest 後端核心邏輯 V2
 * 整合多人 ID 篩選與 UI 欄位對應
 */

const FAMILY_ID = "Home01"; // 可根據不同家庭修改前綴
const API_KEY = "TQ-2026-STRICT-AUTH"; // 前端呼叫時需帶入此 Key

// 取得工作表輔助函式
function getSheet(name) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = `${FAMILY_ID}_${name}`;
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) throw new Error(`找不到工作表: ${sheetName}`);
    return sheet;
}

// --- GET 請求：讀取資料 ---
function doGet(e) {
    if (!e || !e.parameter) {
        return response({ success: false, message: "缺少必要參數 (Missing parameters)" });
    }

    const action = e.parameter.action;

    try {
        let result;
        switch (action) {
            case 'getInitialData': // 登入頁面用
                result = {
                    members: getSheetData(getSheet('Members')),
                    tasks: getSheetData(getSheet('Tasks'))
                };
                break;

            case 'getChildDashboard': // 個人儀表板用
                const memberName = e.parameter.memberId; // e.g., "Cooper"
                const memberInfo = getSheetData(getSheet('Members')).find(m => m.Name === memberName);

                if (!memberInfo) {
                    throw new Error(`在 Home01_Members 中找不到名稱為 "${memberName}" 的成員`);
                }
                const memberId = memberInfo.MemberID; // e.g., "M01"

                result = {
                    memberInfo: memberInfo,
                    dailyTasks: getDailyTasksWithStatus(memberId),
                    todayEarned: getTodayEarned(memberId)
                };
                break;

            case 'getStats': // 統計報表用
                result = calculateWeeklyStats();
                break;

            default:
                throw new Error("無效的 Action");
        }
        return response(result);
    } catch (f) {
        return response({ success: false, message: f.toString() });
    }
}

// --- POST 請求：寫入資料 ---
function doPost(e) {
    if (!e || !e.postData || !e.postData.contents) {
        return response({ success: false, message: "無效的請求內容 (Invalid request body)" });
    }

    const params = JSON.parse(e.postData.contents);
    if (params.apiKey !== API_KEY) return response({ success: false, message: "Unauthorized" });

    try {
        switch (params.action) {
            case 'updateTask': // 勾選家事
                return handleTaskToggle(params);
            case 'adjustTime': // 手動調整時間 (家長後台)
                return handleTimeAdjustment(params);
            case 'deleteTask': // 刪除任務 (家長後台)
                return handleTaskDelete(params);
            case 'addTask': // 新增任務 (家長後台)
                return handleTaskAdd(params);
            case 'setTotalTime': // 計時器暫停/結束時，直接覆寫剩餘時間
                return handleSetTotalTime(params);
            case 'addMember':
                return handleAddMember(params);
            case 'deleteMember':
                return handleDeleteMember(params);
            default:
                throw new Error("無效的 POST Action");
        }
    } catch (f) {
        return response({ success: false, message: f.toString() });
    }
}

// --- 功能邏輯實作 ---

function getDailyTasksWithStatus(memberId) {
    const tasks = getSheetData(getSheet('Tasks'));
    const checks = getSheetData(getSheet('DailyCheck'));
    const today = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd");

    return tasks.map(t => {
        const check = checks.find(c =>
            Utilities.formatDate(new Date(c.Date), "GMT+8", "yyyy-MM-dd") === today &&
            c.MemberID === memberId &&
            c.TaskID === t.TaskID
        );
        return { ...t, status: check ? check.Status : 0 };
    });
}

function getTodayEarned(memberId) {
    const logs = getSheetData(getSheet('ActivityLogs'));
    const today = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd");
    return logs
        .filter(l => l.MemberID === memberId && l.Type === 'EARN' && Utilities.formatDate(new Date(l.Timestamp), "GMT+8", "yyyy-MM-dd") === today)
        .reduce((sum, l) => sum + Number(l.Change), 0);
}

function handleTaskToggle(p) {
    const sheet = getSheet('DailyCheck');
    const data = sheet.getDataRange().getValues();
    const today = Utilities.formatDate(new Date(), "GMT+8", "yyyy-MM-dd");

    let found = false;
    let previousStatus = 0;
    let checkRow = -1;

    for (let i = 1; i < data.length; i++) {
        if (Utilities.formatDate(new Date(data[i][0]), "GMT+8", "yyyy-MM-dd") === today && data[i][1] === p.memberId && data[i][2] === p.taskId) {
            previousStatus = data[i][3];
            checkRow = i + 1;
            found = true;
            break;
        }
    }

    // 狀態轉為數字 (1: 完成, 0: 未完成)
    const newStatus = p.status ? 1 : 0;
    if (found && previousStatus == newStatus) return response({ success: true });

    if (found) {
        sheet.getRange(checkRow, 4).setValue(newStatus);
    } else {
        sheet.appendRow([new Date(), p.memberId, p.taskId, newStatus, new Date().toLocaleTimeString()]);
    }

    // --- 新增：同步更新可用時間與紀錄 ---
    const tasks = getSheetData(getSheet('Tasks'));
    const task = tasks.find(t => t.TaskID === p.taskId);
    const reward = task ? Number(task.Reward || task.reward || 0) : 0;

    if (reward > 0) {
        const memSheet = getSheet('Members');
        const memData = memSheet.getDataRange().getValues();
        for (let i = 1; i < memData.length; i++) {
            if (memData[i][0] === p.memberId) {
                const currentTotal = Number(memData[i][2]);
                const timeChange = newStatus === 1 ? reward : -reward;

                memSheet.getRange(i + 1, 3).setValue(currentTotal + timeChange); // 更新總時間

                const logSheet = getSheet('ActivityLogs');
                logSheet.appendRow([new Date(), p.memberId, 'EARN', `任務: ${task.TaskName || task.Name}`, timeChange, newStatus === 1 ? '完成家事' : '取消完成']);
                break;
            }
        }
    }

    return response({ success: true });
}

function handleTimeAdjustment(p) {
    const memSheet = getSheet('Members');
    const logSheet = getSheet('ActivityLogs');
    const memData = memSheet.getDataRange().getValues();

    for (let i = 1; i < memData.length; i++) {
        if (memData[i][0] === p.memberId) {
            const current = Number(memData[i][2]);
            const change = Number(p.minutes);
            memSheet.getRange(i + 1, 3).setValue(current + change);

            logSheet.appendRow([new Date(), p.memberId, change > 0 ? 'ADJUST' : 'SPEND', p.description || '家長調整', change, p.reason || '']);
            return response({ success: true, newTotal: current + change });
        }
    }
}

function handleSetTotalTime(p) {
    const memSheet = getSheet('Members');
    const logSheet = getSheet('ActivityLogs');
    const memData = memSheet.getDataRange().getValues();

    for (let i = 1; i < memData.length; i++) {
        if (memData[i][0] === p.memberId) {
            const current = Number(memData[i][2]);
            const newTotal = Number(p.remainingMinutes);
            const change = newTotal - current;

            memSheet.getRange(i + 1, 3).setValue(newTotal); // 寫入最新剩餘時間

            if (change !== 0) {
                // 將使用掉的時間寫入 Logs，方便家長後台追蹤
                logSheet.appendRow([new Date(), p.memberId, 'SPEND', '使用 3C 計時器', change, '系統自動更新 (暫停/結束)']);
            }
            return response({ success: true, newTotal: newTotal });
        }
    }
    throw new Error("找不到指定成員");
}

function handleAddMember(p) {
    if (!p.name) {
        throw new Error("缺少 name 參數");
    }

    const sheet = getSheet('Members');
    const data = sheet.getDataRange().getValues();

    // 找出下一個可用的 MemberID (例如 M01, M02)
    let nextIdNum = 1;
    if (data.length > 1) {
        const lastId = data[data.length - 1][0]; // 假設 MemberID 在第一欄
        if (lastId && lastId.toString().startsWith('M')) {
            const num = parseInt(lastId.substring(1), 10);
            if (!isNaN(num)) nextIdNum = num + 1;
        } else {
            nextIdNum = data.length;
        }
    }
    const newId = 'M' + nextIdNum.toString().padStart(2, '0');

    // 欄位預設順序：MemberID, Name, TotalTime
    sheet.appendRow([newId, p.name, 0]);
    return response({ success: true, newMember: { MemberID: newId, Name: p.name, TotalTime: 0 } });
}

function handleDeleteMember(p) {
    if (!p.memberId) throw new Error("缺少 memberId 參數");

    const sheet = getSheet('Members');
    const data = sheet.getDataRange().getValues();
    const memberIdIndex = data[0].indexOf('MemberID');

    if (memberIdIndex === -1) throw new Error("在 Members 工作表中找不到 'MemberID' 欄位");

    for (let i = data.length - 1; i >= 1; i--) {
        if (data[i][memberIdIndex] == p.memberId) {
            sheet.deleteRow(i + 1);
            return response({ success: true, message: `成員 ${p.memberId} 已刪除` });
        }
    }

    return response({ success: false, message: `找不到 ID 為 ${p.memberId} 的成員` });
}

function handleTaskDelete(p) {
    if (!p.taskId) throw new Error("缺少 taskId 參數");

    const sheet = getSheet('Tasks');
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const taskIdIndex = headers.indexOf('TaskID');

    if (taskIdIndex === -1) throw new Error("在 Tasks 工作表中找不到 'TaskID' 欄位");

    // 從最後一筆開始往前找，避免刪除時 row index 錯亂
    for (let i = data.length - 1; i >= 1; i--) {
        if (data[i][taskIdIndex] == p.taskId) {
            sheet.deleteRow(i + 1);
            return response({ success: true, message: `任務 ${p.taskId} 已刪除` });
        }
    }

    return response({ success: false, message: `找不到 ID 為 ${p.taskId} 的任務` });
}

function handleTaskAdd(p) {
    if (!p.name || !p.reward) {
        throw new Error("缺少 name 或 reward 參數");
    }

    const sheet = getSheet('Tasks');
    const newId = 't' + new Date().getTime(); // 產生唯一 ID
    const name = p.name;
    const reward = Number(p.reward);

    if (isNaN(reward)) throw new Error("reward 必須是數字");

    sheet.appendRow([newId, name, reward]);
    return response({ success: true, newTask: { TaskID: newId, TaskName: name, Reward: reward } });
}

function calculateWeeklyStats() {
    const logs = getSheetData(getSheet('ActivityLogs'));
    const members = getSheetData(getSheet('Members'));
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const stats = members.map(m => {
        const memberLogs = logs.filter(l => l.MemberID === m.MemberID && new Date(l.Timestamp) >= weekAgo && l.Type === 'EARN');
        return {
            name: m.Name,
            count: memberLogs.length,
            totalEarned: memberLogs.reduce((sum, l) => sum + Number(l.Change), 0)
        };
    });
    return stats;
}

// --- 底層工具 ---
function getSheetData(sheet) {
    const rows = sheet.getDataRange().getValues();
    const headers = rows.shift();
    return rows.map(row => {
        let obj = {};
        headers.forEach((h, i) => obj[h] = row[i]);
        return obj;
    });
}

function response(obj) {
    return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}