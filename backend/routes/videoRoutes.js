import express from "express";

import {
  deleteVideo,
  dislikeVideo,
  getAllVideos,
  getVideoById,
  getVideosByLoggedInUser,
  incraseViews,
  likeVideo,
  searchVideos,
  updateVideo,
  uploadVideo,
} from "../controllers/videoController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadBoth } from "../middleware/multer.js";
import commentRoutes from "./commetRoutes.js"

const router = express.Router();

router.use("/:videoId/comments", commentRoutes);

router.get("/search", searchVideos);
router.get("/", getAllVideos);
router.get("/:id", getVideoById);
router.get("/user", protect, getVideosByLoggedInUser);
router.post("/upload", protect, uploadBoth, uploadVideo);
router.put("/:id", protect, uploadBoth, updateVideo);
router.delete("/:id", protect, deleteVideo);
router.post("/:id/like", protect, likeVideo);
router.post("/:id/dislike", protect, dislikeVideo);
router.patch("/:id/views", incraseViews);

export default router;
