// passwordController.js

const passwordService = require('../services/passwordService');

async function verifyPassword(req, res) {
    const { user_id, password } = req.body;
    try {
        const result = await passwordService.verifyPassword(user_id, password);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error verifying password:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
}

module.exports = { verifyPassword };
