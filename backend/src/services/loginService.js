const { hashPassword } = require("../utils/cryptoUtils");
const pool = require("../../config/databaseSet");

// 로그인 인증 함수
const authenticate = async (user_email, user_password) => {
  try {
    const [rows] = await pool.query("SELECT * FROM user WHERE user_email = ?", [
      user_email,
    ]);

    if (rows.length === 0) {
      console.log("사용자를 찾을 수 없음");
      return false; // 사용자를 찾을 수 없음
    }

    const user = rows[0];
    console.log("데이터베이스에서 찾은 사용자:", user);

    // 저장된 salt와 암호화된 비밀번호를 이용하여 비밀번호 일치 여부 확인
    const hashedPassword = hashPassword(user_password, user.user_salt);
    const isMatch = rows[0].user_password === hashedPassword;

    console.log("비밀번호 비교 결과:", isMatch);

    return isMatch;
  } catch (err) {
    console.error("인증 중 오류 발생:", err);
    throw err;
  }
};

module.exports = { authenticate };
