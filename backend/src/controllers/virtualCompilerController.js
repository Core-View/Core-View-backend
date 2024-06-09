const { pool } = require('../../config/databaseSet');
const { runCCode, runCppCode, runJavaCode, runPythonCode } = require('../services/virtualCompilerService');

async function compileCode(req, res) {
    const { title, language, code, user_id } = req.body;

    try {
        let output;
        switch (language) {
            case 'c':
                output = await runCCode(code);
                break;
            case 'cpp':
                output = await runCppCode(code);
                break;
            case 'java':
                output = await runJavaCode(code);
                break;
            case 'python':
                output = await runPythonCode(code);
                break;
            default:
                return res.status(400).send('Unsupported language');
        }

        // MySQL에 데이터 삽입
        const connection = await pool.getConnection();
        const [results, fields] = await connection.execute(
            'INSERT INTO post (post_title, post_code, post_content, post_date, user_id, language) VALUES (?, ?, ?, NOW(), ?, ?)',
            [title, code, output, user_id, language]
        );
        connection.release();

        // 삽입된 데이터의 ID를 가져와 수정을 위해 전송
        const postId = results.insertId;

        res.send({ postId, title, code, output, message: 'Post created successfully' });
    } catch (error) {
        res.status(500).send({ error: error.toString(), message: 'Failed to create post' });
    }
}

async function updateCode(req, res) {
    const { postId, title, code, output } = req.body;

    try {
        // MySQL에 데이터 수정
        const connection = await pool.getConnection();
        const [results, fields] = await connection.execute(
            'UPDATE post SET post_title = ?, post_code = ?, post_content = ? WHERE post_id = ?',
            [title, code, output, postId]
        );
        connection.release();

        // 수정된 데이터의 ID를 전송
        if (results.affectedRows > 0) {
            res.send({ postId, title, code, output, message: 'Post updated successfully' });
        } else {
            res.status(404).send({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).send({ error: error.toString(), message: 'Failed to update post' });
    }
}

async function deleteCode(req, res) {
    const { postId } = req.body;

    try {
        // MySQL에서 데이터 삭제
        const connection = await pool.getConnection();
        const [results, fields] = await connection.execute(
            'DELETE FROM post WHERE post_id = ?',
            [postId]
        );
        connection.release();

        // 삭제된 데이터의 ID를 전송
        if (results.affectedRows > 0) {
            res.send({ message: 'Post deleted successfully' });
        } else {
            res.status(404).send({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).send({ error: error.toString(), message: 'Failed to delete post' });
    }
}

module.exports = {
    compileCode,
    updateCode,
    deleteCode
};
