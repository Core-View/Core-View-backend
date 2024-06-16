const router = require('express').Router();
const SSEController = require('../controllers/sseController');
const fs = require('fs');
const controller = new SSEController();

router.get('/start', (req, res) => controller.subscribe(req, res));

router.get('/stop', (req,res) => controller.unsubscribe(res));

module.exports = router;