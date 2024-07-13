// routes/resetPasswordRoutes.js

const express = require('express');
const router = express.Router();
const resetPasswordController = require('../../signin/controller/resetPasswordController');

router.post('/forgot-password', resetPasswordController.forgotPassword);
router.post('/email-check', resetPasswordController.emailCheck);
router.post('/reset-password', resetPasswordController.resetPassword);

module.exports = router;
