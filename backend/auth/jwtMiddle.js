//jwtMiddle.js
const { verify } = require('./jwt-util');

//헤더에 토큰을 담았을 때
const authGetJWT = (req, res, next) => {
	if (req.get('Authorization')) {

		const token = req.get('Authorization').split('Bearer ') [1]; // header에서 access token을 가져옵니다.
		const result = verify(token); // token을 검증합니다.

		if (result.ok) {
			// token이 검증되었으면 req에 값을 세팅하고, 다음 콜백함수로 갑니다.
			req.userId = result.id;
			next();
		} else {
			// 검증에 실패하거나 토큰이 만료되었다면 클라이언트에게 메세지를 담아서 응답합니다.
			res.status(401).send({
				success: false,
				message: result.message, // jwt가 만료되었다면 메세지는 'jwt expired'입니다.
			});
		}
	}else {
		res.status(400).send({
			success: false,
			message:
				'Bad request. Token is missing.',
		})
	}
};

const authAdminJWT = (req, res, next) => {
	console.log(req)
	try{
		if(req.get('Authorization')) {
			const token = req.get('Authorization').split('Bearer ') [1];
			const result = verify(token);
			console.log(result)
			if (result.ok) {
				if(result.role != 1){
					res.status(403).send({
						success: false,
						message: "접근 권한이 없습니다."
					});
					return;
				}
				next()
				
			} else {
				res.status(401).send({
					success: false,
					message: result.message, // jwt가 만료되었다면 메세지는 'jwt expired'입니다.
				});
			}
		}else {
			res.status(400).send({
				success: false,
				message:
					'Bad request. Token is missing.',
			})
		}
	}catch (error) {
        res.status(500).json({ success: false, error: "Server error" });
    }
}

module.exports = { authGetJWT, authAdminJWT };