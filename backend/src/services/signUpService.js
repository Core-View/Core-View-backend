const pool = require('../../config/databaseSet');
const { comparePassword } = require('../utils/cryptoUtils');

class UserService {
  async getUserInfoById(user_id) {
    try {
      const connection = await pool.getConnection();

      // 사용자 정보 조회
      const [userRows] = await connection.query(
        "SELECT user_nickname AS nickname, user_image AS profile_picture, user_intro AS introduction FROM user WHERE user_id = ?", 
        [user_id]
      );
      connection.release();

      if (userRows.length === 0) {
        throw new Error("User not found");
      }

      // 기타 필요한 정보들도 조회하고 필요에 따라 추가적인 정보 조회

      return {
        nickname: userRows[0].nickname,
        profile_picture: userRows[0].profile_picture,
        introduction: userRows[0].introduction,
        // 필요한 경우 추가적인 정보들 반환
      };
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw error;
    }
  }

  async verifyPassword(user_id, inputPassword) {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query("SELECT user_password, user_salt FROM user WHERE user_id = ?", [user_id]);
      connection.release();

      if (rows.length === 0) {
        throw new Error("User not found");
      }

      const { user_password, user_salt } = rows[0];
      const isPasswordValid = comparePassword(inputPassword, user_password, user_salt);
      console.log('verifyPassword isPasswordValid:', isPasswordValid); // 디버그 출력
      return isPasswordValid;
    } catch (error) {
      console.error("Error verifying password:", error);
      throw error;
    }
  }
}

module.exports = new UserService();