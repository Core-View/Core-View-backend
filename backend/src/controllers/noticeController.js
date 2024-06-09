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
module.exports = {noticeView, noticeDetail, noticeDelete, noticeModify}