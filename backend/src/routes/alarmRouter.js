const router = require('express').Router();
const SSEController = require('../controllers/sseController');
const fs = require('fs');
const controller = new SSEController();
const alarmService = require('../services/alarmService');

router.get('/start/:user_id', (req, res) => controller.subscribe(req, res));

router.get('/stop', (req,res) => controller.unsubscribe(res));

router.post('/alarmcheck', alarmService.checkAlarm
);

module.exports = router;