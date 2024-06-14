const noticeService = require("../services/noticeService");
const multer = require('multer');
const noticeView = (req, res) => {

    noticeService.getNotice(res);
}

const noticeDetail = (req, res) => {
    let id = req.params.id;
  
    noticeService.getDetail(id, res);
}

const noticeDelete = (req, res) => {
    let notice_id = req.get('notice_id');

    noticeService.deleteNotice(notice_id, res);
}

const noticeModify = (req, res) => {
    noticeService.updateNotice(req,res);
}

const noticePost = (req, res) => {

    if(req.body.title == null || req.body.content == null){
        res.status(400).send({success: false, message: "제목과 내용을 다시 확인해주세요"});
    }
    noticeService.postNotice(req, res);
}

const noticeUser = (req, res) => {
    noticeService.getUser(req, res);
}

const noticeImage = multer.diskStorage({
	// (2)
	destination: (req, file, cb) => {
		// (3)

		cb(null, '../../../Front-End/front/public/images/post_notice');
	},
	filename: (req, file, cb) => {
		// (4)
		imageNames.push(file.originalname);
		cb(null, file.originalname); // (5)
	},
});

const upload = multer({
	// (6)
	noticeImage,
	fileFilter: (req, file, cb) => {
		if (['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
			cb(null, true);
		} else cb(new Error('해당 파일의 형식을 지원하지 않습니다.'), false);
	},
	limits: {
		fileSize: 1024 * 1024 * 5,
	},
});

module.exports = {noticeView, noticeDetail, noticeDelete, noticeModify, noticePost, noticeUser, upload}