const pool = require('../../config/databaseSet');
const bcrypt = require('bcrypt');
const { hashPassword } = require('../utils/cryptoUtils'); // cryptoUtils.js 파일을 import

class UserService {
  async getUserInfoByUserId(user_id) {
    try {
      const connection = await pool.getConnection();

      // 사용자 정보 조회
      const [userRows] = await connection.query(
        "SELECT user_id, user_nickname AS nickname, user_email AS email, user_password AS password, user_image AS profile_picture, user_intro AS introduction FROM user WHERE user_id = ?", 
        [user_id]
      );

      console.log("사용자 정보 조회 완료:", userRows); // 사용자 정보 조회 완료 후 로그 출력

      connection.release();

      // Check if user exists
      if (userRows.length === 0) {
        throw new Error("사용자를 찾을 수 없음");
      }

      // 모든 정보를 하나의 객체로 반환
      return {
        user_id: userRows[0].user_id,
        email: userRows[0].email,
        nickname: userRows[0].nickname,
        profile_picture: userRows[0].profile_picture,
        introduction: userRows[0].introduction,
      };
    } catch (error) {
      console.error("사용자 정보를 가져오는 중 에러 발생:", error);
      throw error;
    }
  }

  async modifyUserInfo(user_id, user_nickname, user_password, user_intro) {
    try {
      const connection = await pool.getConnection();

      // 비밀번호 해시
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await hashPassword(user_password, salt); // hashPassword 함수 사용

      // 사용자 정보 업데이트
      const [result] = await connection.query(
        "UPDATE user SET user_nickname = ?, user_password = ?, user_intro = ? WHERE user_id = ?", 
        [user_nickname, hashedPassword, user_intro, user_id]
      );

      console.log("사용자 정보 수정 완료:", result); // 사용자 정보 수정 완료 후 로그 출력

      connection.release();

      if (result.affectedRows === 0) {
        throw new Error("사용자를 찾을 수 없음");
      }

      // 수정된 사용자 정보 반환
      return { message: "사용자 정보가 성공적으로 수정되었습니다." };
    } catch (error) {
      console.error("사용자 정보 수정 중 에러 발생:", error);
      throw error;
    }
  }
  async deleteUserById(user_id) {
    try {
      const connection = await pool.getConnection();

      const [result] = await connection.query(
        "DELETE FROM user WHERE user_id = ?", 
        [user_id]
      );

      connection.release();

      if (result.affectedRows === 0) {
        throw new Error("사용자를 찾을 수 없음");
      }

    } catch (error) {
      console.error("사용자 삭제 중 에러 발생:", error);
      throw error;
    }
  }
}

module.exports = new UserService();
