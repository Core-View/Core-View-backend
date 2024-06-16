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

//작성
router.post("/post", noticeController.noticePost);

//이미지 첨부
// router.post("image", upload.single('image'), (req, res) => {
//     res.status(200).json(req.file); //파일 경로 전송
// })

router.get("/viewuser", noticeController.noticeUser);

module.exports = router;