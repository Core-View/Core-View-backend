const pool = require('../../config/databaseSet');
const { formatDateToISOString } = require('../utils/dateUtil');

// 새로운 피드백 생성
exports.createFeedback = async (data) => {
  const { post_id, user_id, feedback_comment, feedback_codenumber } = data;
  const feedback_date = formatDateToISOString(new Date());
  const query = `
    INSERT INTO feedback (post_id, user_id, feedback_date, feedback_comment, feedback_codenumber)
    VALUES (?, ?, ?, ?, ?)
  `;
  try {
    const [result] = await pool.query(query, [post_id, user_id, feedback_date, feedback_comment, feedback_codenumber]);
    return result;
  } catch (error) {
    console.error('Error in createFeedback:', error);
    throw error;
  }
};

// 모든 피드백 조회
exports.getAllFeedbacks = async () => {
  const query = `SELECT * FROM feedback`;
  try {
    const [rows] = await pool.query(query);
    return rows;
  } catch (error) {
    console.error('Error in getAllFeedbacks:', error);
    throw error;
  }
};

// 특정 피드백 조회
exports.getFeedbackById = async (id) => {
  const query = `SELECT * FROM feedback WHERE feedback_id = ?`;
  try {
    const [rows] = await pool.query(query, [id]);
    return rows[0];
  } catch (error) {
    console.error('Error in getFeedbackById:', error);
    throw error;
  }
};

// post_id로 특정 피드백 조회
exports.getFeedbacksByPostId = async (post_id) => {
  const query = `SELECT * FROM feedback WHERE post_id = ?`;
  try {
    const [rows] = await pool.query(query, [post_id]);
    return rows;
  } catch (error) {
    console.error('Error in getFeedbacksByPostId:', error);
    throw error;
  }
};

// 피드백 수정
exports.updateFeedback = async (id, data) => {
  const { post_id, user_id, feedback_date, feedback_comment, feedback_codenumber } = data;
  const query = `
    UPDATE feedback
    SET post_id = ?, user_id = ?, feedback_date = ?, feedback_comment = ?, feedback_codenumber = ?
    WHERE feedback_id = ?
  `;
  try {
    const [result] = await pool.query(query, [post_id, user_id, feedback_date, feedback_comment, feedback_codenumber, id]);
    return result;
  } catch (error) {
    console.error('Error in updateFeedback:', error);
    throw error;
  }
};

// 피드백 삭제
exports.deleteFeedback = async (id) => {
  const query = `DELETE FROM feedback WHERE feedback_id = ?`;
  try {
    const [result] = await pool.query(query, [id]);
    return result;
  } catch (error) {
    console.error('Error in deleteFeedback:', error);
    throw error;
  }
};

// 피드백 좋아요 생성
exports.createFeedbackLike = async (data) => {
  const { user_id, feedback_id } = data;
  const query = `
    INSERT INTO feedback_likes (user_id, feedback_id)
    VALUES (?, ?)
  `;
  try {
    const [result] = await pool.query(query, [user_id, feedback_id]);
    return result;
  } catch (error) {
    console.error('Error in createFeedbackLike:', error);
    throw error;
  }
};

// 피드백 좋아요 삭제
exports.deleteFeedbackLike = async (id) => {
  const query = `DELETE FROM feedback_likes WHERE feedbacklike_id = ?`;
  try {
    const [result] = await pool.query(query, [id]);
    return result;
  } catch (error) {
    console.error('Error in deleteFeedbackLike:', error);
    throw error;
  }
};