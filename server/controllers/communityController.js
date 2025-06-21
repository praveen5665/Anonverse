import Community from "../models/Community.js";
import cloudinary from "../config/cloudinary.js";

export const createCommunity = async (req, res) => {
  try {
    let { name, description } = req.body;
    name = name.trim();
    description = description.trim();
    let rules = [];

    if (req.body.rules) {
      try {
        rules = JSON.parse(req.body.rules);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid rules format",
        });
      }
    }

    const existingCommunity = await Community.findOne({ name });
    if (existingCommunity) {
      return res.status(400).json({
        success: false,
        message: "A community with this name already exists",
      });
    }

    let avatarUrl = "";
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "community_avatars",
        });
        avatarUrl = result.secure_url;
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload avatar",
          error: uploadError.message,
        });
      }
    }

    const community = new Community({
      name,
      description,
      rules,
      avatar: avatarUrl,
      creater: req.userId,
      moderators: [req.userId],
      members: [req.userId],
    });

    await community.save();

    res.status(201).json({
      success: true,
      data: community,
      message: "Community created successfully",
    });
  } catch (error) {
    console.error("Create community error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create community",
      error: error.message,
    });
  }
};

export const getCommunity = async (req, res) => {
  try {
    const { communityName } = req.params;
    const community = await Community.findOne({ name: communityName }).populate(
      "creater moderators members"
    );

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found",
      });
    }

    res.status(200).json({
      success: true,
      data: community,
    });
  } catch (error) {
    console.error("Get community error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve community",
      error: error.message,
    });
  }
};

export const updateCommunity = async (req, res) => {
  try {
    const { communityName } = req.params;
    const { name, description, rules } = req.body;

    const community = await Community.findOne({ name: communityName });

    if (!community) {
      return res
        .status(404)
        .json({ success: false, message: "Community not found" });
    }

    if (community.creater.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this community",
      });
    }

    let avatarUrl = community.avatar;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "community_avatars",
      });
      avatarUrl = result.secure_url;
    }

    community.name = name || community.name;
    community.description = description || community.description;
    community.rules = rules ? JSON.parse(rules) : community.rules;
    community.avatar = avatarUrl;

    await community.save();

    res.status(200).json({
      success: true,
      data: community,
      message: "Community updated successfully",
    });
  } catch (error) {
    console.error("Update community error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update community" });
  }
};

export const deleteCommunity = async (req, res) => {
  try {
    const { communityName } = req.params;

    const community = await Community.findOne({ name: communityName });

    if (!community) {
      return res
        .status(404)
        .json({ success: false, message: "Community not found" });
    }

    if (community.creater.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this community",
      });
    }

    await Community.deleteOne({ _id: community._id });

    res
      .status(200)
      .json({ success: true, message: "Community deleted successfully" });
  } catch (error) {
    console.error("Delete community error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete community" });
  }
};

export const joinCommunity = async (req, res) => {
  try {
    const { communityId } = req.body;

    const community = await Community.findById(communityId);
    if (!community) {
      return res
        .status(404)
        .json({ success: false, message: "Community not found" });
    }

    const userId = req.userId;
    const isMember = community.members.some(
      (memberId) => memberId.toString() === userId.toString()
    );
    if (isMember) {
      return res
        .status(400)
        .json({ success: false, message: "You are already a member" });
    }
    community.members.push(userId);
    await community.save();

    res.status(200).json({
      success: true,
      message: "Successfully joined the community",
    });
  } catch (error) {
    console.error("Join community error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to join community",
      error: error.message,
    });
  }
};
export const leaveCommunity = async (req, res) => {
  try {
    const { communityId } = req.body;

    const community = await Community.findById(communityId);
    if (!community) {
      return res
        .status(404)
        .json({ success: false, message: "Community not found" });
    }

    const userId = req.userId;
    const isMember = community.members.some(
      (memberId) => memberId.toString() === userId.toString()
    );
    if (!isMember) {
      return res.status(400).json({
        success: false,
        message: "You are not a member of this community",
      });
    }
    community.members = community.members.filter(
      (id) => id.toString() !== userId.toString()
    );
    await community.save();

    res.status(200).json({
      success: true,
      message: "Successfully left the community",
    });
  } catch (error) {
    console.error("Leave community error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to leave community",
      error: error.message,
    });
  }
};

export const isMember = async (req, res) => {
  try {
  
    const { communityId } = req.params;
    console.log("Community ID from params:", communityId);

    if (!communityId) {
      return res
        .status(400)
        .json({ success: false, message: "Community ID is required" });
    }

    const community = await Community.findById(communityId);
    if (!community) {
      return res
        .status(404)
        .json({ success: false, message: "Community not found" });
    }

    const userId = req.userId;
    const isMember = community.members.some(
      (memberId) => memberId.toString() === userId.toString()
    );

    return res.status(200).json({
      success: true,
      isMember,
      message: isMember ? "User is a member" : "User is not a member",
    });
  } catch (error) {
    console.error("Check membership error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check membership",
      error: error.message,
    });
  }
};
