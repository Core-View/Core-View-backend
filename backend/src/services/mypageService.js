const pool = require('../../config/databaseSet');

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

      const userId = userRows[0].user_id;

      // 게시물 정보 조회
      const [postRows] = await connection.query(
        "SELECT post_id, post_title AS title, post_content AS content FROM post WHERE user_id = ?", 
        [userId]
      );

      console.log("게시물 정보 조회 완료:", postRows); // 게시물 정보 조회 완료 후 로그 출력

      // 게시물 좋아요 정보 조회
      const [postLikesRows] = await connection.query(
        "SELECT postlike_id FROM post_likes WHERE user_id = ?", 
        [userId]
      );

      console.log("게시물 좋아요 정보 조회 완료:", postLikesRows); // 게시물 좋아요 정보 조회 완료 후 로그 출력

      // 피드백 정보 조회
      const [feedbackRows] = await connection.query(
        "SELECT feedback_id, feedback_comment AS comment FROM feedback WHERE user_id = ?", 
        [userId]
      );

      console.log("피드백 정보 조회 완료:", feedbackRows); // 피드백 정보 조회 완료 후 로그 출력

      // 피드백 좋아요 정보 조회
      const [feedbackLikesRows] = await connection.query(
        "SELECT feedbacklike_id FROM feedback_likes WHERE user_id = ?", 
        [userId]
      );

      console.log("피드백 좋아요 정보 조회 완료:", feedbackLikesRows); // 피드백 좋아요 정보 조회 완료 후 로그 출력

      // 모든 정보를 하나의 객체로 반환
      return {
        user_id: userRows[0].user_id,
        email: userRows[0].email,
        password: userRows[0].password,
        nickname: userRows[0].nickname,
        profile_picture: userRows[0].profile_picture,
        introduction: userRows[0].introduction,
        posts: postRows,
        post_likes: postLikesRows,
        feedbacks: feedbackRows,
        feedback_likes: feedbackLikesRows
      };
    } catch (error) {
      console.error("사용자 정보를 가져오는 중 에러 발생:", error);
      throw error;
    }
  }
}

module.exports = new UserService();
