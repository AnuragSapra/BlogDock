const express = require("express");
const router = express.Router();
const { handleCreateComment } = require("../controllers/commentController");
const { ensureAuthenticated } = require("../middlewares/auth");

router.post("/create", ensureAuthenticated, handleCreateComment);

module.exports = router;
