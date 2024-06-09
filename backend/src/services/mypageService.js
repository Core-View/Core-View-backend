const pool = require('../../config/databaseSet');

class UserService {
  async getUserById(userId) {
    try {
      const [rows] = await pool.query('SELECT * FROM user WHERE user_id = ?', [userId]);
      if (rows.length > 0) {
        return rows[0];
      }
      throw new Error('User not found');
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new UserService();