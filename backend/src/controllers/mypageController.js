const userService = require('../services/mypageService');
const bcrypt = require('bcrypt'); // bcrypt 모듈 import
const { hashPassword } = require("../utils/cryptoUtils");

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

    // 비밀번호 확인
    if (user_password !== user_password_confirm) {
      return res.status(400).json({ message: "비밀번호와 비밀번호 확인이 일치하지 않습니다." });
    }

    try {
      // 비밀번호 해시
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await hashPassword(user_password, salt);

      const updatedUserInfo = await userService.modifyUserInfo(user_id, user_nickname, hashedPassword, user_intro);
      res.json(updatedUserInfo);
    } catch (error) {
      console.error("사용자 정보 수정 중 에러 발생:", error);
      if (error.message === "사용자를 찾을 수 없음") {
        return res.status(404).json({ message: "사용자를 찾을 수 없음" });
      }
      res.status(500).json({ message: "사용자 정보 수정 중 에러 발생" });
    }
  }
  async deleteUser(req, res) {
    const user_id = req.params.user_id;

    try {
      await userService.deleteUserById(user_id);
      res.status(204).end(); // 성공적으로 삭제되었을 경우 204 No Content 응답
    } catch (error) {
      console.error("사용자 삭제 중 에러 발생:", error);
      if (error.message === "사용자를 찾을 수 없음") {
        return res.status(404).json({ message: "사용자를 찾을 수 없음" });
      }
      res.status(500).json({ message: "사용자 삭제 중 에러 발생" });
    }
  }
}

module.exports = new UserController();
