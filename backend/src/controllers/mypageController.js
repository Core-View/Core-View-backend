const userService = require('../services/mypageService');

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
}

module.exports = new UserController();
