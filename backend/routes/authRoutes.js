const express = require("express");
const router = express.Router();
const { login, me, createUser } = require("../controllers/authController");
const { protect, requireOwner } = require("../middleware/auth");

router.post("/login", login);
router.get("/me", protect, me);
router.post("/users", protect, requireOwner, createUser);

module.exports = router;
