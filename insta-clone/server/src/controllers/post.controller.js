const postModel = require("../models/post.model.js");
const likeModel = require("../models/like.model.js");
const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

const imageKit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function createPost(req, res) {
  try {
    const { caption } = req.body;
    const { buffer, originalname } = req.file;

    const file = await imageKit.files.upload({
      file: await toFile(Buffer.from(buffer), "file"),
      fileName: originalname,
      folder: "insta-clone",
    });

    const post = await postModel.create({
      caption,
      imgUrl: file.url,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Post Created successfully!!!",
      post,
    });
  } catch (error) {
    console.log("Creating post Error:" + error);
    res.status(500).json("server error");
  }
}

async function getPosts(req, res) {
  try {
    const userId = req.user.id;

    const posts = await postModel.find({
      user: userId,
    });

    if (!posts) {
      return res.status(404).json({
        success: false,
        message: "No Post found for User",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post get successfully",
      posts,
    });
  } catch (error) {
    console.log("getting post Error:" + error);
    res.status(500).json("server error");
  }
}

async function getSinglePostDetails(req, res) {
  try {
    const postId = req.params.postId;

    const post = await postModel.findById(postId);

    if (!post) {
      return res.statsu(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const isValidPost = post.user.toString() === req.user.id;

    if (!isValidPost) {
      return res.status(403).json({
        success: false,
        message: "Forbiden Content",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post Fetched Successfully!!!",
      post,
    });
  } catch (error) {
    console.log("getting single post Error:" + error);
    res.status(500).json("server error");
  }
}

async function likePost(req, res) {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    const post = await postModel.findById(postId);

    if (!post) {
      return res.statsu(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const like = await likeModel.create({
      post: postId,
      user: userId,
    });

    res.status(201).json({
      success: true,
      message: "Post like successfully!!!",
      like,
    });
  } catch (error) {
    console.log("Error while like a post:" + error);
    res.status(500).json("server error");
  }
}

async function unlikePost(req, res) {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const isLiked = await likeModel.findOne({
      post: postId,
      user: userId,
    });

    if (!isLiked) {
      return res.status(400).json({
        success: false,
        message: "you did not like this post!!!",
      });
    }

    await likeModel.findOneAndDelete({
      _id: isLiked._id,
    });

    res.status(200).json({
      success: true,
      message: "Post unliked successfully!!!",
    });
  } catch (error) {
    console.log("Error while unlike a post:" + error);
    res.status(500).json("server error");
  }
}

async function getFeedPosts(req, res) {
  try {
    const user = req.user;

    const posts = await Promise.all(
      (await postModel.find().populate("user").sort({ _id: -1 }).lean()).map(
        async (post) => {
          const isLiked = await likeModel.findOne({
            user: user.id,
            post: post._id,
          });

          post.isLiked = !!isLiked;

          return post;
        },
      ),
    );

    if (!posts) {
      return res.status(404).json({
        success: false,
        message: "Feed post not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "get All Feed post successfully",
      posts,
    });
  } catch (error) {
    console.log("getting feed posts Error:" + error);
  }
}

module.exports = {
  createPost,
  getPosts,
  getSinglePostDetails,
  likePost,
  getFeedPosts,
  unlikePost,
};
