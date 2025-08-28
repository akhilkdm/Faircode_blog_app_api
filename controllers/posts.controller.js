const postSevice = require("../services/posts.service");

const getMyPosts = async (req, res) => {
  try {
    const userId = req.user?._id;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const { posts, total } = await postSevice.getMyPosts(userId, page, limit);
    res.json({
      posts,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    console.log("error", err);
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Server error" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 3, q } = req.query;
    const { posts, total } = await postSevice.getAllPosts(page, limit);

    res.json({ posts, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Server error" });
  }
};

const getSinglePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await postSevice.getSinglePost(postId);
    res.status(200).json(post);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Server error" });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      const err = new Error("Title and content required");
      err.statusCode = 400;
      throw err;
    }

    const post = await postSevice.createBlog(userId, title, content);
    res.status(201).json(post);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Server error" });
  }
};

const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const user = req.user;

    const post = await postSevice.updatePost(
      req.params.id,
      user,
      title,
      content
    );
    res.json(post);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Server error" });
  }
};

const deletePost = async (req, res) => {
  try {
    await postSevice.deletePost(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
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
