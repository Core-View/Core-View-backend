// src/controllers/feedbackController.js
const db = require('../../config/databaseSet');

// 최근 2주간의 댓글 중에서 좋아요가 많은 상위 3개를 가져오는 함수
exports.getTop3Feedback = async (req, res) => {
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const twoWeeksAgoFormatted = twoWeeksAgo.toISOString().split('T')[0];

  const sqlQuery = `
    SELECT f.*, COUNT(fl.feedback_id) AS total_likes 
    FROM feedback f
    LEFT JOIN feedback_likes fl ON f.feedback_id = fl.feedback_id
    WHERE f.feedback_date >= '${twoWeeksAgoFormatted}'
    GROUP BY f.feedback_id 
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
