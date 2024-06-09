// src/controllers/postController.js
const db = require('../../config/databaseSet'); // 올바른 경로와 파일명

// 상위 3개의 좋아요를 받은 게시물을 가져오는 함수
exports.getTop3Posts = async (req, res) => {
  const sqlQuery = `
    SELECT post_id, COUNT(*) AS total_likes 
    FROM post_likes 
    GROUP BY post_id 
    ORDER BY total_likes DESC 
    LIMIT 3
  `;

  try {
    console.log('Executing query:', sqlQuery);
    const [results] = await db.pool.query(sqlQuery);
    res.json(results);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};
