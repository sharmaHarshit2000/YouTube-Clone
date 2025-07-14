import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

// Add a comment to a video
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { videoId } = req.params;

    if (!text || !videoId) {
      return res.status(400).json({ message: "Text and videoId are required" });
    }

    // Create new comment linked to video and author
    const comment = await Comment.create({
      text,
      video: videoId,
      author: req.user._id,
    });

    // Add comment reference to the video's comments array
    await Video.findByIdAndUpdate(videoId, {
      $push: { comments: comment._id },
    });

    // Populate author info for response
    const populatedComment = await comment.populate("author", "username _id");

    return res.status(201).json({
      message: "Comment added",
      comment: populatedComment,
    });
  } catch (err) {
    console.error("Error in addComment:", err);
    return res.status(500).json({
      message: "Failed to add comment",
      error: err.message,
    });
  }
};

// Get all comments for a specific video
export const getCommentsByVideo = async (req, res) => {
  try {
    const { videoId } = req.params;

    // Fetch comments sorted by newest first and populate author details
    const comments = await Comment.find({ video: videoId })
      .populate("author", "username profilePic")
      .sort({ createdAt: -1 });

    return res.json(comments);
  } catch (err) {
    console.error("Error in getCommentsByVideo:", err);
    return res.status(500).json({
      message: "Failed to fetch comments",
      error: err.message,
    });
  }
};

// Edit a specific comment
export const editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only allow the comment author to edit
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to edit this comment" });
    }

    // Update comment text if provided
    comment.text = text || comment.text;
    await comment.save();

    // Populate author info for response
    const populatedComment = await comment.populate("author", "username profilePic _id");

    return res.json({
      message: "Comment updated",
      comment: populatedComment,
    });
  } catch (err) {
    console.error("Error in editComment:", err);
    return res.status(500).json({
      message: "Failed to edit comment",
      error: err.message,
    });
  }
};

// Delete a specific comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId, videoId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only allow the comment author to delete
    if (comment.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this comment" });
    }

    // Remove comment ID reference from the video's comments array
    await Video.findByIdAndUpdate(videoId, {
      $pull: { comments: comment._id },
    });

    // Delete the comment document itself
    await comment.deleteOne();

    return res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error("Error in deleteComment:", err);
    return res.status(500).json({
      message: "Failed to delete comment",
      error: err.message,
    });
  }
};
