const crypto = require("crypto");
const { hashPassword } = require("../utils/cryptoUtils.js");
const pool = require("../../config/databaseSet.js");

// 이메일 존재 여부 확인 함수
const checkEmailExists = async (email) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE user_email = ?", [email]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error checking email:", error);
    throw error;
  }
};

// 회원가입 함수
const signUp = async (user_name, user_nickname, user_email, user_password) => {
  try {
    const [existingUsers] = await pool.query("SELECT * FROM users WHERE user_email = ?", [user_email]);

    if (existingUsers.length > 0) {
      return { success: false, error: "이미 등록된 이메일입니다." };
    }

    // 랜덤 salt 생성
    const user_salt = crypto.randomBytes(32).toString("hex");

    // 비밀번호 해싱
    const hashedPassword = hashPassword(user_password, user_salt);

    const [result] = await pool.query(
      "INSERT INTO users (user_name, user_nickname, user_email, user_password, user_salt, role) VALUES (?, ?, ?, ?, ?, 0)",
      [user_name, user_nickname, user_email, hashedPassword, user_salt]
    );

    if (result.affectedRows > 0) {
      // 성공 시 반환
      return { success: true, id: result.insertId };
    } else {
      return { success: false, error: "회원가입에 실패했습니다." };
    }
  } catch (error) {
    console.error("Error signing up:", error);
    return { success: false, error: "서버 에러가 발생했습니다." };
  }
};

const create_code = () => {
  let n = Math.floor(Math.random() * 1000000);
  return n.toString().padStart(6, "0");
};

module.exports = { signUp, create_code, checkEmailExists };