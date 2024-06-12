// server.js

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
<<<<<<< HEAD
const postRouter = require("./postRouter");
const top3PostsRouter = require("./top3PostsRouter");
const top3FeedbackRouter = require("./top3FeedbackRouter");
const resetPasswordRouter = require("./resetPasswordRouter"); // 새로운 라우터 추가

require('../../config/passport-setup');
dotenv.config({ path: './src/routes/.env' });

=======
const noticeRouter = require("./noticeRouter");
const alarmRouter = require('./alarmRouter');
require('../../config/passport-setup'); // 경로 수정
require('dotenv').config({ path: './src/routes/.env' });

dotenv.config();
>>>>>>> 40cacff10060c2508e6d2f427c837b073f56b3ed
const app = express();

app.use(cors());
app.use(express.json());

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/sign", signUpRouter);
app.use("/login", loginRouter);
app.use('/api', virtualCompilerRouter);
app.use("/mypage", mypageRouter);
app.use('/auth', authRouter);
app.use('/', profileRouter);
<<<<<<< HEAD
app.use("/post", postRouter); 
app.use("/", top3PostsRouter); 
app.use("/", top3FeedbackRouter);
app.use("/", resetPasswordRouter); // 비밀번호 재설정 라우터 추가
=======
app.use('/notice', noticeRouter); //공지 관련 라우터
app.use('/sse/streaming',alarmRouter ); //알림
>>>>>>> 40cacff10060c2508e6d2f427c837b073f56b3ed

console.log('MAIL_REFRESH:', process.env.MAIL_REFRESH);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
