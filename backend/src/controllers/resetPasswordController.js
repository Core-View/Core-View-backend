const { pool } = require('../../config/databaseSet');
const bcrypt = require('bcryptjs');
const { sendMail } = require('./mailer');
const signUpService = require('../services/signUpService');

let resetCode; // 전역 변수로 resetCode 저장

const generateRandomCode = () => {
    // 임의의 6자리 숫자 생성
    return Math.floor(100000 + Math.random() * 900000);
};

const forgotPassword = async (req, res) => {
    const { user_email } = req.body;

    try {
        const [user] = await pool.query('SELECT * FROM user WHERE user_email = ?', [user_email]);

        if (!user || user.length === 0) {
            return res.status(404).json({ success: false, message: "사용자를 찾을 수 없습니다." });
        }

        resetCode = generateRandomCode();

        const html = `
            <p>비밀번호 재설정 코드는 다음과 같습니다:</p>
            <h3>${resetCode}</h3>
            <p>인증 코드를 입력하여 비밀번호를 재설정하세요.</p>
        `;

        await sendMail(user_email, "<Core-view> 비밀번호 재설정 코드", html);

        return res.status(200).json({ success: true, message: "이메일로 인증 코드가 전송되었습니다." });
    } catch (error) {
        console.error("비밀번호 재설정 오류:", error);
        return res.status(500).json({ success: false, message: "서버 에러가 발생했습니다." });
    }
};

const emailCheck = (req, res) => {
    const { authcode } = req.body;

    if (parseInt(authcode) !== parseInt(resetCode)) {
        return res.status(400).json({ success: false, message: "인증 코드가 올바르지 않습니다." });
    } else {
        return res.status(200).json({ success: true, message: "인증번호가 일치합니다." });
    }
};

const resetPassword = async (req, res) => {
    const { user_email, new_password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(new_password, 10);

        await pool.query('UPDATE user SET user_password = ? WHERE user_email = ?', [hashedPassword, user_email]);

        resetCode = null; // 인증 코드 초기화

        return res.status(200).json({ success: true, message: "비밀번호가 성공적으로 재설정되었습니다." });
    } catch (error) {
        console.error("비밀번호 재설정 오류:", error);
        return res.status(500).json({ success: false, message: "서버 에러가 발생했습니다." });
    }
};

module.exports = {
    forgotPassword,
    emailCheck,
    resetPassword
};
