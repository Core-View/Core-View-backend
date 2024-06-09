// src/routes/postRouter.js
const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router();

// 포스트 제목으로 검색하는 라우트
router.get('/searchPosts', postController.searchPostsByTitle);

// 최신 순으로 포스트를 가져오는 라우트
router.get('/latestPosts', postController.getPostsByDate);

// 좋아요가 많은 순으로 포스트를 가져오는 라우트
router.get('/popularPosts', postController.getPostsByLikes);

// 좋아요를 추가하는 라우트
router.post('/likePost', postController.likePost);

module.exports = router;
