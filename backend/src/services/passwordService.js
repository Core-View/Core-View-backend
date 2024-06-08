// passwordService.js

const userService = require('../services/userService');

async function verifyPassword(userId, password) {
    try {
        const user = await userService.getUserById(userId); // 사용자 정보 가져오기
        if (!user) {
            return { success: false, error: "User not found" };
        }

        // 비밀번호 검증 로직 (여기서는 단순히 비교만)
        if (password === user.user_password) {
            return { success: true, message: "Password verified" };
        } else {
            return { success: false, error: "Incorrect password" };
        }
    } catch (error) {
        console.error("Error verifying password:", error);
        throw error;
    }
}

module.exports = { verifyPassword };
