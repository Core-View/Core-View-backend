const express = require('express');
const router = express.Router();
const noticeController = require("../controllers/noticeController.js");

//조회
router.get("/view", noticeController.noticeView);

//상세조회
router.get("/view/:id", noticeController.noticeDetail);

//삭제
router.delete("/delete", noticeController.noticeDelete);

//수정
router.patch("/post", noticeController.noticeModify);

module.exports = router;