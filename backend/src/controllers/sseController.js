const fs = require('fs');
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
        }, 10000); // 10초마다 알림 전송

        req.on('close', () => {
            clearInterval(intervalId);
            this.clients = this.clients.filter(client => client.id !== clientId);
        });
    }

    async feedback() {

        // 알림 전송
        this.sendNotification({ message: '새 피드백이 달렸습니다!' });

        res.status(200).send('Feedback received');
    }

    sendNotification(data) {
        this.clients.forEach(client => this._sendMessage(client.res, data));
    }

    unsubscribe(res) {
        this.cancelStreaming = true;
        res.send(`<html><body>Streaming is cancelled.</body></html>`);
    }
};

module.exports = SSEController;
