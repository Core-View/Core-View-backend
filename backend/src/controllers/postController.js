const pool = require('../../config/databaseSet');

// 좋아요를 받는 함수
exports.likePost = async (req, res) => {
  const { post_id, user_id } = req.body; // 요청 본문에서 post_id와 user_id 가져오기

  if (!post_id || !user_id) {
    return res.status(400).json({ error: 'post_id 또는 user_id 파라미터가 없습니다.' });
  }

  const sqlQuery = `
    INSERT INTO post_likes (post_id, user_id, post_likes_date) VALUES (?, ?, NOW()) 
  `;

  try {
    console.log('쿼리 실행 중:', sqlQuery);
    await pool.query(sqlQuery, [post_id, user_id]);
    res.status(201).json({ message: '포스트가 성공적으로 좋아요 되었습니다.' });
  } catch (err) {
    console.error('데이터베이스 오류:', err);
    res.status(500).json({ error: '데이터베이스 오류' });
  }
};

//제목으로 포스트를 검색하는 함수
exports.searchPostsByTitle = async (req, res) => {
  const { post_title } = req.query;
  try {
      const [rows, fields] = await pool.query(
          `SELECT * FROM post WHERE post_title LIKE ?`,
          [`%${post_title}%`]
      );
      res.json({ success: true, data: rows });
  } catch (error) {
      console.error("검색 오류:", error);
      res.status(500).json({ success: false, message: "검색 중 오류가 발생했습니다." });
  }
};


// 최신 순으로 포스트를 정렬하는 함수
exports.getPostsByDate = async (req, res) => {
  const sqlQuery = `
    SELECT * 
    FROM post 
    ORDER BY post_date DESC
  `;

  try {
    console.log('쿼리 실행 중:', sqlQuery);
    const [results] = await pool.query(sqlQuery);
    res.json(results);
  } catch (err) {
    console.error('데이터베이스 오류:', err);
    res.status(500).json({ error: '데이터베이스 오류' });
  }
};

// 좋아요가 많은 순으로 포스트를 정렬하는 함수
exports.getPostsByLikes = async (req, res) => {
  const sqlQuery = `
    SELECT p.*, COUNT(pl.post_id) AS total_likes 
    FROM post p 
    LEFT JOIN post_likes pl ON p.post_id = pl.post_id 
    GROUP BY p.post_id 
    ORDER BY total_likes DESC
  `;

  try {
    console.log('쿼리 실행 중:', sqlQuery);
    const [results] = await pool.query(sqlQuery);
    res.json(results);
  } catch (err) {
    console.error('데이터베이스 오류:', err);
    res.status(500).json({ error: '데이터베이스 오류' });
  }
};

// 최근 게시물 중에서 최신 3개를 가져오는 함수
exports.getRecent3Posts = async (req, res) => {
  const sqlQuery = `
    SELECT * 
    FROM post 
    ORDER BY post_date DESC
    LIMIT 3
  `;

  try {
    console.log('쿼리 실행 중:', sqlQuery);
    const [results] = await pool.query(sqlQuery);
    res.json(results);
  } catch (err) {
    console.error('데이터베이스 오류:', err);
    res.status(500).json({ error: '데이터베이스 오류' });
  }
};

// 사용자 기여도를 가져오는 함수
exports.getUserContribution = async (req, res) => {
  const { user_id } = req.body; // 요청 본문에서 user_id 가져오기

  const sqlQuery = `
    SELECT 
      u.user_id, 
      IFNULL(SUM(pl.post_id IS NOT NULL), 0) AS post_likes, 
      IFNULL(SUM(fl.feedback_id IS NOT NULL), 0) AS feedback_likes, 
      (IFNULL(SUM(pl.post_id IS NOT NULL), 0) + IFNULL(SUM(fl.feedback_id IS NOT NULL), 0)) AS total_contribution 
    FROM user u 
    LEFT JOIN post_likes pl ON u.user_id = pl.user_id 
    LEFT JOIN feedback_likes fl ON u.user_id = fl.user_id 
    WHERE u.user_id = ? 
    GROUP BY u.user_id
  `;

  try {
    console.log('쿼리 실행 중:', sqlQuery);
    const [results] = await pool.query(sqlQuery, [user_id]);
    res.json(results);
  } catch (err) {
    console.error('데이터베이스 오류:', err);
    res.status(500).json({ error: '데이터베이스 오류' });
  }
};

// 기여도가 높은 상위 3명의 사용자를 가져오는 함수
exports.getTop3Contributors = async (req, res) => {
  const sqlQuery = `
    SELECT 
      u.user_id, 
      IFNULL(SUM(pl.post_id IS NOT NULL), 0) AS post_likes, 
      IFNULL(SUM(fl.feedback_id IS NOT NULL), 0) AS feedback_likes, 
      (IFNULL(SUM(pl.post_id IS NOT NULL), 0) + IFNULL(SUM(fl.feedback_id IS NOT NULL), 0)) AS total_contribution 
    FROM user u 
    LEFT JOIN post_likes pl ON u.user_id = pl.user_id 
    LEFT JOIN feedback_likes fl ON u.user_id = fl.user_id 
    GROUP BY u.user_id
    ORDER BY total_contribution DESC
    LIMIT 3
  `;

  try {
    console.log('쿼리 실행 중:', sqlQuery);
    const [results] = await pool.query(sqlQuery);
    res.json(results);
  } catch (err) {
    console.error('데이터베이스 오류:', err);
    res.status(500).json({ error: '데이터베이스 오류' });
  }
};
