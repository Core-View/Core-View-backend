const express = require("express");
const router = express.Router();
const adminController = require("../../admin/controller/adminController");

router.post("/login/:user_id", adminController.login);

module.exports = router;
