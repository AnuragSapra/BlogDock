const Comment = require("../models/comment");

exports.handleCreateComment = async function (req, res) {
  const { blogId, content } = req.body;
  if (!blogId || !content?.trim()) {
    return res.status(400).json({
      message: "Comment content is required.",
    });
  }
  const comment = await Comment.create({
    blogId,
    content,
    createdBy: req.user._id,
  });
  await comment.populate("createdBy", "fullName");
  return res.status(201).json(comment);
};
