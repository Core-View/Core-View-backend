const express = require('express');
const userController = require('../controllers/mypageController');
const { authenticateSession } = require('../middleware/authmiddleware');
const router = express.Router();

router.get('/:username', authenticateSession, userController.getUser.bind(userController));

module.exports = router;