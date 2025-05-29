import fs from "fs";
import asyncHandler from "express-async handler";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

import Video from "../models/Video.js";
import Channel from "../models/Channel.js";
import Comment from "../models/Comment.js";

import {
  uploadVideoToCloudinary,
  uploadThumbnailToCloudinary,
} from "../config/cloudinary.js";

// GET all vidoes

export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find({})
      .sort({ createdAt: -1 })
      .populate("uploader", "username")
      .populate("channel", "channelName channelBanner");
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch videos" });
  }
};

// GET single video by Id (with comments and uploader)
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate("uploader", "username")
      .populate("channel", "channelName channelBanner")
      .populate({
        path: "comments",
        populate: { path: "author", select: "username" },
        options: { sort: { createdAt: -1 } },
      });

    if (!video) return res.status(404).json({ message: "Video not found" });
    res.json({ video });
  } catch (err) {
    res.status(500).json({ error: "Error fetching video" });
  }
};

