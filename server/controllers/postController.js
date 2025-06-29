import Post from "../models/Post.js";
import cloudinary from "../config/cloudinary.js";
import Community from "../models/Community.js";
import mongoose from "mongoose";

export const createPost = async (req, res) => {
  try {
    const { title, content, community } = req.body;

    if (!title?.trim() || !content?.trim() || !community?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title, content, and community are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(community)) {
      return res.status(400).json({
        success: false,
        message: "Invalid community ID format",
      });
    }

    // Check if the community exists and the user is a member of it
    const communityExists = await Community.findById(community);
    if (!communityExists) {
      return res.status(404).json({
        success: false,
        message: "Community not found",
      });
    }
    const isMember = communityExists.members.includes(req.userId);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not a member of this community",
      });
    }

    const authorId = req.userId;
    let imageUrl = "";
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "post_images",
        });
        imageUrl = result.secure_url;
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({
          success: false,
          message: "Image upload failed",
          error: error.message || "Unknown upload error",
        });
      }
    }
    const post = new Post({
      title,
      content,
      community,
      authorId,
      image: imageUrl,
    });
    await post.save();

    res.status(200).json({
      success: true,
      data: post,
      message: "Post created successfully",
    });
  } catch (error) {
    console.error("Create post error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: error.message || "Unknown server error",
    });
  }
};

export const getPosts = async (req, res) => {
  try {
    console.log("Get posts request params:", req.params);
    const communityId = req.params.communityId;
    console.log("Community ID:", communityId);
    const filter = communityId ? { community: communityId } : {};
    const posts = await Post.find(filter)
      .populate("authorId", "username")
      .populate("community", "name");

    res.status(200).json({
      success: true,
      data: posts,
      message: "Posts fetched successfully",
    });
  } catch (error) {
    console.error("Get posts error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
};

export const getPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId)
      .populate("authorId", "username")
      .populate("community", "name");
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    res.status(200).json({
      success: true,
      data: post,
      message: "Post fetched successfully",
    });
  } catch (error) {
    console.error("Get post error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch post",
      error: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    if (post.authorId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post",
      });
    }
    await Post.findByIdAndDelete(postId);
    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete post",
      error: error.message,
    });
  }
};

export const getFilteredPosts = async (req, res) => {
  try {
    const { timeFilter = "all", sortFilter = "hot", communityId, author, authorId } = req.query;
    let query = {};

    // Add community filter if provided
    if (communityId) {
      query.community = new mongoose.Types.ObjectId(communityId);
    }

    // Add author filter if provided
    if (authorId) {
      query.authorId = new mongoose.Types.ObjectId(authorId);
    } else if (author) {
      const user = await mongoose.model('User').findOne({ username: author });
      if (user) {
        query.authorId = user._id;
      } else {
        // No such user, return empty
        return res.status(200).json({ success: true, data: [] });
      }
    }

    // Time-based filtering with proper date handling
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    switch (timeFilter) {
      case "today":
        query.createdAt = { $gte: startOfDay };
        break;
      case "week":
        const startOfWeek = new Date(startOfDay);
        startOfWeek.setDate(startOfDay.getDate() - 7);
        query.createdAt = { $gte: startOfWeek };
        break;
      case "month":
        const startOfMonth = new Date(startOfDay);
        startOfMonth.setMonth(startOfDay.getMonth() - 1);
        query.createdAt = { $gte: startOfMonth };
        break;
      case "all":
      default:
        break;
    }

    const posts = await Post.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "authorId",
        },
      },
      {
        $lookup: {
          from: "communities",
          localField: "community",
          foreignField: "_id",
          as: "community",
        },
      },
      {
        $addFields: {
          voteScore: {
            $subtract: [{ $size: "$upVotes" }, { $size: "$downVotes" }],
          },
          engagementScore: {
            $add: [
              { $size: "$upVotes" },
              { $multiply: [{ $size: "$comments" }, 2] },
            ],
          },
        },
      },
      {
        $sort:
          sortFilter === "new"
            ? { createdAt: -1 }
            : sortFilter === "top"
            ? { voteScore: -1 }
            : { engagementScore: -1 }, // hot
      },
      { $unwind: "$authorId" },
      { $unwind: "$community" },
      {
        $project: {
          _id: 1,
          title: 1,
          content: 1,
          image: 1,
          createdAt: 1,
          upVotes: 1,
          downVotes: 1,
          comments: 1,
          "authorId._id": 1,
          "authorId.username": 1,
          "community._id": 1,
          "community.name": 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Get filtered posts error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
};
