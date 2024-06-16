const path = require('path');
const alarmService = require("../services/alarmService");

class SSEController {
    constructor() {
        this.clients = [];
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

        const clientId = Date.now();
        const newClient = {
            id: clientId,
            user_id: user_id,
            res
        };

        this.clients.push(newClient);

        req.on('close', () => {
            this.clients = this.clients.filter(client => client.id !== clientId);
        });

        // 주기적인 메시지 전송
        const intervalId = setInterval(async () => {
            let periodicResult = await alarmService.getAlarm(user_id);
            this._sendMessage(res, periodicResult);
        }, 500); // 10초마다 알림 전송

        req.on('close', () => {
            clearInterval(intervalId);
            this.clients = this.clients.filter(client => client.id !== clientId);
        });
    }

    _sendMessage(res, result) {
        if (this.cancelStreaming) {
            res.end();
            this.cancelStreaming = false;
            return;
        }

        res.write('event: message\n');
        res.write(`data: ${JSON.stringify(result)}\n\n`);
    }

    unsubscribe(res) {
        this.cancelStreaming = true;
        res.send(`<html><body>Streaming is cancelled.</body></html>`);
    }
};

module.exports = SSEController;
