const pool = require('../../config/databaseSet');

// 좋아요를 받는 함수
exports.likePost = async (req, res) => {
  const { post_id, user_id } = req.body; // 요청 본문에서 post_id와 user_id 가져오기

  if (!post_id || !user_id) {
    return res.status(400).json({ error: 'post_id 또는 user_id 파라미터가 없습니다.' });
  }

  // 중복 여부를 확인하는 쿼리
  const checkDuplicateQuery = `
    SELECT * FROM post_likes WHERE post_id = ? AND user_id = ?
  `;

  const insertLikeQuery = `
    INSERT INTO post_likes (post_id, user_id, post_likes_date) VALUES (?, ?, NOW()) 
  `;

  const checkPostAuthorQuery = `
    SELECT user_id FROM post WHERE post_id = ?
  `;

  try {
    // 포스트 작성자 확인
    const [postAuthor] = await pool.query(checkPostAuthorQuery, [post_id]);
    
    if (postAuthor.length === 0) {
      return res.status(404).json({ error: '해당 포스트를 찾을 수 없습니다.' });
    }

    if (postAuthor[0].user_id === user_id) {
      return res.status(400).json({ error: '본인의 포스트는 좋아요 할 수 없습니다.' });
    }

    const [existingLikes] = await pool.query(checkDuplicateQuery, [post_id, user_id]);

    if (existingLikes.length > 0) {
      return res.status(400).json({ error: '이미 이 포스트를 좋아요 했습니다.' });
    }

    await pool.query(insertLikeQuery, [post_id, user_id]);
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
  
    await pool.query(sqlQuery, [post_id, user_id]);
    res.status(200).json({ message: '포스트 좋아요가 성공적으로 취소되었습니다.' });
  } catch (err) {
    console.error('데이터베이스 오류:', err);
    res.status(500).json({ error: '데이터베이스 오류' });
  }
};

// 제목으로 포스트를 검색하는 함수
exports.searchPostsByTitle = async (req, res) => {
  const { post_title } = req.params;
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
      u.user_contribute,
      COUNT(pl.post_id) AS total_likes
    FROM post p
    LEFT JOIN user u ON p.user_id = u.user_id
    LEFT JOIN post_likes pl ON p.post_id = pl.post_id
    GROUP BY p.post_id, p.post_title, p.post_date, p.language, p.user_id, u.user_nickname,u.user_contribute
    ORDER BY p.post_date DESC
  `;

  try {
   
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
      u.user_contribute,
      COUNT(pl.post_id) AS total_likes 
    FROM post p 
    LEFT JOIN user u ON p.user_id = u.user_id 
    LEFT JOIN post_likes pl ON p.post_id = pl.post_id 
    GROUP BY p.post_id, p.post_title, p.post_date, p.language, p.user_id, u.user_nickname,u.user_contribute
    ORDER BY total_likes DESC
  `;

  try {
 
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
      u.user_contribute,
      COUNT(pl.post_id) AS total_likes
    FROM post p
    LEFT JOIN post_likes pl ON p.post_id = pl.post_id
    LEFT JOIN user u ON p.user_id = u.user_id 
    GROUP BY p.post_id, p.post_title, p.post_date, p.language, p.user_id,u.user_contribute
    ORDER BY p.post_date DESC
    LIMIT 3
  `;

  try {
   
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

  const userContributionQuery = `
    SELECT user_contribute
    FROM user
    WHERE user_id = ?
  `;

  try {

    const [[userContributionResult]] = await pool.query(userContributionQuery, [user_id]);

    if (!userContributionResult) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    res.json({
      user_id,
      user_contribute: userContributionResult.user_contribute
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
      user_id, 
      user_contribute
    FROM user
    ORDER BY user_contribute DESC
    LIMIT 3
  `;

  try {
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
      u.user_image,
      u.user_contribute,
      COUNT(pl.post_id) AS total_likes
    FROM post p
    LEFT JOIN user u ON p.user_id = u.user_id
    LEFT JOIN post_likes pl ON p.post_id = pl.post_id
    WHERE p.post_id = ?
    GROUP BY p.post_id, p.post_title, p.post_content, p.post_code, p.post_date, p.language, p.user_id, p.post_result, u.user_nickname,u.user_contribute
  `;

  try {
    const [results] = await pool.query(sqlQuery, [post_id]);

    if (results.length === 0) {
      return res.status(404).json({ error: '포스트를 찾을 수 없습니다.' });
    }

    res.json(results[0]);
  } catch (err) {
    console.error('데이터베이스 오류:', err);
    res.status(500).json({ error: '데이터베이스 오류' });
  }};
