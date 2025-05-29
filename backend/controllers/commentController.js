import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

//Add commnet to the video

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const videoId = req.params.videoId;
    if (!text || !videoId) {
      return res.status(404).json({ message: "Text and videoId are required" });
    }

    const comment = await Comment.create({
      text,
      video: videoId,
      author: req.user._id,
    });

    await Video.findByIdAndUpdate(videoId, {
      $push: { comments: comment._id },
    });

    const populatedComment = await comment.populate("author", " username _id");

    res
      .status(201)
      .json({ message: "Comment added", comment: populatedComment });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add comment", err: err.message });
  }
};

export const getCommentsByVideo = async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const comments = await Comment.find({video: videoId})
    .populate("author", "username")
    .sort({createdAt: -1});

    res.json(comments);

  } catch (err) {
    res.
    status(500).json({message: "Failed to fetch comments", error: err.message})
  }
};
