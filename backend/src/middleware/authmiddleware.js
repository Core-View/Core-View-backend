const session = require('express-session');

// 세션 미들웨어 설정
const sessionMiddleware = session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
});

// 미들웨어 함수
const authenticateSession = (req, res, next) => {
  if (req.session.passport && req.session.passport.user) {
    next();
  } else {
    res.status(401).send('인증이 필요합니다.');
  }
};

module.exports = {
  sessionMiddleware,
  authenticateSession
};