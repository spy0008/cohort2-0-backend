const express = require("express");
const {
  createPost,
  getPosts,
  getSinglePostDetails,
  likePost,
  getFeedPosts,
  unlikePost,
} = require("../controllers/post.controller");
const multer = require("multer");
const authCheckUser = require("../middlewares/auth.middleware");

const postRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @description create a post
 * @routes /api/post/create
 */
postRouter.post("/create", authCheckUser, upload.single("imgUrl"), createPost);

/**
 * @description get posts
 * @routes /api/post
 */
postRouter.get("/", authCheckUser, getPosts);

/**
 * @description get a post
 * @routes /api/post/details/:postid
 */
postRouter.get("/details/:postId", authCheckUser, getSinglePostDetails);

/**
 * @description like a post
 * @routes /api/post/like/:postId
 */
postRouter.post("/like/:postId", authCheckUser, likePost);

/**
 * @description unlike a post
 * @routes /api/post/unlike/:postId
 */
postRouter.post("/unlike/:postId", authCheckUser, unlikePost);

/**
 * @description get feed posts
 * @routes /api/post/feed
 */
postRouter.get("/feed", authCheckUser, getFeedPosts);

module.exports = postRouter;
