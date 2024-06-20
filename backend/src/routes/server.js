const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const signUpRouter = require("./signUpRouter");
const loginRouter = require("./loginRouter");
const logoutRouter = require("./logoutRouter");
const profileRouter = require('./profileRouter');
const virtualCompilerRouter = require('./virtualCompilerRouter');
const mypageRouter = require("./mypageRouter");
const postRouter = require("./postRouter");
const top3PostsRouter = require("./top3PostsRouter");
const top3FeedbackRouter = require("./top3FeedbackRouter");
const resetPasswordRouter = require("./resetPasswordRouter");
const passwordRouter = require('./passwordRouter');
const feedbackRouter = require('./feedbackRouter');
const noticeRouter = require("./noticeRouter");
const alarmRouter = require('./alarmRouter');
const adminRouter = require('./adminRouter');
// const homeRouter = require('./homeRouter'); // 홈 페이지 라우터 추가(소셜계정 테스트용, 삭제 하셔도 됩니다)

// 환경 변수 설정
dotenv.config({ path: './src/routes/.env' });

// Passport 설정 파일 로드
require('../../config/passport-setup');

const app = express();


// CORS 설정
app.use(cors());

// JSON 파싱을 위한 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 세션 설정
app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: true
}));

// Passport 초기화 및 세션 사용
app.use(passport.initialize());
app.use(passport.session());

app.use("/sign", signUpRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use('/api', virtualCompilerRouter);
app.use("/mypage", mypageRouter);
app.use('/', profileRouter);
app.use('/admin', adminRouter);
app.use("/post", postRouter); 
app.use("/", top3PostsRouter); 
app.use("/", top3FeedbackRouter);
app.use("/", resetPasswordRouter);
app.use('/notice', noticeRouter);
app.use('/sse/streaming', alarmRouter);
app.use('/password', passwordRouter);
// app.use('/', homeRouter); // 홈 페이지 라우터 사용(구글 소셜로그인 테스트용 삭제 해주셔도 됩니다)

app.use('/api', feedbackRouter);

// 에러 핸들링 미들웨어 추가
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
