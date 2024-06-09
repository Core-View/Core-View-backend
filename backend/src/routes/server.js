// src/routes/server.js
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
const top3PostsRouter = require("./top3PostsRouter"); // 추가
const top3FeedbackRouter = require("./top3FeedbackRouter"); // 추가

require('../../config/passport-setup'); // 경로 수정
dotenv.config({ path: './src/routes/.env' });

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
app.use("/post", postRouter); 
app.use("/top3posts", top3PostsRouter); 
app.use("/", top3FeedbackRouter); 

console.log('MAIL_REFRESH:', process.env.MAIL_REFRESH);
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
