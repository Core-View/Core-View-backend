const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/authmiddleware');

router.post('/feedbacks', authMiddleware.authenticateSession, feedbackController.createFeedback);
router.get('/feedbacks', feedbackController.getAllFeedbacks);
router.get('/feedbacks/post/:post_id', feedbackController.getFeedbacksByPostId); // 새로운 엔드포인트 추가
router.get('/feedbacks/:id', feedbackController.getFeedbackById);
router.patch('/feedbacks/:id', authMiddleware.authenticateSession, feedbackController.updateFeedback);
router.delete('/feedbacks/:id', authMiddleware.authenticateSession, feedbackController.deleteFeedback);

router.post('/feedbacklikes', authMiddleware.authenticateSession, feedbackController.createFeedbackLike);
router.delete('/feedbacklikes/:id', authMiddleware.authenticateSession, feedbackController.deleteFeedbackLike);

module.exports = router;