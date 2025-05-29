import express from "express";

import {
  addComment,
  getCommentsByVideo,
} from "../controllers/commentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router({mergeParams:true});

router.post("/", protect, addComment);
router.get("/", getCommentsByVideo)

export default router;