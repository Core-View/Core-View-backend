const express = require("express");
const router = express.Router();
const adminController = require("../../admin/controller/adminController");
const {authAdminJWT} = require('../../../auth/jwtMiddle')

router.post("/login", authAdminJWT, (req, res) => {
    res.status(200).send({success: true, message: "관리자 인증 성공"})
});

router.post("/check", authAdminJWT, (req, res) => {
    res.status(200).send({success: true, message: "Admin Check"})
});

module.exports = router;
