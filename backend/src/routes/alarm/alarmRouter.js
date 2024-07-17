const router = require('express').Router();
const SSEController = require('../../alarm/controller/sseController');
const fs = require('fs');
const controller = new SSEController();
const alarmService = require('../../alarm/service/alarmService')
const {authGetJWT} = require('../../../auth/jwtMiddle')

router.get('/start/:user_id', authGetJWT,(req, res) => controller.subscribe(req, res));

router.get('/stop', (req,res) => controller.unsubscribe(res));

router.post('/alarmcheck', authGetJWT, alarmService.checkAlarm);

module.exports = router;