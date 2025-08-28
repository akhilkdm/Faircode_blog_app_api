const express = require("express");
const router = express.Router();
const Post = require("../models/posts.model");
const authenticate = require("../middleware/auth");
const {
  getMyPosts,
  getAllPosts,
  getSinglePost,
  createBlog,
  updatePost,
  deletePost,
} = require("../controllers/posts.controller");

// Get posts created by the logged-in user
router.get("/my-posts", authenticate, getMyPosts);

// Public: list posts
router.get("/", getAllPosts);

// Public: single post by slug
router.get("/:id", getSinglePost);

// Create post (authenticated users)
router.post("/", authenticate, createBlog);

// Update post (author or admin)
router.put("/:id", authenticate, updatePost);

// Delete post (author or admin)
router.delete("/:id", authenticate, deletePost);

module.exports = router;
