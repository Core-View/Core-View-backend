const naverAuthService = require('../../signup/service/naverAuthService');

const naverAuthController = {
  login: (req, res) => {
    const state = Math.random().toString(36).substring(7);
    const api_url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NAVER_CLIENT_ID}&redirect_uri=${process.env.NAVER_REDIRECT_URI}&state=${state}`;
    res.redirect(api_url);
  },
  
  callback: async (req, res) => {
    const code = req.query.code;
    const state = req.query.state;
    
    try {
      const accessToken = await naverAuthService.getAccessToken(code, state);
      const userInfo = await naverAuthService.getUserInfo(accessToken);
      res.json(userInfo);  // 여기에서 필요한 경우 사용자 정보를 세션에 저장하거나 데이터베이스에 저장할 수 있습니다.
    } catch (error) {
      res.status(500).send('Authentication failed');
    }
  }
};

module.exports = naverAuthController;
