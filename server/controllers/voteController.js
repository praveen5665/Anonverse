import Post from "../models/Post.js";

const handleVote = async (req, res) => {
  try {
    const { postId } = req.params;
    const { voteType } = req.body;
    const userId = req.userId; 
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (voteType !== null && !["up", "down"].includes(voteType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vote type",
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Remove user's previous votes
    post.upVotes = post.upVotes.filter((id) => id.toString() !== userId.toString());
    post.downVotes = post.downVotes.filter((id) => id.toString() !== userId.toString());

    // Add new vote if voteType is not null
    if (voteType !== null) {
      if (voteType === "up") {
        post.upVotes.push(userId);
      } else {
        post.downVotes.push(userId);
      }
    }

    await post.save();

    res.status(200).json({
      success: true,
      message: "Vote updated successfully",
      data: {
        upVotes: post.upVotes.length,
        downVotes: post.downVotes.length,
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

export default handleVote;
