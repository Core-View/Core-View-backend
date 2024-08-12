const naverAuthService = require('../../signup/service/naverAuthService');
const User = require('../../../config/databaseSet'); // 데이터베이스 연결 모듈
const jwt = require('jsonwebtoken');

const naverAuthController = {
  login: (req, res) => {
    const state = Math.random().toString(36).substring(7); // 랜덤 상태 값 생성
    const api_url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NAVER_CLIENT_ID}&redirect_uri=${process.env.NAVER_REDIRECT_URI}&state=${state}`;
    res.redirect(api_url);
  },

  callback: async (req, res) => {
    const code = req.query.code;
    const state = req.query.state;

    try {
      // 액세스 토큰 요청
      const accessToken = await naverAuthService.getAccessToken(code, state);
      
      // 사용자 정보 요청
      const userInfo = await naverAuthService.getUserInfo(accessToken);

      // 사용자 정보 DB에 저장 또는 업데이트
      let user = await User.findOne({ where: { user_email: userInfo.email } });
      if (!user) {
        // 새 사용자 추가
        user = await User.create({
          user_name: userInfo.name,
          user_email: userInfo.email,
          user_nickname: userInfo.nickname,
          role: 2, // 소셜 로그인 사용자
          user_image: userInfo.profile_image,
          // 기타 필요한 필드 설정
        });
      } else {
        // 기존 사용자 업데이트 (필요에 따라)
        user.user_name = userInfo.name;
        user.user_nickname = userInfo.nickname;
        user.user_image = userInfo.profile_image;
        await user.save();
      }

      // JWT 토큰 발급
      const token = jwt.sign(
        { userId: user.user_id, role: user.role },
        process.env.SECRET,
        { expiresIn: '1h' }
      );

      // 클라이언트에 응답
      res.json({
        token,
        userInfo: {
          user_id: user.user_id,
          user_name: user.user_name,
          user_nickname: user.user_nickname,
          user_email: user.user_email,
          user_image: user.user_image
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Authentication failed');
    }
  }
};

module.exports = naverAuthController;
