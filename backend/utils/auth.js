const jwt = require("jsonwebtoken");
const User = require("../models/user");
const JWT_SECRET = process.env.JWT_SECRET;

async function generateTokenForUser(id) {
  const user = await User.findById(id);
  const payload = {
    _id: user._id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  };
  const token = jwt.sign(payload, JWT_SECRET);
  return token;
}

function validateToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { generateTokenForUser, validateToken };
