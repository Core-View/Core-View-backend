const express = require('express');
const router = express.Router();
const userController = require('../../mypage/controller/mypageController');
const multer = require('multer');
const token = require('../../../auth/jwtMiddle')

// 파일 업로드 처리를 위한 multer 미들웨어 설정
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 마이 페이지 조회
router.get('/:user_id',token.authGetJWT, userController.getUser.bind(userController));

// 마이 페이지 수정
router.put('/:user_id/modify',token.authGetJWT, userController.modifyUser.bind(userController));

// 사용자 이미지 수정 (POST 방식으로 이미지 추가 및 변경)
router.post('/:user_id/modifyImage',token.authGetJWT, upload.single('user_image'), userController.modifyUserImage.bind(userController));

//사용자 이미지 삭제
router.post('/:user_id/deleteImage',token.authGetJWT, userController.DeleteUserImage.bind(userController));

// 사용자 삭제
router.delete('/:user_id/delete',token.authGetJWT, userController.deleteUser.bind(userController));

// 사용자 게시물 제목 조회
router.get('/:user_id/posts',token.authGetJWT, userController.getUserPosts.bind(userController));

// 사용자 피드백 조회
router.get('/:user_id/feedback',token.authGetJWT, userController.getUserFeedback.bind(userController));

// 사용자가 좋아요를 누른 게시물 조회
router.get('/:user_id/likedPosts',token.authGetJWT, userController.getLikedPosts.bind(userController));

module.exports = router;
