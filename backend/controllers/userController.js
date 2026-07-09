const bcrypt = require("bcrypt");
const { generateTokenForUser } = require("../utils/auth");
const User = require("../models/user");
const Blog = require("../models/blog");

exports.getCurrentUser = function (req, res) {
  return res.json({
    user: req.user
      ? {
          _id: req.user._id,
          fullName: req.user.fullName,
          email: req.user.email,
          role: req.user.role,
        }
      : null,
  });
};

exports.handleUserSignup = async function (req, res) {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName) throw new Error("Full Name is required");
    if (!email) throw new Error("Email is required");
    if (!password || password.length < 5)
      throw new Error("Password is required and min. length must be 5");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });
    const token = await generateTokenForUser(user._id);
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({
        message: "Signup successful!",
        user: {
          _id: user._id,
          fullName: user.fullName,
          role: user.role,
        },
      });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

exports.handleUserLogin = async function (req, res) {
  const { email, password } = req.body;

  try {
    if (!email || !password) throw new Error("Email and Password are required");
    const user = await User.findOne({ email });
    if (!user) throw new Error("User does not exist");

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) throw new Error("Invalid Password");

    //Token
    const token = await generateTokenForUser(user._id);

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .json({
        message: "Login successful!",
        user: {
          _id: user._id,
          fullName: user.fullName,
          role: user.role,
        },
      });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

exports.handleUserLogout = function (req, res) {
  return res
    .clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .json({
      message: "Logged out successfully!",
    });
};

exports.getUserBlogs = async function (req, res) {
  try {
    const blogs = await Blog.find({ createdBy: req.user._id });
    return res.json({
      blogs,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Couldn't fetch blogs.",
    });
  }
};
