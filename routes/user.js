const express = require("express");
const {
  register,
  login,
  pendingList,
  available,
} = require("../controller/user");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/pendingList").get(isAuthenticated, pendingList);
router.route("/available").post(isAuthenticated, available);
module.exports = router;
