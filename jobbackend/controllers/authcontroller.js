const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const { fallbackUsers } = require("../utils/dataStore");

const isDbConnected = () => mongoose.connection.readyState === 1;

const createToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || "user",
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

const sendAuth = (res, user, message) => {
  const safeUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role || "user",
  };

  res.json({
    success: true,
    message,
    token: createToken(safeUser),
    user: safeUser,
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isDbConnected()) {
      const exists = fallbackUsers.find((user) => user.email === email);

      if (exists) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = {
        _id: `user-${Date.now()}`,
        name,
        email,
        password: await bcrypt.hash(password, 10),
        role: "user",
      };

      fallbackUsers.push(user);
      return sendAuth(res, user, "Signup successful");
    }

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: "user",
    });

    sendAuth(res, user, "Signup successful");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!isDbConnected()) {
      const user = fallbackUsers.find((item) => item.email === email);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid user credentials" });
      }

      return sendAuth(res, user, "Login successful");
    }

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid user credentials" });
    }

    sendAuth(res, user, "Login successful");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== "admin@gmail.com" || password !== "admin123") {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    sendAuth(
      res,
      {
        _id: "admin-1",
        name: "Admin",
        email,
        role: "admin",
      },
      "Admin login successful"
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  adminLogin,
  loginUser,
  registerUser,
};
