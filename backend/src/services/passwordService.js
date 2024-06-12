const pool = require('../../config/databaseSet');
const { hashPassword } = require('../utils/cryptoUtils');

class PasswordService {
    async verifyPassword(userId, password) {
        try {
            const connection = await pool.getConnection();

            // 사용자 정보 조회
            const [userRows] = await connection.query(
                "SELECT user_id, user_password, user_salt FROM user WHERE user_id = ?", 
                [userId]
            );

            connection.release();

            if (userRows.length === 0) {
                return { success: false, error: "User not found" };
            }

            const user = userRows[0];

            // 저장된 salt와 암호화된 비밀번호를 이용하여 비밀번호 일치 여부 확인
            const hashedPassword = hashPassword(password, user.user_salt);
            const isMatch = user.user_password === hashedPassword;

            if (isMatch) {
                return { success: true, message: "Password verified" };
            } else {
                return { success: false, error: "Incorrect password" };
            }
        } catch (error) {
            console.error("Error verifying password:", error);
            throw error;
        }
    }
}

module.exports = new PasswordService();
