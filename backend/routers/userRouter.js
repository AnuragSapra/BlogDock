const express = require("express");
const router = express.Router();

const {
  handleUserLogin,
  handleUserSignup,
  handleUserLogout,
  getUserBlogs,
  getCurrentUser,
} = require("../controllers/userController");
const { ensureAuthenticated } = require("../middlewares/auth");

//GET
router.get("/me", getCurrentUser);
router.get("/blogs", ensureAuthenticated, getUserBlogs);
router.get("/logout", handleUserLogout);

//POST
router.post("/login", handleUserLogin);
router.post("/signup", handleUserSignup);

module.exports = router;
