import express from "express";

import { deleteVideo, dislikeVideo, getAllVideos, getVideoById, likeVideo, updateVideo, uploadVideo } from "../controllers/VideoController.js";
import { protect } from "../middleware/authMiddleware.js";
import {uploadBoth} from "../middleware/multer.js"

const router = express.Router();

router.get("/", getAllVideos);
router.get("/:id", getVideoById);
router.post("/upload", protect, uploadBoth, uploadVideo);
router.put("/:id", protect, uploadBoth, updateVideo);
router.delete("/:id", protect, deleteVideo);
router.post("/:id/like", protect, likeVideo);
router.post("/:id/dislike", protect, dislikeVideo);

export default router;
