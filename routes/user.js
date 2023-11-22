const express = require("express");
const { register } = require("../controller/user");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");
router.route("/register").post(register);
module.exports = router;
