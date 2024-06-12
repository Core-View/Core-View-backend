const express = require('express');
const router = express.Router();
const virtualCompilerController = require('../controllers/virtualCompilerController');

router.post('/compile', virtualCompilerController.compileCode);
router.put('/update', virtualCompilerController.updateCode); // 수정을 위한 라우터 추가
router.delete('/delete', virtualCompilerController.deleteCode); // 삭제를 위한 라우터 추가

module.exports = router;
