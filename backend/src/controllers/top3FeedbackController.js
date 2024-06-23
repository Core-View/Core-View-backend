const pool = require('../../config/databaseSet');

// 최근 2주간의 댓글 중에서 좋아요가 많은 상위 3개를 가져오는 함수
exports.getTop3Feedback = async (req, res) => {
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const twoWeeksAgoFormatted = twoWeeksAgo.toISOString().split('T')[0];

  const sqlQuery = `
    SELECT f.*, u.user_contribute, u.user_nickname, COUNT(fl.feedback_id) AS total_likes 
    FROM feedback f
    LEFT JOIN feedback_likes fl ON f.feedback_id = fl.feedback_id
    LEFT JOIN user u ON f.user_id = u.user_id 
    WHERE f.feedback_date >= ? AND u.role = 0
    GROUP BY f.feedback_id, u.user_contribute, u.user_nickname
    ORDER BY total_likes DESC
    LIMIT 3;
  `;

  try {
    console.log('쿼리 실행 중:', sqlQuery);
    const [results] = await pool.query(sqlQuery, [twoWeeksAgoFormatted]);
    res.json(results);
  } catch (err) {
    console.error('데이터베이스 오류:', err);
    res.status(500).json({ error: '데이터베이스 오류' });
  }
};

