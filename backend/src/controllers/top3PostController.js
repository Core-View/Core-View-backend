// src/controllers/postController.js
const db = require('../../config/databaseSet');

// 최근 2주간의 게시물 중에서 좋아요가 많은 상위 3개를 가져오는 함수
exports.getTop3Posts = async (req, res) => {
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const twoWeeksAgoFormatted = twoWeeksAgo.toISOString().split('T')[0];

  const sqlQuery = `
    SELECT p.*, COUNT(pl.post_id) AS total_likes 
    FROM post p
    LEFT JOIN post_likes pl ON p.post_id = pl.post_id
    WHERE p.post_date >= '${twoWeeksAgoFormatted}'
    GROUP BY p.post_id 
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
