const feedbackService = require('../services/feedbackService');
const { handleResponse } = require('../utils/responseUtil');
const pool = require('../../config/databaseSet');

// 피드백 생성
exports.createFeedback = async (req, res) => {
  const { post_id, user_id, feedback_comment, feedback_codenumber } = req.body;
  
  try {
    // 현재 날짜와 시간을 가져오기
    const feedbackDate = new Date();
    const formattedDate = feedbackDate.toISOString().slice(0, 19).replace('T', ' ');

    // user_id로 user_nickname 조회
    const [userRows] = await pool.query('SELECT user_nickname FROM user WHERE user_id = ?', [user_id]);
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user_nickname = userRows[0].user_nickname;
    console.log('Feedback date:', formattedDate);

    // 피드백 생성
    const feedbackQuery = 'INSERT INTO feedback (post_id, user_id, user_nickname, feedback_date, feedback_comment, feedback_codenumber) VALUES (?, ?, ?, ?, ?, ?)';
    console.log('Executing query:', feedbackQuery);
    console.log('With values:', [post_id, user_id, user_nickname, formattedDate, feedback_comment, feedback_codenumber]);

    const [feedbackResult] = await pool.query(feedbackQuery, [post_id, user_id, user_nickname, formattedDate, feedback_comment, feedback_codenumber]);

    res.status(201).json(feedbackResult);
  } catch (error) {
    console.error('Error in createFeedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 모든 피드백 조회
exports.getAllFeedbacks = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM feedback');
    res.json(rows);
  } catch (error) {
    console.error('Error in getAllFeedbacks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 특정 post_id의 피드백 조회
exports.getFeedbacksByPostId = async (req, res) => {
  const post_id = req.params.post_id;
  try {
    const query = 'SELECT * FROM feedback WHERE post_id = ?';
    console.log(`Executing query: ${query} with post_id: ${post_id}`); // 디버깅 로그 추가
    const [rows] = await pool.query(query, [post_id]);
    res.json(rows);
  } catch (error) {
    console.error('Error in getFeedbacksByPostId:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ID로 특정 피드백 조회
exports.getFeedbackById = async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.query('SELECT * FROM feedback WHERE feedback_id = ?', [id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'Feedback not found' });
    }
  } catch (error) {
    console.error('Error in getFeedbackById:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 피드백 수정
exports.updateFeedback = async (req, res) => {
  const id = req.params.id;
  const { post_id, user_id, feedback_comment, feedback_codenumber } = req.body;
  try {
    // user_id로 user_nickname 조회
    const [userRows] = await pool.query('SELECT user_nickname FROM user WHERE user_id = ?', [user_id]);
    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user_nickname = userRows[0].user_nickname;

    const query = 'UPDATE feedback SET post_id = ?, user_id = ?, user_nickname = ?, feedback_comment = ?, feedback_codenumber = ? WHERE feedback_id = ?';
    const [result] = await pool.query(query, [post_id, user_id, user_nickname, feedback_comment, feedback_codenumber, id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Feedback updated successfully' });
    } else {
      res.status(404).json({ error: 'Feedback not found' });
    }
  } catch (error) {
    console.error('Error in updateFeedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 피드백 삭제
exports.deleteFeedback = async (req, res) => {
  const id = req.params.id;
  try {
    const query = 'DELETE FROM feedback WHERE feedback_id = ?';
    const [result] = await pool.query(query, [id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Feedback deleted successfully' });
    } else {
      res.status(404).json({ error: 'Feedback not found' });
    }
  } catch (error) {
    console.error('Error in deleteFeedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 피드백 좋아요 생성
exports.createFeedbackLike = async (req, res) => {
  const { user_id, feedback_id } = req.body;
  try {
    const query = 'INSERT INTO feedback_likes (user_id, feedback_id) VALUES (?, ?)';
    const [result] = await pool.query(query, [user_id, feedback_id]);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error in createFeedbackLike:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 피드백 좋아요 삭제
exports.deleteFeedbackLike = async (req, res) => {
  const id = req.params.id;
  try {
    const query = 'DELETE FROM feedback_likes WHERE feedbacklike_id = ?';
    const [result] = await pool.query(query, [id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Feedback like deleted successfully' });
    } else {
      res.status(404).json({ error: 'Feedback like not found' });
    }
  } catch (error) {
    console.error('Error in deleteFeedbackLike:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};