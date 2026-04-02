const followModel = require("../models/follow.model.js");
const userModel = require("../models/user.model.js");

async function followUser(req, res) {
  try {
    const currentUserId = req.user.id;
    const followUserId = req.params.userId;

    if (followUserId === currentUserId) {
      return res.status(400).json({
        message: "You connot follow yourself.",
      });
    }

    const isFollwingExist = await userModel.findById(followUserId);

    if (!isFollwingExist) {
      return res.status(404).json({
        message: "User not exits",
      });
    }

    const isFollowing = await followModel.findOne({
      follower: currentUserId,
      following: followUserId,
      status: "accepted",
    });

    if (isFollowing) {
      return res.status(400).json({
        message: "You already follow this user.",
        follow: isFollowing,
      });
    }

    const followRecord = await followModel.create({
      follower: currentUserId,
      following: followUserId,
      status: "pending",
    });

    res.json({
      message: "Follow request sent successfully",
      follow: followRecord,
    });
  } catch (error) {
    console.log("Error while follow user:" + error);
    res.status(500).json("server error");
  }
}

async function acceptFollowRequest(req, res) {
  try {
    const currentUserId = req.user.id;
    const requestId = req.params.requestId;

    const followRequest = await followModel.findOne({
      _id: requestId,
      following: currentUserId,
      status: "pending",
    });

    if (!followRequest) {
      return res.status(404).json({
        message: "Follow request not found",
      });
    }

    followRequest.status = "accepted";
    await followRequest.save();

    res.status(200).json({
      message: "Follow request accepted",
      follow: followRequest,
    });
  } catch (error) {
    console.log("Error while accepting request:", error);
    res.status(500).json("server error");
  }
}

async function rejectFollowRequest(req, res) {
  try {
    const currentUserId = req.user.id;
    const requestId = req.params.requestId;

    const followRequest = await followModel.findOne({
      _id: requestId,
      following: currentUserId,
      status: "pending",
    });

    if (!followRequest) {
      return res.status(404).json({
        message: "Follow request not found",
      });
    }

    followRequest.status = "rejected";
    await followRequest.save();

    res.status(200).json({
      message: "Follow request rejected",
    });
  } catch (error) {
    console.log("Error while rejecting request:", error);
    res.status(500).json("server error");
  }
}

async function unfollowUser(req, res) {
  try {
    const currentUserId = req.user.id;
    const followUserId = req.params.userId;
    u;
    if (followUserId === currentUserId) {
      return res.status(400).json({
        message: "You cannot unfollow yourself.",
      });
    }

    const isUserFollowing = await followModel.findOne({
      follower: currentUserId,
      following: followUserId,
      status: "accepted",
    });

    if (!isUserFollowing) {
      return res.status(400).json({
        message: "You are not following this user.",
      });
    }

    await followModel.findByIdAndDelete(isUserFollowing._id);

    res.status(200).json({
      message: "Unfollowed successfully",
    });
  } catch (error) {
    console.log("Error while unfollow user:", error);
    res.status(500).json("server error");
  }
}

async function getFollowRequests(req, res) {
  try {
    const currentUserId = req.user.id;

    const requests = await followModel
      .find({
        following: currentUserId,
        status: "pending",
      })
      .populate("follower", "username email");

    res.status(200).json({
      requests,
    });
  } catch (error) {
    console.log("Error fetching requests:", error);
    res.status(500).json("server error");
  }
}

module.exports = {
  followUser,
  unfollowUser,
  acceptFollowRequest,
  rejectFollowRequest,
  getFollowRequests,
};
