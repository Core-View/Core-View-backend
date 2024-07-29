const express = require('express');
const router = express.Router();
const naverAuthController = require('../../signup/controller/naverAuthController');

router.get('/naver', naverAuthController.login);
router.get('/naver/callback', naverAuthController.callback);

module.exports = router;
