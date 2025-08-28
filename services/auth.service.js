const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (userBody) => {
  try {
    const existing = await User.findOne({ email: userBody?.email });
    if (existing) {
      const err = new Error("Email already exists");
      err.statusCode = 409;
      throw err;
    }

    const hashed = await bcrypt.hash(userBody?.password, 10);
    const user = {
      name: userBody?.name,
      email: userBody?.email,
      password: hashed,
    };

    return await User.create(user);
  } catch (error) {
    const err = new Error(error.message || "Internal Server Error");
    err.statusCode = error.statusCode || 500;
    throw err;
  }
};

const login = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error("Invalid credentials");
      err.statusCode = 401;
      throw err;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      const err = new Error("Invalid credentials");
      err.statusCode = 401;
      throw err;
    }

    const token = jwt.sign(
      { sub: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
    return { user, token };
  } catch (error) {
    const err = new Error(error.message || "Internal Server Error");
    err.statusCode = error.statusCode || 500;
    throw err;
  }
};

module.exports = { createUser, login };
