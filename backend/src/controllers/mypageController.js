const userService = require('../services/mypageService');
const { hashPassword } = require("../utils/cryptoUtils");
const fs = require('fs');
const path = require('path');

class UserController {
  async getUser(req, res) {
    const user_id = req.params.user_id;
    try {
      const userInfo = await userService.getUserInfoByUserId(user_id);
      res.json(userInfo);
    } catch (error) {
      console.error("사용자 정보를 가져오는 중 에러 발생:", error);
      if (error.message === "사용자를 찾을 수 없음") {
        return res.status(404).json({ message: "사용자를 찾을 수 없음" });
      }
      res.status(500).json({ message: "사용자 정보를 가져오는 중 에러 발생" });
    }
  }

  async modifyUser(req, res) {
    const user_id = req.params.user_id;
    const { user_nickname, user_password, user_password_confirm, user_intro } = req.body;

    if (user_password !== user_password_confirm) {
      return res.status(400).json({ message: "비밀번호와 비밀번호 확인이 일치하지 않습니다." });
    }

    try {
      // Modify user info without image
      const updatedUserInfo = await userService.modifyUserInfo(user_id, user_nickname, user_password, user_intro, null);
      res.json(updatedUserInfo);
    } catch (error) {
      console.error("사용자 정보 수정 중 에러 발생:", error);
      if (error.message === "사용자를 찾을 수 없음") {
        return res.status(404).json({ message: "사용자를 찾을 수 없음" });
      }
      res.status(500).json({ message: "사용자 정보 수정 중 에러 발생" });
    }
  }

  async modifyUserImage(req, res) {
    const user_id = req.params.user_id;
    
    try {
      let imageFileName = null;
      if (req.file && req.file.buffer) {
        const user_image_data = req.file.buffer.toString('base64');
        const fileName = `${user_id}_${Date.now()}.png`;
        const filePath = path.join(__dirname, '../../uploads/', fileName);
  
        // 이미지를 파일로 저장
        await fs.promises.writeFile(filePath, user_image_data, 'base64');
  
        imageFileName = fileName;
      }
  
      const updatedUserImage = await userService.modifyUserImage(user_id, imageFileName);
      
      // 이미지 업로드 후, 기존 이미지 삭제 (옵션)
      if (updatedUserImage.previous_image_path) {
        const previousImagePath = path.join(__dirname, '../../uploads/', updatedUserImage.previous_image_path);
        await fs.promises.unlink(previousImagePath);
      }
  
      res.json(updatedUserImage);
    } catch (error) {
      console.error("사용자 이미지 수정 중 에러 발생:", error);
      if (error.message === "사용자를 찾을 수 없음") {
        return res.status(404).json({ message: "사용자를 찾을 수 없음" });
      }
      res.status(500).json({ message: "사용자 이미지 수정 중 에러 발생" });
    }
  }

  async deleteUser(req, res) {
    const user_id = req.params.user_id;

    try {
      await userService.deleteUserById(user_id);
      res.status(204).end();
    } catch (error) {
      console.error("사용자 삭제 중 에러 발생:", error);
      if (error.message === "사용자를 찾을 수 없음") {
        return res.status(404).json({ message: "사용자를 찾을 수 없음" });
      }
      res.status(500).json({ message: "사용자 삭제 중 에러 발생" });
    }
  }

  async getUserPosts(req, res) {
    const user_id = req.params.user_id;

    try {
      const posts = await userService.getUserPosts(user_id);
      res.json(posts);
    } catch (error) {
      console.error("사용자 게시물을 가져오는 중 에러 발생:", error);
      if (error.message === "게시물을 찾을 수 없음") {
        return res.status(404).json({ message: "게시물을 찾을 수 없음" });
      }
      res.status(500).json({ message: "사용자 게시물을 가져오는 중 에러 발생" });
    }
  }

  async getUserFeedback(req, res) {
    const user_id = req.params.user_id;

    try {
      const feedbacks = await userService.getUserFeedback(user_id);
      res.json(feedbacks);
    } catch (error) {
      console.error("사용자 피드백을 가져오는 중 에러 발생:", error);
      if (error.message === "피드백을 찾을 수 없음") {
        return res.status(404).json({ message: "피드백을 찾을 수 없음" });
      }
      res.status(500).json({ message: "사용자 피드백을 가져오는 중 에러 발생" });
    }
  }
}

module.exports = new UserController();