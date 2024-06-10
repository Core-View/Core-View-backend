const router = require('express').Router();
const SSEController = require('../controllers/sseController');
const fs = require('fs');
const controller = new SSEController();

router.get('/start', (req, res) => controller.subscribe(req, res));

router.get('/stop', (req,res) => controller.unsubscribe(res));

//임시로 피드백이 달렸다 가정
router.post('/post', (req, res) => controller.fileWrite(Math.random()));

module.exports = router;