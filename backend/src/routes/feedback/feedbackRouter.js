const express = require('express');
const router = express.Router();
const feedbackController = require('../../feedback/controller/feedbackController');
const token = require('../../../auth/jwtMiddle');  // JWT 미들웨어

router.post('/feedbacks', token.authGetJWT, feedbackController.createFeedback);
router.get('/feedbacks', feedbackController.getAllFeedbacks);
router.get('/feedbacks/post/:post_id', feedbackController.getFeedbacksByPostId); // 새로운 엔드포인트 추가
router.get('/feedbacks/:id', feedbackController.getFeedbackById);
router.patch('/feedbacks/:id', token.authGetJWT, feedbackController.updateFeedback);
router.delete('/feedbacks/:id', token.authGetJWT, feedbackController.deleteFeedback);

router.post('/feedbacklikes', token.authGetJWT, feedbackController.createFeedbackLike);
router.delete('/feedbacklikes/:id', token.authGetJWT, feedbackController.deleteFeedbackLike);

router.get('/feedbacklikes/:post_id/:user_id', feedbackController.getLikedFeedbacksByPostAndUser);

module.exports = router;