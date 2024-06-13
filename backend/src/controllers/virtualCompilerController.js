const pool = require('../../config/databaseSet');
const { runCCode, runCppCode, runJavaCode, runPythonCode } = require('../services/virtualCompilerService');

async function compileCode(req, res) {
    const { title, language, code, content, user_id } = req.body;

    try {
        let output;
        let result;
        switch (language) {
            case 'c':
                result = await runCCode(code);
                output = result.output;
                break;
            case 'cpp':
                result = await runCppCode(code);
                output = result.output;
                break;
            case 'java':
                result = await runJavaCode(code);
                output = result.output;
                break;
            case 'python':
                result = await runPythonCode(code);
                output = result.output;
                break;
            default:
                return res.status(400).send('Unsupported language');
        }

        // MySQL에 데이터 삽입
        const connection = await pool.getConnection();
        const [results, fields] = await connection.execute(
            'INSERT INTO coreview.post (post_title, post_code, post_result, post_content, post_date, user_id, language) VALUES (?, ?, ?, ?, NOW(), ?, ?)',
            [title, code, result, content, user_id, language]
        );
        connection.release();

        // 삽입된 데이터의 ID를 가져와 수정을 위해 전송
        const postId = results.insertId;

        res.send({ postId, title, code, output, result, message: 'Post created successfully' });
    } catch (error) {
        // 만약 컴파일 에러가 발생하면 여기서 처리
        const errorMessage = error.output || error.toString(); // 에러 메시지가 output에 있다고 가정하고 처리
        res.status(200).send({ postId: null, title, code, output: errorMessage, result: null, message: 'Failed to compile, but post created successfully' });
    }
}

async function updateCode(req, res) {
    const { postId, title, code, result, content } = req.body;

    try {
        // MySQL에 데이터 수정
        const connection = await pool.getConnection();
        const [results, fields] = await connection.execute(
            'UPDATE coreview.post SET post_title = ?, post_code = ?, post_content = ? WHERE post_id = ?',
            [title, code, content, postId]
        );
        connection.release();

        // 수정된 데이터의 ID를 전송
        if (results.affectedRows > 0) {
            res.send({ postId, title, code, result, message: 'Post updated successfully' });
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
            'DELETE FROM coreview.post WHERE post_id = ?',
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
