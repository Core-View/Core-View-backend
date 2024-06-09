const express = require('express');
const userController = require('../controllers/mypageController');
const router = express.Router();

// 마이 페이지 조회
router.get('/:user_id', userController.getUser.bind(userController));

// 마이 페이지 수정
router.put('/:user_id/modify', userController.modifyUser.bind(userController));

// 사용자 삭제
router.delete('/:user_id/delete', userController.deleteUser.bind(userController));

module.exports = router;
