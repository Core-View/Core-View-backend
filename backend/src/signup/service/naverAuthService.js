const axios = require('axios');
const qs = require('qs');

const naverAuthService = {
  getAccessToken: async (code, state) => {
    const tokenUrl = 'https://nid.naver.com/oauth2.0/token';
    const tokenData = {
      grant_type: 'authorization_code',
      client_id: process.env.NAVER_CLIENT_ID,
      client_secret: process.env.NAVER_CLIENT_SECRET,
      code: code,
      state: state
    };
    
    const response = await axios.post(tokenUrl, qs.stringify(tokenData), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    return response.data.access_token;
  },
  
  getUserInfo: async (accessToken) => {
    const userInfoUrl = 'https://openapi.naver.com/v1/nid/me';
    
    const response = await axios.get(userInfoUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    return response.data.response;
  }
};

module.exports = naverAuthService;
