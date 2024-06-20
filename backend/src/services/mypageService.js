const crypto = require('crypto');
const { hashPassword } = require('../utils/cryptoUtils');
const pool = require('../../config/databaseSet');
const fs = require('fs').promises;
const path = require('path');

class UserService {
  async getUserInfoByUserId(user_id) {
    try {
      const connection = await pool.getConnection();
  
      // 사용자가 받은 좋아요 수를 계산하는 쿼리
      const [likesReceivedRows] = await connection.query(
        "SELECT COUNT(*) AS likes_received " +
        "FROM post " +
        "JOIN post_likes ON post.post_id = post_likes.post_id " +
        "WHERE post.user_id = ?",
        [user_id]
      );
  
      // 사용자 정보와 게시물 정보를 가져오는 쿼리
      const [userRows] = await connection.query(
        "SELECT u.user_id, u.user_nickname AS nickname, u.user_email AS email, u.user_password AS password, u.user_image AS profile_picture, u.user_intro AS introduction, u.user_contribute AS contribute, " +
        "p.post_id, p.post_title, p.post_content, p.post_code, p.post_date, p.language " +
        "FROM user u " +
        "LEFT JOIN post p ON u.user_id = p.user_id " +
        "WHERE u.user_id = ?",
        [user_id]
      );
  
      console.log("사용자 정보 조회 완료:", userRows);
  
      connection.release();
  
      if (userRows.length === 0) {
        throw new Error("사용자를 찾을 수 없음");
      }
  
      const userInfo = {
        user_id: userRows[0].user_id,
        email: userRows[0].email,
        nickname: userRows[0].nickname,
        profile_picture: `${userRows[0].profile_picture}`, // 이미지 경로 생성
        introduction: userRows[0].introduction,
        contribute: userRows[0].contribute,
        likes_received: likesReceivedRows[0].likes_received, // 사용자가 받은 좋아요 수
        posts: userRows.map(row => ({
          post_id: row.post_id,
          post_title: row.post_title,
          post_content: row.post_content,
          post_code: row.post_code,
          post_date: row.post_date,
          language: row.language
        }))
      };
  
      return userInfo;
    } catch (error) {
      console.error("사용자 정보를 가져오는 중 에러 발생:", error);
      throw error;
    }
  }
  
  
  
  
  async modifyUserInfo(user_id, user_nickname, user_password, user_intro) {
    try {
        const connection = await pool.getConnection();

        // 사용자 비밀번호를 bcrypt를 사용하여 해싱
        const user_salt = crypto.randomBytes(32).toString('hex');

        // 비밀번호 해싱
        const hashedPassword = hashPassword(user_password, user_salt);

        // 비밀번호와 솔트 업데이트를 포함한 사용자 정보 업데이트 쿼리
        const [result] = await connection.query(
            "UPDATE user SET user_nickname = ?, user_password = ?, user_intro = ?, user_salt = ? WHERE user_id = ?", 
            [user_nickname, hashedPassword, user_intro, user_salt, user_id]
        );

        console.log("사용자 정보 수정 완료:", result);

        connection.release();

        if (result.affectedRows === 0) {
            throw new Error("사용자를 찾을 수 없음");
        }

        return { message: "사용자 정보가 성공적으로 수정되었습니다.", access: true };
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

        const previous_image_path = previousImageRows[0]?.user_image;

        // 기존 이미지가 존재하면 삭제
        if (previous_image_path) {
            // 이미지 파일 경로 생성
            const previousImagePath = path.join(__dirname, '../../../../front/front/public/images/', previous_image_path);

            // 파일 삭제
            try {
                await fs.unlink(previousImagePath);
                console.log(`이전 이미지 파일 삭제 완료: ${previousImagePath}`);
            } catch (error) {
                console.error(`이전 이미지 파일 삭제 중 에러 발생: ${previousImagePath}`, error);
            }
        }

        // 새로운 이미지 파일 경로 설정
        const newImagePath = imageFileName ? `${imageFileName}` : null;

        // MySQL에 경로를 포함하여 이미지 파일명을 저장하는 쿼리
        const [result] = await connection.query(
            "UPDATE user SET user_image = ? WHERE user_id = ?", 
            [newImagePath, user_id]
        );

        console.log("사용자 이미지 수정 완료:", result);

        connection.release();

        if (result.affectedRows === 0) {
            throw new Error("사용자를 찾을 수 없음");
        }

        // 수정된 이미지 경로와 이전 이미지 경로 반환
        return { message: "사용자 이미지가 성공적으로 수정되었습니다.", access: true, previous_image_path };
    } catch (error) {
        console.error("사용자 이미지 수정 중 에러 발생:", error);
        throw error;
    }
  }

  
  async deleteUserById(user_id) {
    try {
      const connection = await pool.getConnection();

      // 사용자 삭제
      const [deleteUserResult] = await connection.query(
        "DELETE FROM user WHERE user_id = ?", 
        [user_id]
      );
  
      connection.release();
  
      if (deleteUserResult.affectedRows === 0) {
        throw new Error("사용자를 찾을 수 없음");
      }

      return { message: "사용자 및 사용자의 모든 게시물이 성공적으로 삭제되었습니다.", access: true };
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
  
      // feedback 테이블과 post 테이블을 조인하여 post_id와 post_title을 가져오는 쿼리
      const [feedbacks] = await connection.query(
        `SELECT post.post_id, post.post_title 
         FROM feedback 
         JOIN post ON feedback.post_id = post.post_id 
         WHERE feedback.user_id = ?`, 
        [user_id]
      );
  
      console.log("사용자 피드백 조회 완료:", feedbacks);
  
      connection.release();
  
      if (feedbacks.length === 0) {
        throw new Error("피드백을 찾을 수 없음");
      }
  
      // 피드백 정보를 반환 형식에 맞게 변환
      return feedbacks.map(feedback => ({ post_id: feedback.post_id, post_title: feedback.post_title }));
    } catch (error) {
      console.error("사용자 피드백을 가져오는 중 에러 발생:", error);
      throw error;
    }
  }
}

module.exports = new UserService();