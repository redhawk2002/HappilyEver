const express = require("express");
const {
  register,
  login,
  pendingList,
  available,
  freeSession,
  bookSlot,
  markCompleteSlot,
} = require("../controller/user");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/pendingList").get(isAuthenticated, pendingList);
router.route("/available").post(isAuthenticated, available);
router.route("/freeSession").get(isAuthenticated, freeSession);
router.route("/bookSlot").post(isAuthenticated, bookSlot);
router.route("/removeSlot").post(isAuthenticated, markCompleteSlot);
module.exports = router;
