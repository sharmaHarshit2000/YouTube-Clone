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

// Edit a comment
export const editComment = async (req, res) => {
    try{
        const {text} = req.body;
        const {commentId} = req.params;

        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({message: "Comment not found"});

        if (comment.author.toString() !== req.user._id.toString()) {
            return res
            .status(403)
            .json({message: "Unauthorized to edit this comment"})
        }
        comment.text = text || comment.text;

        await comment.save();

        const populatedComment = await comment.populate("author", "username _id");

        res.json({message: "comment updated", comment: populatedComment})
    } catch(err){
        res
        .status(500)
        .json({message: "Failed to edit comment", error: err.message})
    }
}

export const deleteComment = async (req, res) => {
    try{
        const {commentId, videoId} = req.params;

        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({message: "Comment not found"});

        if(comment.author.toString() !== req.user._id.toString()) {
            return res
            .status(403).json({message: "Unauthorized to delete this comment"});
        }

        await Video.findByIdAndUpdate(videoId, {
            $pull: {comments: comment._id}
        })

        await comment.deleteOne();

        res.json({message: "Comment deleted"});

    } catch(err){
        res.status(500).json({message: "Failed to delete comment", error: err.message})
    }
}