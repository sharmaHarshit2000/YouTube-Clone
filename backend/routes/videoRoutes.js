import express from "express";

import { getAllVideos, getVideoById } from "../controllers/VideoController.js";


const router = express.Router();

router.get("/", getAllVideos);
router.get("/:id", getVideoById)

export default router 