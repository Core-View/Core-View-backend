const passwordService = require('../services/passwordService');

async function verifyPassword(req, res) {
    const { user_id } = req.params;
    const { user_password } = req.body; // 요청 바디에서 user_password를 가져옴
    try {
        if (!user_password) {
            return res.status(400).json({ success: false, error: "Password is required" });
        }
        
        const result = await passwordService.verifyPassword(user_id, user_password);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error verifying password:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
}

module.exports = { verifyPassword };
