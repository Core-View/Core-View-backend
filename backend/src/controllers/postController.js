// src/controllers/postController.js
const db = require('../../config/databaseSet');

// 포스트 제목으로 검색하는 함수
exports.searchPostsByTitle = async (req, res) => {
  const { post_title } = req.query;
  const sqlQuery = `
    SELECT * 
    FROM post 
    WHERE post_title LIKE '%${post_title}%'
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

// 좋아요를 받는 함수
exports.likePost = async (req, res) => {
  const { post_id, user_id } = req.body; // 사용자의 ID를 요청 바디에서 받아옴
  const sqlQuery = `
    INSERT INTO post_likes (post_id, user_id) VALUES (${post_id}, ${user_id}) 
  `;

  try {
    console.log('Executing query:', sqlQuery);
    await db.pool.query(sqlQuery);
    res.status(201).json({ message: 'Post liked successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
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
    console.log('Executing query:', sqlQuery);
    const [results] = await db.pool.query(sqlQuery);
    res.json(results);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
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
    console.log('Executing query:', sqlQuery);
    const [results] = await db.pool.query(sqlQuery);
    res.json(results);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
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
    console.log('Executing query:', sqlQuery);
    const [results] = await db.pool.query(sqlQuery);
    res.json(results);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};
