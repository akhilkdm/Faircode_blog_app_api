const express = require("express");
const { register, login } = require("../controllers/auth.controller");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// Register
router.post("/register", register);

// Login
router.post("/login", login);

module.exports = router;
