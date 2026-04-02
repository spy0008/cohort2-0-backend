const express = require("express");
const authCheckUser = require("../middlewares/auth.middleware.js");
const {
  followUser,
  unfollowUser,
  acceptFollowRequest,
  rejectFollowRequest,
  getFollowRequests,
} = require("../controllers/user.controller");

const userRouter = express.Router();

/**
 * @route POST /api/users/follow/:userId
 * @description follow a user
 * @access Private
 */
userRouter.post("/follow/:userId", authCheckUser, followUser);

/**
 * @route delete /api/users/unfollow/:userId
 * @description unfollow a user
 * @access Private
 */
userRouter.delete("/unfollow/:userId", authCheckUser, unfollowUser);

/**
 * @route put /api/users/accept/:requestId
 * @description  accept request user
 * @access Private
 */
userRouter.put("/accept/:requestId", authCheckUser, acceptFollowRequest);

/**
 * @route put /api/users/reject/:requestId
 * @description  reject request user
 * @access Private
 */
userRouter.put("/reject/:requestId", authCheckUser, rejectFollowRequest);

/**
 * @route get /api/users/requests
 * @description  get all requests
 * @access Private
 */
userRouter.get("/requests", authCheckUser, getFollowRequests);
module.exports = userRouter;
