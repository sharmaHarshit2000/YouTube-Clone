import express from "express";
import { createChannel } from "../controllers/channelController.js";

import {protect} from "../middleware/authMiddleware.js";
import {uploadBanner} from "../middleware/multer.js";

const router = express.Router();

router.post("/", protect, uploadBanner, createChannel);

export default router;
