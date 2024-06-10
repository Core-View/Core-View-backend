const fs = require('fs');
const path = require('path');

class SSEController {
    constructor() {
        this.cancelStreaming = false;
    }

    subscribe(req, res) {
        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
        };

        res.writeHead(200, headers);

        this._sendMessage(res);
    };

    unsubscribe(res) {
        this.cancelStreaming = true;

        res.send(`<html><body>Streaming is cancelled.</body></html>`);
    }

    _sendMessage(res) {
        if (this.cancelStreaming) {
            res.end();
            this.cancelStreaming = false;
            return;
        }

        console.log('[sse] sendMessage');

        res.write('event: message\n');
        res.write('data: 안녕\n\n');

        const timer = setTimeout(() => {
            res.write('event: message\n');
            res.write('data: finished\n\n');
            res.end();
            clearTimeout(timer);
        }, 1000);
    }

    fileWrite(data) {
        const filePath = path.resolve(__dirname, '../../config/alarm.txt');
        fs.writeFile(filePath, `${data}`, 'utf8', function(error){
            if (error) {
                console.error('Error writing file:', error);
            } else {
                console.log('write end');
            }
        });
    }
};

module.exports = SSEController;
