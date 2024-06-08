const express = require('express');
const userController = require('../controllers/mypageController');
const router = express.Router();

router.get('/:user_id', userController.getUser.bind(userController));

module.exports = router;
