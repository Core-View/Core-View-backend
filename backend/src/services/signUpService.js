const crypto = require('crypto');
const { hashPassword } = require('../utils/cryptoUtils');
const pool = require('../../config/databaseSet');

// 회원가입 함수
const signUp = async (user_name, user_nickname, user_email, user_password) => {
  try {
    const [existingUsers] = await pool.query(
      'SELECT * FROM user WHERE user_email = ?',
      [user_email]
    );

    if (existingUsers.length > 0) {
      return { success: false, error: '이미 등록된 이메일입니다.' };
    }

    // 랜덤 salt 생성
    const user_salt = crypto.randomBytes(32).toString('hex');

    // 비밀번호 해싱
    const hashedPassword = hashPassword(user_password, user_salt);

    const [result] = await pool.query(
      'INSERT INTO user (user_name, user_nickname, user_email, user_password, user_salt, role) VALUES (?, ?, ?, ?, ?, 0)',
      [user_name, user_nickname, user_email, hashedPassword, user_salt]
    );

    if (result.affectedRows > 0) {
      // 성공 시 반환
      return { success: true, id: result.insertId };
    } else {
      return { success: false, error: '회원가입에 실패했습니다.' };
    }
  } catch (error) {
    console.error('Error signing up:', error);
    return { success: false, error: '서버 에러가 발생했습니다.' };
  }
};

module.exports = { signUp };
