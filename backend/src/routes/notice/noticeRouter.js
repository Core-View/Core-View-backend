const express = require('express');
const router = express.Router();
const noticeController = require("../../notice/controller/noticeController");
const multer = require('multer');
const {authAdminJWT} = require('../../../auth/jwtMiddle')

const noticeImage = multer.diskStorage({
	// (2)
	destination: (req, file, cb) => {
		// (3)

		cb(null, '../../../../front/front/front/public/images/post_notice');
	},
	filename: (req, file, cb) => {
		// (4)
		cb(null, file.originalname); // (5)
	},
});

const upload = multer({
	// (6)
	storage: noticeImage,
	fileFilter: (req, file, cb) => {
		if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
			cb(null, true);
		} else cb(new Error('해당 파일의 형식을 지원하지 않습니다.'), false);
	},
	limits: {
		fileSize: 1024 * 1024 * 5,
	},
});

//조회
router.get("/view", authAdminJWT, noticeController.noticeView);

//상세조회
router.get("/view/:id", noticeController.noticeDetail);

//삭제
router.delete("/post", authAdminJWT, noticeController.noticeDelete);

//수정
router.patch("/post", authAdminJWT, noticeController.noticeModify);

//작성
router.post("/post", authAdminJWT, noticeController.noticePost);


router.get("/viewuser", authAdminJWT, noticeController.noticeUser);

//이미지 첨부
router.post("/image", upload.single('image'), (req, res) => {
    res.status(200).send({success: true});
});

module.exports = router;