import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

export const createComment = async (req, res) => {
  const { postId, content, parentCommentId } = req.body;
  const userId = req.userId;

  try {
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }
    if (!content || !postId) {
      return res.status(400).json({
        success: false,
        message: "Content and postId are required",
      });
    }
    if (content.trim().length < 1 || content.length > 10000) {
      return res.status(400).json({
        success: false,
        message: "Comment content must be between 1 and 10000 characters",
      });
    }
    if (parentCommentId && !(await Comment.findById(parentCommentId))) {
      return res.status(404).json({
        success: false,
        message: "Parent comment not found",
      });
    }
    const newComment = new Comment({
      content,
      authorId: userId,
      post: postId,
      parentComment: parentCommentId || null,
    });
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    await newComment.save();
    post.comments.push(newComment._id);
    await post.save();
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message 
    });
  }
};


export const getComments = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comments = await Comment.find({ post: postId })
      .populate("authorId", "username")
      .lean(); 

    //  comment tree
    const buildCommentTree = (allComments, parentId = null) => {
      return allComments
        .filter(comment => {
          return (comment.parentComment?.toString() || null) === (parentId?.toString() || null);
        })
        .map(comment => {
          const children = buildCommentTree(allComments, comment._id);
          return {
            ...comment,
            children: children.length ? children : []
          };
        });
    };

    const commentTree = buildCommentTree(comments);

    return res.status(200).json({
      success: true,
      data: commentTree
    });

  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.userId;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }
    if (comment.authorId?.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this comment",
      });
    }
    comment.isDeleted = true;
    comment.content = "This comment has been deleted";
    await comment.save();
    res.status(204).json({
      success: true,
      message: "Comment deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const voteComment = async (req, res) => {
  const { commentId } = req.params;
  const { voteType } = req.body;
  const userId = req.userId;
  console.log(req);

  try {
    if (voteType !== null && !["up", "down"].includes(voteType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vote type",
      });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    comment.upVotes = comment.upVotes.filter(
      (id) => id.toString() !== userId.toString()
    );
    comment.downVotes = comment.downVotes.filter(
      (id) => id.toString() !== userId.toString()
    );
    if (voteType !== null) {
      if (voteType === "up") {
        comment.upVotes.push(userId);
      } else {
        comment.downVotes.push(userId);
      }
    }
    await comment.save();
    res.status(200).json({
      success: true,
      message: "Vote updated successfully",
      data: {
        upVotes: comment.upVotes.length,
        downVotes: comment.downVotes.length,
      },
    });
  } catch (error) {
    console.error("Vote handling error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to handle vote",
      error: error.message,
    });
  }
};

