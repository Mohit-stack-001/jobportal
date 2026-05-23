const express = require("express");
const {
  adminLogin,
  loginUser,
  registerUser,
} = require("../controllers/authcontroller");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin-login", adminLogin);

module.exports = router;
