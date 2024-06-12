const pool = require('../../config/databaseSet');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { hashPassword } = require('../utils/cryptoUtils');

const unlinkAsync = promisify(fs.unlink);

class UserService {
  async getUserInfoByUserId(user_id) {
    try {
      const connection = await pool.getConnection();

      const [userRows] = await connection.query(
        "SELECT user_id, user_nickname AS nickname, user_email AS email, user_password AS password, user_image AS profile_picture, user_intro AS introduction FROM user WHERE user_id = ?", 
        [user_id]
      );

      console.log("사용자 정보 조회 완료:", userRows);

      connection.release();

      if (userRows.length === 0) {
        throw new Error("사용자를 찾을 수 없음");
      }

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

  async modifyUserInfo(user_id, user_nickname, user_password, user_intro, user_image_data) {
    try {
      const connection = await pool.getConnection();

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await hashPassword(user_password, salt);

      let imageFileName = null;
      if (user_image_data) {
        const fileName = `${user_id}_${Date.now()}.png`;
        const filePath = path.join(__dirname, '../../uploads/', fileName);

        // 이미지를 파일로 저장
        await fs.promises.writeFile(filePath, user_image_data.buffer, 'base64');
        imageFileName = fileName;
      }

      const [result] = await connection.query(
        "UPDATE user SET user_nickname = ?, user_password = ?, user_intro = ?, user_image = ? WHERE user_id = ?", 
        [user_nickname, hashedPassword, user_intro, imageFileName, user_id]
      );

      console.log("사용자 정보 수정 완료:", result);

      connection.release();

      if (result.affectedRows === 0) {
        throw new Error("사용자를 찾을 수 없음");
      }

      return { message: "사용자 정보가 성공적으로 수정되었습니다." };
    } catch (error) {
      console.error("사용자 정보 수정 중 에러 발생:", error);
      throw error;
    }
  }

  async modifyUserImage(user_id, imageFileName) {
    try {
      const connection = await pool.getConnection();
  
      // 이전 이미지 경로 가져오기
      const [previousImageRows] = await connection.query(
        "SELECT user_image FROM user WHERE user_id = ?", 
        [user_id]
      );

      const previous_image_path = previousImageRows[0].user_image;

      // 기존 이미지가 존재하면 삭제
      if (previous_image_path) {
        // 이미지 파일 경로 생성
        const previousImagePath = path.join(__dirname, '../../uploads/', previous_image_path);

        // 파일 삭제
        await fs.promises.unlink(previousImagePath);
      }
  
      const [result] = await connection.query(
        "UPDATE user SET user_image = ? WHERE user_id = ?", 
        [imageFileName, user_id]
      );
  
      console.log("사용자 이미지 수정 완료:", result);
  
      connection.release();
  
      if (result.affectedRows === 0) {
        throw new Error("사용자를 찾을 수 없음");
      }
  
      return { message: "사용자 이미지가 성공적으로 수정되었습니다.", previous_image_path };
    } catch (error) {
      console.error("사용자 이미지 수정 중 에러 발생:", error);
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

  async getUserPosts(user_id) {
    try {
      const connection = await pool.getConnection();

      const [posts] = await connection.query(
        "SELECT post_id, post_title FROM post WHERE user_id = ?", 
        [user_id]
      );

      console.log("사용자 게시물 조회 완료:", posts);

      connection.release();

      if (posts.length === 0) {
        throw new Error("게시물을 찾을 수 없음");
      }

      return posts.map(post => ({ post_id: post.post_id, post_title: post.post_title }));
    } catch (error) {
      console.error("사용자 게시물을 가져오는 중 에러 발생:", error);
      throw error;
    }
  }

  async getUserFeedback(user_id) {
    try {
      const connection = await pool.getConnection();

      const [feedbacks] = await connection.query(
        "SELECT feedback_id, feedback_comment FROM feedback WHERE user_id = ?", 
        [user_id]
      );

      console.log("사용자 피드백 조회 완료:", feedbacks);

      connection.release();

      if (feedbacks.length === 0) {
        throw new Error("피드백을 찾을 수 없음");
      }

      return feedbacks.map(feedback => ({ feedback_id: feedback.feedback_id, feedback_comment: feedback.feedback_comment }));
    } catch (error) {
      console.error("사용자 피드백을 가져오는 중 에러 발생:", error);
      throw error;
    }
  }
}

module.exports = new UserService();
