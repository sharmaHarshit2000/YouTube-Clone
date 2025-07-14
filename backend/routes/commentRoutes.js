import express from "express";
import {
  addComment,
  deleteComment,
  editComment,
  getCommentsByVideo,
} from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router({ mergeParams: true });

// Routes for /api/videos/:videoId/comments
router.post("/", protect, addComment);
router.get("/", getCommentsByVideo);
router.put("/:commentId", protect, editComment);
router.delete("/:commentId", protect, deleteComment);

export default router;
