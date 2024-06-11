const pool = require("../../config/databaseSet");


const getAlarm = async (user_id) => {

    let sql = `SELECT n.alarm_id, n.alarm_date time, n.feedback_id, p.post_title title, n.alarm_check
    FROM  alarm n
    JOIN feedback f ON n.feedback_id = f.feedback_id
    JOIN post p ON f.post_id = p.post_id
    WHERE n.user_id = 1;`;

    try{
        let [result] = await pool.query(sql, [user_id]);

        return result;
    }catch(error){
        return null;
    }
}

module.exports = {getAlarm};