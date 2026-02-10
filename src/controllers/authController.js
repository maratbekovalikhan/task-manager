const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../config/jwt");

/* REGISTER */
exports.register = async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email.toLowerCase(); // 🔥 ВАЖНО
    const password = req.body.password;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user"
    });

    res.status(201).json({
      token: generateToken(user._id)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Register error" });
  }
};


/* LOGIN */
exports.login = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase(); // 🔥 ВАЖНО
    const password = req.body.password;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      token: generateToken(user._id)
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login error" });
  }
};
