const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const session = require('express-session');
const signUpRouter = require("./signup/signUpRouter");
const loginRouter = require("./signin/loginRouter");
const logoutRouter = require("./signin/logoutRouter");
const profileRouter = require('./profileRouter');
const virtualCompilerRouter = require('./post/virtualCompilerRouter');
const mypageRouter = require("./mypage/mypageRouter");
const postRouter = require("./post/postRouter");
const top3PostsRouter = require("./post/top3PostsRouter");
const top3FeedbackRouter = require("./feedback/top3FeedbackRouter");
const resetPasswordRouter = require("./signin/resetPasswordRouter");
const passwordRouter = require('./mypage/passwordRouter');
const feedbackRouter = require('./feedback/feedbackRouter');
const noticeRouter = require("./notice/noticeRouter");
const alarmRouter = require('./alarm/alarmRouter');
const adminRouter = require('./admin/adminRouter');
const redisClient = require('../../config/redisSet')
const refresh = require('../../auth/jwt-util')

// 환경 변수 설정
dotenv.config();
console.log(process.env.DB_USER)
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
app.use('/api', feedbackRouter);

//리프레시 토큰 재요청
app.use('/refresh', refresh.refresh)

// 에러 핸들링 미들웨어 추가
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
