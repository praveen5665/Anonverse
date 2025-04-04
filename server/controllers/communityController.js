import Community from "../models/Community.js";
import cloudinary from "../config/cloudinary.js";


export const createCommunity = async (req, res) => {
    try {
        const { name, description, rules, avatar } = req.body;

        const existingCommunity = await Community.findOne({ name });
        if (existingCommunity) {
            return res.status(400).json({
                success: false,
                message: "A community with this name already exists",
            });
        }

        let avatarUrl = "";
        if(req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "community_avatars",
            });
            avatarUrl = result.secure_url;
        }

        // Create new community
        const community = new Community({
            name,
            description,
            rules: rules || [],
            avatar: avatarUrl,
            creater: req.user.id,
            moderators: [req.user.id],
            members: [req.user.id],
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
        const community = await Community.findOne({ name : communityName }).populate("creater moderators members");

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
        const { name, description, rules, avatar } = req.body;
        const { id } = req.params;

       
        const community = await Community.findById(id);
        if (!community) {
            return res.status(404).json({
                success: false,
                message: "Community not found",
            });
        }

        const isAuthorized = community.creater.equals(req.user.id) ||
            community.moderators.some(mod => mod.equals(req.user.id));

        if (!isAuthorized) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this community",
            });
        }
        let avatarUrl = community.avatar;

        if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "community_avatars",
        });
        avatarUrl = result.secure_url;
        }
        if (name) community.name = name;
        if (description) community.description = description;
        if (rules) community.rules = rules;
        if (avatar) community.avatar = avatarUrl; 

        community.updatedAt = Date.now();
        await community.save();

        res.status(200).json({
            success: true,
            data: community,
            message: "Community updated successfully",
        });

    } catch (error) {
        console.error("Update community error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update community",
            error: error.message,
        });
    }
};


export const deleteCommunity = async (req, res) => {
    try {
        const { id } = req.params;

        const community = await Community.findById(id);
        if (!community) {
            return res.status(404).json({
                success: false,
                message: "Community not found",
            });
        }

        if (!community.creater.equals(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this community",
            });
        }

        await Community.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Community deleted successfully",
        });

    } catch (error) {
        console.error("Delete community error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete community",
            error: error.message,
        });
    }
};
