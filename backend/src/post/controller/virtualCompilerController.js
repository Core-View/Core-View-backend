const pool = require('../../../config/databaseSet');
const {
  runCCode,
  runCppCode,
  runJavaCode,
  runPythonCode,
} = require('../service/virtualCompilerService');
const { authGetJWT } = require('../../../auth/jwtMiddle');

async function compileCode(req, res) {
  const { title, language, code, content } = req.body; // user_id 제거
  let postId = null;

  try {
    let output = '';
    let result = {};

    switch (language) {
      case 'c':
        result = await runCCode(code);
        output = result.output || '';
        break;
      case 'cpp':
        result = await runCppCode(code);
        output = result.output || '';
        break;
      case 'java':
        result = await runJavaCode(code);
        output = result.output || '';
        break;
      case 'python':
        result = await runPythonCode(code);
        output = result.output || '';
        break;
      default:
        let errorMessage = '';
        let otherLanguage = 'other';

        const connection = await pool.getConnection();
        const [insertResults] = await connection.execute(
          'INSERT INTO coreview.post (post_title, post_code, post_result, post_content, post_date, user_id, language) VALUES (?, ?, ?, ?, NOW(), ?, ?)',
          [title, code, errorMessage, content, req.userId, otherLanguage]
        );
        postId = insertResults.insertId;
        connection.release();

        res.send({
          postId,
          title,
          code,
          result: errorMessage,
          message: 'Post created successfully',
        });
        return;
    }

    const connection = await pool.getConnection();
    const [insertResults] = await connection.execute(
      'INSERT INTO coreview.post (post_title, post_code, post_result, post_content, post_date, user_id, language) VALUES (?, ?, ?, ?, NOW(), ?, ?)',
      [title, code, output, content, req.userId, language]
    );
    postId = insertResults.insertId;
    connection.release();

    res.send({
      postId,
      title,
      code,
      result: output,
      message: 'Post created successfully',
    });
  } catch (error) {
    const errorMessage = error.output || error.toString();

    try {
      const connection = await pool.getConnection();
      const [insertResults] = await connection.execute(
        'INSERT INTO coreview.post (post_title, post_code, post_result, post_content, post_date, user_id, language) VALUES (?, ?, ?, ?, NOW(), ?, ?)',
        [title, code, errorMessage, content, req.userId, language]
      );
      postId = insertResults.insertId;
      connection.release();

      res.send({
        postId,
        title,
        code,
        result: errorMessage,
        message: 'Post created with error',
      });
    } catch (err) {
      res.status(500).send({
        error: err.toString(),
        message: 'Failed to save post with error',
      });
    }
  }
}

async function updateCode(req, res) {
  const { postId, title, code, content, language } = req.body;

  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute(
      'UPDATE coreview.post SET post_title = ?, post_code = ?, post_content = ?, language = ? WHERE post_id = ?',
      [title, code, content, language, postId]
    );
    connection.release();

    if (results.affectedRows > 0) {
      res.send({ postId, title, code, language, message: '게시물이 성공적으로 업데이트되었습니다.' });
    } else {
      res.status(404).send({ message: '해당하는 게시물을 찾지 못했습니다.' });
    }
  } catch (error) {
    res.status(500).send({ error: error.toString(), message: '게시물 업데이트에 실패했습니다.' });
  }
}

async function deleteCode(req, res) {
  const postId = req.params.postId;

  try {
    const [results] = await pool.query(
      'DELETE FROM coreview.post WHERE post_id = ?',
      [postId]
    );

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
  deleteCode,
};
