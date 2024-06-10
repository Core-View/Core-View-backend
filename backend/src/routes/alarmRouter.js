const router = require('express').Router();
const SSEController = require('../controllers/sseController');
const fs = require('fs');
const controller = new SSEController();

router.get('/start', (req, res) => controller.subscribe(req, res));

router.get('/stop', (req,res) => controller.unsubscribe(res));

//임시로 피드백이 달렸다 가정
router.post('/post', (req, res) => controller.fileWrite(Math.random()));


//파일 변경 감지
fs.watch("../../config/alarm.txt", (eventType, filename) => {
    if (filename) {
      console.log(`${filename} 파일에 ${eventType} 이벤트가 발생했습니다.`);
      _sendMessage(res);
    } else {
      console.log('파일 변경 감지: 파일 이름을 얻을 수 없습니다.');
    }
});
module.exports = router;