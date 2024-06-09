const express = require("express");
const session = require('express-session');
const passport = require('passport');
require('./../../config/passport-setup'); // 경로를 맞게 설정해주세요
const authRouter = require('./authRouter');

const app = express();

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});