const express = require("express");
const router = express.Router();
const signUpController = require("../controllers/signUpController");
const passport = require('passport'); // 추가된 부분

// 회원가입 또는 로그인
router.post("/signupOrLogin", signUpController.signUpOrLogin);

// 회원가입 이메일 전송
router.post("/auth", signUpController.auth);
router.post("/authcheck", signUpController.emailCheck);

// 회원가입
router.post("/signup", signUpController.signUp);

// 구글 로그인 라우트 추가
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 구글 콜백 라우트 추가
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

module.exports = router;