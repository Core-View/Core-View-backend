const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const authRouter = require('./authRouter'); 

const profileRouter = require('./profileRouter');
const virtualCompilerRouter = require('./virtualCompilerRouter');
const signUpRouter = require("./signUpRouter");
const loginRouter = require("./loginRouter");
const mypageRouter = require("./mypageRouter");

const postRouter = require("./postRouter");
const top3PostsRouter = require("./top3PostsRouter");
const top3FeedbackRouter = require("./top3FeedbackRouter");
const resetPasswordRouter = require("./resetPasswordRouter"); // 새로운 라우터 추가
const passwordRouter = require('./passwordRouter');

const feedbackRouter = require('./feedbackRouter')

// Passport 설정 파일
require('../../config/passport-setup');

dotenv.config({ path: './src/routes/.env' });


const noticeRouter = require("./noticeRouter");
const alarmRouter = require('./alarmRouter');
require('../../config/passport-setup'); // 경로 수정

require('dotenv').config({ path: './src/routes/.env' });

dotenv.config();
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

app.use("/sign", signUpRouter);
app.use("/login", loginRouter);
app.use('/api', virtualCompilerRouter);
app.use("/mypage", mypageRouter);
app.use('/auth', authRouter);
app.use('/', profileRouter);

app.use("/post", postRouter); 
app.use("/", top3PostsRouter); 
app.use("/", top3FeedbackRouter);
app.use("/", resetPasswordRouter); // 비밀번호 재설정 라우터 추가

app.use('/notice', noticeRouter); //공지 관련 라우터
app.use('/sse/streaming',alarmRouter ); //알림
app.use('/password', passwordRouter); 

console.log('MAIL_REFRESH:', process.env.MAIL_REFRESH);

// 피드백 관련 라우트 사용 (인증 우회)
app.use('/api', feedbackRouter);

// 에러 핸들링 미들웨어 추가
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');});



// 기타 필요한 라우터 등록
//const { sessionMiddleware, authenticateSession } = require('../middleware/authmiddleware'); // 경로 수정