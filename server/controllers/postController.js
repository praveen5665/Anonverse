import Post from "../models/Post.js";
import cloudinary from "../config/cloudinary.js";
import upload from "../middleware/upload.js";
import Community from "../models/Community.js";
import mongoose from "mongoose";

export const createPost = async(req, res) => {
    try {
        const { title, content, community} = req.body;
        
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
        if(req.file) {
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
                    error: error.message || "Unknown upload error"
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
            error: error.message || "Unknown server error"
        });
    }
}

export const getPosts = async(req, res) => {
    try {
        const { communityId } = req.query;
        const filter = communityId ? { community: communityId } : {};
        const posts = await Post.find(filter).populate("authorId", "username").populate("community", "name");
        
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
}

export const getPost = async(req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id).populate("authorId", "username").populate("community", "name");
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
}

export const deletePost = async(req, res) => {  
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
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
        await Post.findByIdAndDelete(id);
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
}


