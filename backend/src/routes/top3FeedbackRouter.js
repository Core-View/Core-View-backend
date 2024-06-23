// src/routes/top3FeedbackRouter.js
const express = require('express');
const feedbackController = require('../controllers/top3FeedbackController');

const router = express.Router();

// 최근 2주간의 댓글 중에서 좋아요가 많은 상위 3개를 가져오는 라우트
router.get('/topFeedback', feedbackController.getTop3Feedback);

module.exports = router;
