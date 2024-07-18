const express = require('express');
const router = express.Router();
const { compileCode, updateCode, deleteCode } = require('../../post/controller/virtualCompilerController');
const { authGetJWT } = require('../../../auth/jwtMiddle');

// POST request to compile code
router.post('/compile', authGetJWT, compileCode);

// PUT request to update code
router.put('/update', authGetJWT, updateCode);

// DELETE request to delete code
router.delete('/delete/:postId', authGetJWT, deleteCode);

module.exports = router;
