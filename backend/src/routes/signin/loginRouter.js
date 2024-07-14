const express = require("express");
const router = express.Router();
const loginController = require("../../signin/controller/loginController");
const token = require('../../../auth/jwt-util')

router.post("/", loginController.login);

//리프레시 토큰 설정
router.get("/refresh", token.refresh)

module.exports = router;