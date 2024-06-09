const express = require("express");
const session = require('express-session');
const passport = require('passport');
require('./../../config/passport-setup'); // 경로를 맞게 설정해주세요
const authRouter = require('./authRouter');
const mypageRouter = require('./mypageRouter'); // 추가

const app = express();

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/', mypageRouter); // 추가

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});