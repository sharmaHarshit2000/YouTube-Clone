import express from "express";

import { deleteVideo, getAllVideos, getVideoById, updateVideo, uploadVideo } from "../controllers/VideoController.js";
import { protect } from "../middleware/authMiddleware.js";
import {uploadBoth} from "../middleware/multer.js"

const router = express.Router();

router.get("/", getAllVideos);
router.get("/:id", getVideoById);
router.post("/upload", protect, uploadBoth, uploadVideo);
router.put("/:id", protect, uploadBoth, updateVideo);
router.delete("/:id", protect, deleteVideo);

export default router;
