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

// 좋아요를 취소하는 함수
exports.unlikePost = async (req, res) => {
  const { post_id, user_id } = req.params; // URL 파라미터에서 post_id와 user_id 가져오기

  if (!post_id || !user_id) {
    return res.status(400).json({ error: 'post_id 또는 user_id 파라미터가 없습니다.' });
  }

  const sqlQuery = `
    DELETE FROM post_likes WHERE post_id = ? AND user_id = ?
  `;

  try {
    console.log('쿼리 실행 중:', sqlQuery);
    await pool.query(sqlQuery, [post_id, user_id]);
    res.status(200).json({ message: '포스트 좋아요가 성공적으로 취소되었습니다.' });
  } catch (err) {
    console.error('데이터베이스 오류:', err);
    res.status(500).json({ error: '데이터베이스 오류' });
  }
};

// 제목으로 포스트를 검색하는 함수
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
    SELECT 
      p.post_id, 
      p.post_title, 
      p.post_date, 
      p.language, 
      p.user_id,
      u.user_nickname,
      COUNT(pl.post_id) AS total_likes
    FROM post p
    LEFT JOIN user u ON p.user_id = u.user_id
    LEFT JOIN post_likes pl ON p.post_id = pl.post_id
    GROUP BY p.post_id, p.post_title, p.post_date, p.language, p.user_id, u.user_nickname
    ORDER BY p.post_date DESC
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
    SELECT 
      p.post_id, 
      p.post_title, 
      p.post_date, 
      p.language, 
      p.user_id, 
      u.user_nickname,
      COUNT(pl.post_id) AS total_likes 
    FROM post p 
    LEFT JOIN user u ON p.user_id = u.user_id 
    LEFT JOIN post_likes pl ON p.post_id = pl.post_id 
    GROUP BY p.post_id, p.post_title, p.post_date, p.language, p.user_id, u.user_nickname
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
    SELECT 
      p.post_id, 
      p.post_title, 
      p.post_date, 
      p.language, 
      p.user_id,
      COUNT(pl.post_id) AS total_likes
    FROM post p
    LEFT JOIN post_likes pl ON p.post_id = pl.post_id
    GROUP BY p.post_id, p.post_title, p.post_date, p.language, p.user_id
    ORDER BY p.post_date DESC
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

  const postLikesQuery = `
    SELECT COUNT(*) AS post_likes
    FROM post_likes
    WHERE user_id = ?
  `;

  const feedbackLikesQuery = `
    SELECT COUNT(*) AS feedback_likes
    FROM feedback_likes
    WHERE user_id = ?
  `;

  const feedbackCountQuery = `
    SELECT COUNT(*) AS feedback_count
    FROM feedback
    WHERE user_id = ?
  `;

  try {
    console.log('쿼리 실행 중: 사용자 기여도');
    
    const [[postLikesResult]] = await pool.query(postLikesQuery, [user_id]);
    const [[feedbackLikesResult]] = await pool.query(feedbackLikesQuery, [user_id]);
    const [[feedbackCountResult]] = await pool.query(feedbackCountQuery, [user_id]);

    const totalContribution = postLikesResult.post_likes + feedbackLikesResult.feedback_likes + feedbackCountResult.feedback_count;

    res.json({
      user_id,
      post_likes: postLikesResult.post_likes,
      feedback_likes: feedbackLikesResult.feedback_likes,
      feedback_count: feedbackCountResult.feedback_count,
      total_contribution: totalContribution
    });
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
      IFNULL(post_likes.total, 0) AS post_likes, 
      IFNULL(feedback_likes.total, 0) AS feedback_likes, 
      IFNULL(feedback_count.total, 0) AS feedback_count,
      (IFNULL(post_likes.total, 0) + IFNULL(feedback_likes.total, 0) + IFNULL(feedback_count.total, 0)) AS total_contribution 
    FROM user u 
    LEFT JOIN (
      SELECT user_id, COUNT(*) AS total
      FROM post_likes
      GROUP BY user_id
    ) post_likes ON u.user_id = post_likes.user_id 
    LEFT JOIN (
      SELECT user_id, COUNT(*) AS total
      FROM feedback_likes
      GROUP BY user_id
    ) feedback_likes ON u.user_id = feedback_likes.user_id 
    LEFT JOIN (
      SELECT user_id, COUNT(*) AS total
      FROM feedback
      GROUP BY user_id
    ) feedback_count ON u.user_id = feedback_count.user_id
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

// 공지사항을 가져오는 함수
exports.getNotice = (req, res) => {
  noticeService.getNoticeToPost(req, res);
};

// 특정 post_id에 대한 모든 세부 정보를 가져오는 함수
exports.getPostDetails = async (req, res) => {
  const { post_id } = req.params;

  if (!post_id) {
    return res.status(400).json({ error: 'post_id 파라미터가 없습니다.' });
  }

  const sqlQuery = `
    SELECT 
      p.post_id, 
      p.post_title, 
      p.post_content, 
      p.post_code, 
      p.post_date, 
      p.language, 
      p.user_id, 
      p.post_result,
      u.user_nickname,
      COUNT(pl.post_id) AS total_likes
    FROM post p
    LEFT JOIN user u ON p.user_id = u.user_id
    LEFT JOIN post_likes pl ON p.post_id = pl.post_id
    WHERE p.post_id = ?
    GROUP BY p.post_id, p.post_title, p.post_content, p.post_code, p.post_date, p.language, p.user_id, p.post_result, u.user_nickname
  `;

  try {
    console.log('쿼리 실행 중:', sqlQuery);
    const [results] = await pool.query(sqlQuery, [post_id]);

    if (results.length === 0) {
      return res.status(404).json({ error: '포스트를 찾을 수 없습니다.' });
    }

    res.json(results[0]);
  } catch (err) {
    console.error('데이터베이스 오류:', err);
    res.status(500).json({ error: '데이터베이스 오류' });
  }};
