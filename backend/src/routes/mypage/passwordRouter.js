const express = require('express');
const router = express.Router();
const passwordController = require('../../mypage/controller/passwordController');
const token = require('../../../auth/jwtMiddle')
// 비밀번호 확인 라우트
router.post('/verify/:user_id',token.authGetJWT, passwordController.verifyPassword);

module.exports = router;
