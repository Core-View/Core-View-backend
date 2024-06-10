const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');

// 라우터들
const authRouter = require('./authRouter');
const profileRouter = require('./profileRouter');
const virtualCompilerRouter = require('./virtualCompilerRouter');
const signUpRouter = require("./signUpRouter");
const loginRouter = require("./loginRouter");
const mypageRouter = require("./mypageRouter");
const passwordRouter = require('./passwordRouter');

// Passport 설정 파일
require('../../config/passport-setup');

// 환경 변수 설정
require('dotenv').config({ path: './src/routes/.env' });

// Express 애플리케이션 생성
const app = express();

// CORS 설정
app.use(cors());

// JSON 파싱을 위한 미들웨어
app.use(express.json());

// 세션 설정
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Passport 초기화 및 세션 사용
app.use(passport.initialize());
app.use(passport.session());

// 라우터 등록
app.use("/sign", signUpRouter); // 회원 가입 관련 라우터
app.use("/login", loginRouter); // 로그인 관련 라우터
app.use('/api', virtualCompilerRouter); // 가상 컴파일러 관련 라우터
app.use("/mypage", mypageRouter); // 마이페이지 관련 라우터
app.use('/auth', authRouter); // 인증 관련 라우터
app.use('/', profileRouter); // 프로필 관련 라우터
app.use('/password', passwordRouter); // 비밀번호 관련 라우터

// 기타 필요한 라우터 등록

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
