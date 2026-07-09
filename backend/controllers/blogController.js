const cloudinary = require("../config/cloudinary");
const fs = require("fs/promises");

const Blog = require("../models/blog");
const Comment = require("../models/comment");

exports.getAllBlogs = async function (req, res) {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    return res.json({
      blogs,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Couldn't fetch blogs",
    });
  }
};

exports.createNewBlog = async function (req, res) {
  const { title, content } = req.body;
  let uploadedFile;
  try {
    if (!title || !content)
      return res.status(400).json({
        message: "All fields are mandatory.",
      });
    if (!req.file) {
      return res.status(400).json({
        message: "Cover image is required.",
      });
    }
    uploadedFile = req.file.path;
    const result = await cloudinary.uploader.upload(uploadedFile, {
      folder: "blog-dock",
    });
    await Blog.create({
      content,
      title,
      coverImage: result.secure_url,
      coverImagePublicId: result.public_id,
      createdBy: req.user._id,
    });
    return res.status(201).json({
      message: "Blog created Succesfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  } finally {
    if (uploadedFile) {
      await fs.unlink(uploadedFile).catch(() => {});
    }
  }
};

exports.getBlogById = async function (req, res) {
  try {
    const id = req.params.id;
    const blog = await Blog.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { returnDocument: "after" },
    ).populate("createdBy", "fullName");
    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }
    const comments = await Comment.find({
      blogId: id,
    }).populate("createdBy");
    return res.json({
      blog,
      comments,
    });
  } catch (error) {
    return res.status(500).json({ message: "Couldn't fetch blog" });
  }
};

exports.handleDeleteBlog = async function (req, res) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }
    await cloudinary.uploader.destroy(blog.coverImagePublicId);
    await blog.deleteOne();

    return res.status(200).json({
      message: "Successfully deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Couldn't delete blog",
    });
  }
};
