const Post = require("../models/posts.model");

const getMyPosts = async (userId, pageNo, limit) => {
  try {
    const query = { author: userId, isDeleted: false };

    const page = parseInt(pageNo) || 1;

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find(query).skip(skip).limit(limit).populate("author"),
      Post.countDocuments(query),
    ]);

    return { posts, total };
  } catch (error) {
    const err = new Error(error.message || "Internal Server Error");
    err.statusCode = error.statusCode || 500;
    throw err;
  }
};

const getAllPosts = async (page, limit) => {
  try {
    const filter = { isDeleted: false };

    // if (q) {
    //   filter.title = new RegExp(q, "i");
    // }

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("author", "name email");

    const total = await Post.countDocuments(filter);

    return { posts, total };
  } catch (error) {
    const err = new Error(error.message || "Internal Server Error");
    err.statusCode = error.statusCode || 500;
    throw err;
  }
};

const getSinglePost = async (postId) => {
  try {
    const post = await Post.findById(postId).populate("author", "name email");
    if (!post) {
      const err = new Error("Post not found");
      err.statusCode = 404;
      throw err;
    }
    return post;
  } catch (error) {
    const err = new Error(error.message || "Internal Server Error");
    err.statusCode = error.statusCode || 500;
    throw err;
  }
};

const createBlog = async (userId, title, content) => {
  try {
    const post = await Post.create({ title, content, author: userId });
    return post;
  } catch (error) {
    const err = new Error(error.message || "Internal Server Error");
    err.statusCode = error.statusCode || 500;
    throw err;
  }
};

const updatePost = async (postId, user, title, content) => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const err = new Error("Post not found");
      err.statusCode = 404;
      throw err;
    }

    // only author or admin
    if (!post.author.equals(user._id) && user.role !== "admin") {
      const err = new Error("Forbidden");
      err.statusCode = 403;
      throw err;
    }

    if (title) post.title = title;
    if (content) post.content = content;

    return await post.save();
  } catch (error) {
    const err = new Error(error.message || "Internal Server Error");
    err.statusCode = error.statusCode || 500;
    throw err;
  }
};

const deletePost = async (postId) => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const err = new Error("Post not found");
      err.statusCode = 404;
      throw err;
    }

    if (!post.author.equals(req.user._id) && req.user.role !== "admin") {
      const err = new Error("Forbidden");
      err.statusCode = 403;
      throw err;
    }

    post.isDeleted = true;
    await post.save();
    return post;
  } catch (error) {
    const err = new Error(error.message || "Internal Server Error");
    err.statusCode = error.statusCode || 500;
    throw err;
  }
};

module.exports = {
  getMyPosts,
  getAllPosts,
  getSinglePost,
  createBlog,
  updatePost,
  deletePost,
};
