// src/routes/postRouter.js

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// 포스트 제목으로 검색
router.get('/search', postController.searchPostsByTitle);

// 포스트 좋아요
router.post('/likes', postController.likePost);

// 최신 순으로 포스트 가져오기
router.get('/latest', postController.getPostsByDate);

// 좋아요가 많은 순으로 포스트 가져오기
router.get('/mostlike', postController.getPostsByLikes);

// 최근 게시물 중에서 최신 3개 가져오기
router.get('/recent', postController.getRecent3Posts);

// 사용자 기여도 가져오기
router.post('/contribution', postController.getUserContribution);

// 기여도가 높은 상위 3명의 사용자 가져오기
router.get('/top-contributors', postController.getTop3Contributors);

module.exports = router;
