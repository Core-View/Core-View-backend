const pool = require("../../config/databaseSet");

const getNotice = async (res) => {
    let sql = `SELECT NOTICE_ID, NOTICE_TITLE, NOTICE_DATE FROM NOTICE`;

    try {
        const [result] = await pool.query(sql);
        console.log(result);
        res.status(200).send({
            success: true,
            notice: result
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({success: false, message: "잠시후 다시 시도해주세요"});
    }
}

const getDetail = async (notice_id, res) => {
    let sql = `SELECT NOTICE_ID, NOTICE_TITLE, NOTICE_CONTENT, NOTICE_IMAGE, NOTICE_DATE FROM NOTICE WHERE NOTICE_ID = ?`;

    try {
        const [result] = await pool.query(sql, [notice_id]);
        
        res.status(200).send({
            success: true,
            notice: result
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({success: false, message: "잠시후 다시 시도해주세요"});
    }
}

const deleteNotice = async (notice_id, res) => {
    let sql = `DELETE FROM NOTICE WHERE NOTICE_ID = ?`;

    try {
        const [result] = await pool.query(sql, [notice_id]);
        res.status(200).send({
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({success: false, message: "공지 삭제 실패"});
    }
}

const updateNotice = async (req, res) => {
    let sql = `UPDATE NOTICE SET NOTICE_TITLE = ?, NOTICE_CONTENT = ? WHERE NOTICE_ID = ?`;
  
    try {
        const [result] = await pool.query(sql, [req.body.notice_title, req.body.notice_content, req.body.notice_id]);
        res.status(200).send({success: true});
    } catch (error) {
        console.log(error);
        res.status(500).send({success: false, message: "잠시후 다시 시도해주세요"});
    }
}

const postNotice = async (req, res) => {
    let sql = `INSERT INTO NOTICE (NOTICE_TITLE, NOTICE_CONTENT, NOTICE_DATE) VALUES (?,?, NOW())`;

    try{
        const [result] = await pool.query(sql, [req.body.title, req.body.content]);
        res.status(200).send({success: true});
    }catch (error) {
        console.log(error);
        res.status(500).send({success: false, message: "잠시후 다시 시도해주세요"});
    }
}

const getUser = async (req, res) => {
    let sql = `SELECT USER_ID, USER_NAME, USER_NICKNAME, USER_EMAIL, USER_CONTRIBUTE FROM USER`;

    try{
        const [result] = await pool.query(sql);
        res.status(200).send({success: true, user: result});
    }catch(error) {
        console.log(error);
        res.status(500).send({success: false, message: "잠시후 다시 시도해주세요"});
    }
}

module.exports = {getNotice, getDetail, deleteNotice, updateNotice, postNotice, getUser}