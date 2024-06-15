const fs = require('fs');
const path = require('path');
const alarmService = require("../services/alarmService");

class SSEController {
    constructor() {
        this.cancelStreaming = false;
    }

    async subscribe(req, res) {
        let user_id = req.params.user_id;

        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
        };

        res.writeHead(200, headers);

        // 파일 변경 감지
        fs.watch("../../config/alarm.txt", async (eventType, filename) => {
            if (filename) {
                console.log(`${filename} 파일에 ${eventType} 이벤트가 발생했습니다.`);
                let result = await alarmService.getAlarm(user_id);
                this._sendMessage(res, result);
            } else {
                console.log('파일 변경 감지: 파일 이름을 얻을 수 없습니다.');
            }
        });

        let result = await alarmService.getAlarm(user_id);
 
        // 초기 메시지 전송
        this._sendMessage(res, result);
    }

    unsubscribe(res) {
        this.cancelStreaming = true;
        res.send(`<html><body>Streaming is cancelled.</body></html>`);
    }

    _sendMessage(res, result) {
        if (this.cancelStreaming) {
            res.end();
            this.cancelStreaming = false;
            return;
        }

        console.log('[sse] sendMessage');

        res.write('event: message\n');
        res.write(`data: ${JSON.stringify(result)}\n\n`);
    }

    fileWrite(data) {
        const filePath = path.resolve(__dirname, '../../config/alarm.txt');
        fs.writeFile(filePath, `${data}`, 'utf8', function (error) {
            if (error) {
                console.error('Error writing file:', error);
            } else {
                console.log('write end');
            }
        });
    }
};

module.exports = SSEController;
