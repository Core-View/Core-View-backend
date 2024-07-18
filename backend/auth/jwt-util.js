// jwt-util.js
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const redisClient = require('../config/redisSet');
const secret = process.env.SECRET;

module.exports = {
    
	// access token 발급
	sign: (user_id) => {
		const payload = {
			// access token에 들어갈 payload
			id: user_id,
		};

		return jwt.sign(payload, secret, {
			// secret으로 sign하여 발급하고 return
			algorithm: 'HS256', // 암호화 알고리즘
			expiresIn: '5m',
		});
	},

	// access token 검증
	verify: (token) => {
		let decoded = null;
		try {
			decoded = jwt.verify(token, secret);
			console.log(decoded.id);
			return {
				ok: true,
				id: decoded.id,
			};
		} catch (err) {
			console.log(err);
			return {
				ok: false,
				message: err.message,
			};
		}
	},

	// refresh token 발급
	refresh: () => {
		return jwt.sign({},secret, {
			// refresh token은 payload 없이 발급
			algorithm: 'HS256',
            expiresIn: '14d',
		});
	},

	// refresh token 검증
	refreshVerify: async (token, userId) => {
		/* redis 모듈은 기본적으로 promise를 반환하지 않으므로,
       promisify를 이용하여 promise를 반환.*/
		const getAsync = promisify(redisClient.get).bind(redisClient);

		try {
			const data = await getAsync(userId); // refresh token 가져오기
			if (token === data) {
				try {
					jwt.verify(token, secret);
					return true;
				} catch (err) {
					return false;
				}
			} else {
				return false;
			}
		} catch (err) {
			return false;
		}
	},
};