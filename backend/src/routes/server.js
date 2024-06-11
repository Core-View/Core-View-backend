const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const passport = require('passport');
const { sessionMiddleware, authenticateSession } = require('../middleware/authmiddleware'); // 경로 수정
const authRouter = require('../routes/authRouter');
const profileRouter = require('../routes/profileRouter');
const virtualCompilerRouter = require('../routes/virtualCompilerRouter');
const signUpRouter = require("../routes/signUpRouter");
const loginRouter = require("../routes/loginRouter");
const mypageRouter = require("../routes/mypageRouter");
const feedbackRouter = require('../routes/feedbackRouter'); // 경로 수정

dotenv.config({ path: '../.env' });
require('../../config/passport-setup'); // 경로 수정

const app = express();

// 모든 출처 허용 (CORS 설정)
app.use(cors());

app.use(bodyParser.json());

app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.use("/sign", signUpRouter);
app.use("/login", loginRouter);
app.use('/api', virtualCompilerRouter);
app.use("/mypage", mypageRouter);
app.use('/auth', authRouter);
app.use('/', profileRouter);

// 피드백 관련 라우트 사용 (인증 우회)
app.use('/api', feedbackRouter);

// 에러 핸들링 미들웨어 추가
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});