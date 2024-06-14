const express = require('express');
const router = express.Router();
const { compileCode, updateCode, deleteCode } = require('../controllers/virtualCompilerController');

// POST request to compile code
router.post('/compile', compileCode);

// PUT request to update code
router.put('/update', updateCode);

// DELETE request to delete code
router.delete('/delete', deleteCode);

module.exports = router;
