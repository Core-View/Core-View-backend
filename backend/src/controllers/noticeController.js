const noticeService = require("../services/noticeService");

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

module.exports = {noticeView, noticeDetail, noticeDelete, noticeModify, noticePost}