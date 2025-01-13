const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const admin = require("../config/firebase");
const JWT_SECRET = process.env.JWT_SECRET;

// Register
const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email, and password are required." });
    }

    
    const allowedRoles = ["user", "buyer","seller"];
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role provided." });
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    
    const firebaseUser = await admin.auth().createUser({
      email,
      password,
    });

   

  
    const newUser = new User({
      firebaseUid: firebaseUser.uid,
      username,
      email,
      password,
      role: role || "user",
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "User registered", token });
  } 
  catch (error) 
  {
    res.status(500).json({ error: error.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    await admin.auth().generatePasswordResetLink(email);
    res.status(200).json({ message: "Password reset link sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports=
{register,login,forgotPassword};