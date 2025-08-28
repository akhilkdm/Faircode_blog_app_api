const authService = require("../services/auth.service");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      const err = new Error("All fields are required");
      err.statusCode = 400;
      throw err;
    }
    const userBody = { name, email, password };
    const user = await authService.createUser(userBody);

    res.status(201).json({
      message: "User created",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const err = new Error("All fields are required");
      err.statusCode = 400;
      throw err;
    }

    const { user, token } = await authService.login({ email, password });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Server error" });
  }
};

module.exports = { register, login };
