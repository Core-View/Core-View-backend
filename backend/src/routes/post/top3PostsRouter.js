// src/routes/topPostsRouter.js
const express = require('express');
const top3Controller = require('../../post/controller/top3PostController.js');

const router = express.Router();

// 상위 3개 게시물 가져오는 라우트
router.get('/top3post', top3Controller.getTop3Posts);

module.exports = router;
