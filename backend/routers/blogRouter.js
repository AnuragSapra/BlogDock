const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");

const {
  createNewBlog,
  handleDeleteBlog,
  getBlogById,
  getAllBlogs,
} = require("../controllers/blogController");

const {
  onlyGrantAccessTo,
  ensureAuthenticated,
} = require("../middlewares/auth");

//GET
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);

//POST
router.post(
  "/create",
  ensureAuthenticated,
  upload.single("coverImage"),
  createNewBlog,
);

//DELETE
router.delete(
  "/delete/:id",
  ensureAuthenticated,
  onlyGrantAccessTo("Admin"),
  handleDeleteBlog,
);

module.exports = router;
