const express = require("express");
const router = express.Router();
const signUpController = require("../controllers/signUpController");

// 회원가입 또는 로그인
router.post("/signupOrLogin", signUpController.signUpOrLogin);

// 회원가입 이메일 전송
router.post("/auth", signUpController.auth);
router.post("/authcheck", signUpController.emailCheck);

// 회원가입
router.post("/signup", signUpController.signUp);

module.exports = router;