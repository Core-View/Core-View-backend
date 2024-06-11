const feedbackService = require('../services/feedbackService');
const { handleResponse } = require('../utils/responseUtil');

exports.createFeedback = async (req, res) => {
    try {
        const { post_id, user_id, feedback_comment, feedback_codenumber } = req.body;
        const feedbackData = { post_id, user_id, feedback_comment, feedback_codenumber };
        const feedback = await feedbackService.createFeedback(feedbackData);
        handleResponse(res, 201, feedback);
    } catch (error) {
        console.error('Error in createFeedback:', error);
        handleResponse(res, 400, null, error);
    }
};

exports.getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await feedbackService.getAllFeedbacks();
        handleResponse(res, 200, feedbacks);
    } catch (error) {
        console.error('Error in getAllFeedbacks:', error);
        handleResponse(res, 500, null, error);
    }
};

exports.getFeedbackById = async (req, res) => {
    try {
        const feedback = await feedbackService.getFeedbackById(req.params.id);
        if (!feedback) {
            return handleResponse(res, 404, null, new Error('Feedback not found'));
        }
        handleResponse(res, 200, feedback);
    } catch (error) {
        console.error('Error in getFeedbackById:', error);
        handleResponse(res, 500, null, error);
    }
};

exports.updateFeedback = async (req, res) => {
    try {
        const feedback = await feedbackService.updateFeedback(req.params.id, req.body);
        if (!feedback.affectedRows) {
            return handleResponse(res, 404, null, new Error('Feedback not found'));
        }
        handleResponse(res, 200, feedback);
    } catch (error) {
        console.error('Error in updateFeedback:', error);
        handleResponse(res, 400, null, error);
    }
};

exports.deleteFeedback = async (req, res) => {
    try {
        const feedback = await feedbackService.deleteFeedback(req.params.id);
        if (!feedback.affectedRows) {
            return handleResponse(res, 404, null, new Error('Feedback not found'));
        }
        handleResponse(res, 200, feedback);
    } catch (error) {
        console.error('Error in deleteFeedback:', error);
        handleResponse(res, 500, null, error);
    }
};

exports.createFeedbackLike = async (req, res) => {
    try {
        const feedbackLike = await feedbackService.createFeedbackLike(req.body);
        handleResponse(res, 201, feedbackLike);
    } catch (error) {
        console.error('Error in createFeedbackLike:', error);
        handleResponse(res, 400, null, error);
    }
};

exports.deleteFeedbackLike = async (req, res) => {
    try {
        const feedbackLike = await feedbackService.deleteFeedbackLike(req.params.id);
        if (!feedbackLike.affectedRows) {
            return handleResponse(res, 404, null, new Error('Feedback like not found'));
        }
        handleResponse(res, 200, feedbackLike);
    } catch (error) {
        console.error('Error in deleteFeedbackLike:', error);
        handleResponse(res, 500, null, error);
    }
};