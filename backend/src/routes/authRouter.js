const express = require('express');
const passport = require('passport');
const router = express.Router();

// 구글 로그인 라우트
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 구글 콜백 라우트
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

// 로그아웃 라우트
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;