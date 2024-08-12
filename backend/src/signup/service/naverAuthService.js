const axios = require('axios'); // axios를 사용하는 것이 좋습니다

const naverAuthService = {
  getAccessToken: async (code, state) => {
    const response = await axios.post('https://nid.naver.com/oauth2.0/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.NAVER_CLIENT_ID,
        client_secret: process.env.NAVER_CLIENT_SECRET,
        redirect_uri: process.env.NAVER_REDIRECT_URI,
        code: code,
        state: state
      }
    });
    return response.data.access_token;
  },

  getUserInfo: async (accessToken) => {
    const response = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    return response.data.response; // 사용자 정보를 반환
  }
};

module.exports = naverAuthService;
