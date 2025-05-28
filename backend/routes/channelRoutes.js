import express from "express";
import { createChannel , deleteChannel, getChannel, updateChannel} from "../controllers/channelController.js";

import {protect} from "../middleware/authMiddleware.js";
import {uploadBanner} from "../middleware/multer.js";

const router = express.Router();

router.post("/", protect, uploadBanner, createChannel);
router.get("/:id", getChannel);
router.put("/:id", protect, uploadBanner, updateChannel);
router.delete("/:id", protect, deleteChannel)

export default router;
