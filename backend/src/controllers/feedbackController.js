const feedbackService = require('../services/feedbackService');
const { handleResponse } = require('../utils/responseUtil');
const sseController = require('./sseController');
const controller = new sseController();
const alarmService = require('../services/alarmService');

// 피드백 생성
exports.createFeedback = async (req, res) => {
    try {
        const { post_id, user_id, feedback_comment, feedback_codenumber } = req.body;
        const feedbackData = { post_id, user_id, feedback_comment, feedback_codenumber };
        const feedback = await feedbackService.createFeedback(feedbackData);

        const alarm = await alarmService.postAlarm(post_id, feedback.insertId); //알람 설정

        handleResponse(res, 201, feedback);
    } catch (error) {
        console.error('Error in createFeedback:', error);
        handleResponse(res, 400, null, error);
    }
};

// 모든 피드백 조회
exports.getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await feedbackService.getAllFeedbacks();
        handleResponse(res, 200, feedbacks);
    } catch (error) {
        console.error('Error in getAllFeedbacks:', error);
        handleResponse(res, 500, null, error);
    }
};

// 특정 피드백 조회
exports.getFeedbackById = async (req, res) => {
    try {
        const feedback = await feedbackService.getFeedbackById(req.params.id);
        if (!feedback) {
            return handleResponse(res, 404, { error: 'Feedback not found' });
        }
        handleResponse(res, 200, feedback);
    } catch (error) {
        console.error('Error in getFeedbackById:', error);
        handleResponse(res, 500, null, error);
    }
};

// post_id로 특정 피드백 조회
exports.getFeedbacksByPostId = async (req, res) => {
    try {
        const feedbacks = await feedbackService.getFeedbacksByPostId(req.params.post_id);
        if (!feedbacks || feedbacks.length === 0) {
            return handleResponse(res, 404, { error: 'Feedbacks not found for the given post_id' });
        }
        handleResponse(res, 200, feedbacks);
    } catch (error) {
        console.error('Error in getFeedbacksByPostId:', error);
        handleResponse(res, 500, null, error);
    }
};

// 피드백 수정
exports.updateFeedback = async (req, res) => {
    try {
        const feedback = await feedbackService.updateFeedback(req.params.id, req.body);
        if (!feedback) {
            return handleResponse(res, 404, { error: 'Feedback not found' });
        }
        handleResponse(res, 200, feedback);
    } catch (error) {
        console.error('Error in updateFeedback:', error);
        handleResponse(res, 400, null, error);
    }
};

// 피드백 삭제
exports.deleteFeedback = async (req, res) => {
    try {
        const feedback = await feedbackService.deleteFeedback(req.params.id);
        if (!feedback) {
            return handleResponse(res, 404, { error: 'Feedback not found' });
        }
        handleResponse(res, 200, feedback);
    } catch (error) {
        console.error('Error in deleteFeedback:', error);
        handleResponse(res, 500, null, error);
    }
};

// 피드백 좋아요 생성
exports.createFeedbackLike = async (req, res) => {
    try {
        const feedbackLike = await feedbackService.createFeedbackLike(req.body);
        handleResponse(res, 201, feedbackLike);
    } catch (error) {
        console.error('Error in createFeedbackLike:', error);
        handleResponse(res, 400, null, error);
    }
};

// 피드백 좋아요 삭제
exports.deleteFeedbackLike = async (req, res) => {
    try {
        const feedbackLike = await feedbackService.deleteFeedbackLike(req.params.id);
        if (!feedbackLike) {
            return handleResponse(res, 404, { error: 'Feedback like not found' });
        }
        handleResponse(res, 200, feedbackLike);
    } catch (error) {
        console.error('Error in deleteFeedbackLike:', error);
        handleResponse(res, 500, null, error);
    }
};