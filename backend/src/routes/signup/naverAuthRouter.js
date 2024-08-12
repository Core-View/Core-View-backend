const express = require('express');
const router = express.Router();
const naverAuthController = require('../../signup/controller/naverAuthController');

// 로그인 요청
router.get('/naver', naverAuthController.login);

// 네이버로부터의 콜백 처리
router.get('/naver/callback', naverAuthController.callback);

module.exports = router;
