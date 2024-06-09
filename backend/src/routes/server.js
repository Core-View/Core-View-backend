const express = require("express");
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
require('./../../config/passport-setup'); // 경로를 맞게 설정해주세요
const authRouter = require('./authRouter');
const mypageRouter = require('./mypageRouter');

const app = express();

// CORS 설정 추가
app.use(cors({
  origin: 'http://localhost:3000', // 프론트엔드 도메인
  credentials: true
}));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/', mypageRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});