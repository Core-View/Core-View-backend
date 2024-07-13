const pool = require('../../../config/databaseSet');
const {
  runCCode,
  runCppCode,
  runJavaCode,
  runPythonCode,
} = require('../service/virtualCompilerService');

async function compileCode(req, res) {
  const { title, language, code, content, user_id } = req.body;
  let postId = null; // postId를 초기화합니다.

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
        let errorMessage = ''; // 원하는 문구 result에 저장
        let otherLanguage = 'other'; // 컴파일 없이 저장될 언어 설정
        
        // MySQL에 데이터 삽입
        const connection = await pool.getConnection();
        const [insertResults, fields] = await connection.execute(
          'INSERT INTO coreview.post (post_title, post_code, post_result, post_content, post_date, user_id, language) VALUES (?, ?, ?, ?, NOW(), ?, ?)',
          [title, code, errorMessage, content, user_id, otherLanguage]
        );
        postId = insertResults.insertId; // postId를 설정합니다.
        connection.release();

        res.send({
          postId,
          title,
          code,
          result: errorMessage,
          message: 'Post created successfully',
        });
        return; // switch 문을 빠져나갑니다.
    }

    // MySQL에 데이터 삽입
    const connection = await pool.getConnection();
    const [insertResults, fields] = await connection.execute(
      'INSERT INTO coreview.post (post_title, post_code, post_result, post_content, post_date, user_id, language) VALUES (?, ?, ?, ?, NOW(), ?, ?)',
      [title, code, output, content, user_id, language]
    );
    postId = insertResults.insertId; // postId를 설정합니다.
    connection.release();

    res.send({
      postId,
      title,
      code,
      result: output,
      message: 'Post created successfully',
    });
  } catch (error) {
    // 만약 컴파일 에러가 발생하면 여기서 처리
    const errorMessage = error.output || error.toString();

    try {
      // MySQL에 에러 메시지를 저장
      const connection = await pool.getConnection();
      const [insertResults, fields] = await connection.execute(
        'INSERT INTO coreview.post (post_title, post_code, post_result, post_content, post_date, user_id, language) VALUES (?, ?, ?, ?, NOW(), ?, ?)',
        [title, code, errorMessage, content, user_id, language]
      );
      postId = insertResults.insertId; // postId를 설정합니다.
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
    // MySQL 데이터베이스에서 데이터 수정
    const connection = await pool.getConnection();
    const [results, fields] = await connection.execute(
      'UPDATE coreview.post SET post_title = ?, post_code = ?, post_content = ?, language = ? WHERE post_id = ?',
      [title, code, content, language, postId]
    );
    connection.release();

    // 수정된 데이터의 ID를 응답으로 전송
    if (results.affectedRows > 0) {
      res.send({ postId, title, code, language ,message: '게시물이 성공적으로 업데이트되었습니다.' });
    } else {
      res.status(404).send({ message: '해당하는 게시물을 찾지 못했습니다.' });
    }
  } catch (error) {
    res
      .status(500)
      .send({ error: error.toString(), message: '게시물 업데이트에 실패했습니다.' });
  }
}


async function deleteCode(req, res) {
  const postId = req.params.postId;

  try {
    // MySQL에서 데이터 삭제
    const [results, fields] = await pool.query(
      'DELETE FROM coreview.post WHERE post_id = ?',
      [postId]
    );

    // 삭제된 데이터의 ID를 전송
    if (results.affectedRows > 0) {
      res.send({ message: 'Post deleted successfully' });
    } else {
      res.status(404).send({ message: 'Post not found' });
    }
  } catch (error) {
    res
      .status(500)
      .send({ error: error.toString(), message: 'Failed to delete post' });
  }
}

module.exports = {
  compileCode,
  updateCode,
  deleteCode,
};	