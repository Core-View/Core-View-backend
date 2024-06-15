const pool = require("../../config/databaseSet");


const getAlarm = async (user_id) => {
    
    let sql = `SELECT n.alarm_id, n.alarm_date time, f.post_id, p.post_title title, n.alarm_check
    FROM  alarm n
    JOIN feedback f ON n.feedback_id = f.feedback_id
    JOIN post p ON f.post_id = p.post_id
    WHERE n.user_id = ?
    ORDER BY n.alarm_date DESC`;

    try{
        let [result] = await pool.query(sql, [user_id]);

        return result;
    }catch(error){
        return null;
    }
}

const postAlarm = async (post_id, feedback_id) => {

    //알람을 받을 사람
    let sql = `SELECT USER_ID FROM POST WHERE POST_ID = ?`;

    try{
        let [result] = await pool.query(sql, [post_id]);

        console.log(result[0].USER_ID);
        let user_id = result[0].USER_ID;
        sql = `INSERT INTO ALARM (ALARM_DATE, FEEDBACK_ID, USER_ID, ALARM_CHECK) VALUES (now(),?,?,0)`;

        let [inser_result] = await pool.query(sql, [feedback_id,user_id]);

        
    }catch(error){
        console.log(error);
    }
}

const checkAlarm = async (req, res) => {
    let sql = `UPDATE alarm set alarm_check = 1 where alarm_check = 0 and user_id = ?`;

    try{
        let [result] = await pool.query(sql, [req.body.user_id]);

        res.status(200).send({success: true});
    }catch(error){
        console.log(error);

        res.status(500).send({success: false, message: '데이터베이스 오류'});
    }
}

module.exports = {getAlarm,postAlarm, checkAlarm};