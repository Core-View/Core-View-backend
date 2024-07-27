const express = require("express");
const router = express.Router();
const signUpController = require("../../signup/controller/signUpController");
const axios = require('axios');
const querystring = require('querystring');
const signUpService = require('../../signup/service/signUpService');
const redisCl = require('../../../config/redisSet')
const jwt = require('../../../auth/jwt-util')

require('dotenv').config();
// 회원가입 또는 로그인
router.post("/signupOrLogin", signUpController.signUpOrLogin);

// 회원가입 이메일 전송
router.post("/auth", signUpController.auth);
router.post("/authcheck", signUpController.emailCheck);

// 회원가입
router.post("/signup", signUpController.signUp);

// 구글 로그인 라우트 추가
router.get('/google', (req, res) => {
  let url = 'https://accounts.google.com/o/oauth2/v2/auth';
  url += `?client_id=${process.env.GOOGLE_CLIENT_ID}`
  url += `&redirect_uri=${process.env.GOOGLE_LOGIN_REDIRECT_URI}`
  url += '&response_type=code'
  url += '&scope=email profile'    
  res.redirect(url);
});

// 구글 콜백 라우트 추가
router.get('/google/callback', async (req, res) => {
  const { code } = req.query;
    try {
      // 토큰 교환
      const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', querystring.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_LOGIN_REDIRECT_URI,
        grant_type: 'authorization_code'
      }));
  
      const { access_token } = tokenResponse.data;

      // 사용자 정보 가져오기
      const userInfoResponse = await axios.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access_token}`);
      const { name, email } = userInfoResponse.data;

      let user = await signUpService.findUser(email);
  
      let accessToken;

      //회원정보 존재 여부 확인
      if(user.length === 0){

        //회원이 존재하지 않을 때 db에 저장 후 토큰 발급
        let result = await signUpService.googleSign(name,email);
        
        accessToken = "Bearer " + jwt.sign(result.insertId, user.role);
        const refreshToken = jwt.refresh();
  
        redisCl.set(result.insertId.toString(), refreshToken);

      }else{

        accessToken = "Bearer " + jwt.sign(user[0].user_id, user.role);
        const refreshToken = jwt.refresh();
    
        redisCl.set(user[0].user_id.toString(), refreshToken);

      }

      res.cookie("accessToken", accessToken, { path: '/',  secure: false });
      res.cookie("role", 2, { path: '/', secure: false });

      res.redirect('http://localhost:3001');
    }catch(error){
      console.log(error);
    }

});

module.exports = router;