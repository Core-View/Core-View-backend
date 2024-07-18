const express = require('express');
const router = express.Router();
const postController = require('../../post/controller/postController');
const { authGetJWT } = require('../../../auth/jwtMiddle');

// 포스트 관련 라우트
router.get('/search', postController.searchPostsByTitle);
router.post('/like', authGetJWT, postController.likePost); // 포스트 좋아요
router.delete('/unlike/:post_id/:user_id', authGetJWT, postController.unlikePost); // 포스트 좋아요 취소
router.get('/latest', postController.getPostsByDate); // 최신 순으로 포스트 가져오기
router.get('/mostlike', postController.getPostsByLikes); // 좋아요가 많은 순으로 포스트 가져오기
router.get('/recent', postController.getRecent3Posts); // 최근 게시물 중에서 최신 3개 가져오기
router.post('/contribution', authGetJWT, postController.getUserContribution); // 사용자 기여도 가져오기
router.get('/top-contributors', postController.getTop3Contributors); // 기여도가 높은 상위 3명의 사용자 가져오기
router.get('/all-contributors', postController.getContributors); // 전체 기여도 가져오기
router.get('/notice', postController.getNotice);
router.get('/details/:post_id', postController.getPostDetails);

module.exports = router;
