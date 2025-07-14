import asyncHandler from "express-async-handler";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

import Video from "../models/Video.js";
import Channel from "../models/Channel.js";
import Comment from "../models/Comment.js";

import {
  uploadVideoToCloudinary,
  uploadThumbnailToCloudinary,
} from "../config/cloudinary.js";

// GET all videos with uploader and channel info, sorted by newest
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .sort({ createdAt: -1 })
      .populate("uploader", "username profilePic")
      .populate("channel", "channelName channelBanner");
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch videos" });
  }
};

// GET single video by ID and increment its views atomically
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Increment views count on each fetch
    video.views += 1;
    await video.save();

    // Populate uploader, channel, and comments with authors sorted newest first
    await video.populate("uploader", "username");
    await video.populate("channel", "channelName channelBanner subscribers subscribersList videos");
    await video.populate({
      path: "comments",
      populate: { path: "author", select: "username" },
      options: { sort: { createdAt: -1 } },
    });

    res.json(video);
  } catch (err) {
    res.status(500).json({ error: "Error fetching video" });
  }
};

// UPLOAD video with associated thumbnail and save references to DB
export const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  const userId = req.user._id;

  if (!req.files?.video?.[0] || !req.files?.thumbnail?.[0]) {
    return res
      .status(400)
      .json({ error: "Video and thumbnail files are required." });
  }

  const channel = await Channel.findOne({ owner: userId });
  if (!channel) {
    return res.status(404).json({ error: "Channel not found for the user." });
  }

  try {
    // Upload video and thumbnail to Cloudinary
    const videoResult = await uploadVideoToCloudinary(
      req.files.video[0].buffer
    );
    const thumbnailResult = await uploadThumbnailToCloudinary(
      req.files.thumbnail[0].buffer
    );

    // Create video document with returned Cloudinary URLs and metadata
    const newVideo = await Video.create({
      title,
      description,
      category,
      uploader: userId,
      channel: channel._id,
      videoUrl: videoResult.secure_url,
      videoPublicId: videoResult.public_id,
      thumbnailUrl: thumbnailResult.secure_url,
      thumbnailPublicId: thumbnailResult.public_id,
      duration: Math.floor(videoResult.duration),
    });

    // Add video reference to the channel's videos array
    channel.videos.push(newVideo._id);
    await channel.save();

    // Populate uploader and channel details before sending response
    const populatedVideo = await Video.findById(newVideo._id)
      .populate("uploader", "username")
      .populate("channel", "channelName channelBanner");

    res.status(201).json({
      message: "Video uploaded successfully",
      video: populatedVideo,
    });
  } catch (err) {
    console.error("Video upload failed:", err);
    res.status(500).json({ error: "Video upload failed" });
  }
});

// UPDATE video details and optionally replace video and/or thumbnail files
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Only uploader can update their video
    if (video.uploader.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this video" });
    }

    const { title, description, category } = req.body;
    let videoUrl = video.videoUrl;
    let videoPublicId = video.videoPublicId;
    let thumbnailUrl = video.thumbnailUrl;
    let thumbnailPublicId = video.thumbnailPublicId;

    // Helper to upload buffer stream to Cloudinary with specified options
    const streamUpload = (fileBuffer, options) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          options,
          (err, result) => {
            if (result) resolve(result);
            else reject(err);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    // If new video file provided, delete old video from Cloudinary and upload new one
    if (req.files?.video?.[0]) {
      await cloudinary.uploader.destroy(video.videoPublicId, {
        resource_type: "video",
      });
      const result = await streamUpload(req.files.video[0].buffer, {
        resource_type: "video",
        folder: "youtube-clone/videos",
      });
      videoUrl = result.secure_url;
      videoPublicId = result.public_id;
      video.duration = Math.floor(result.duration);
    }

    // If new thumbnail provided, delete old thumbnail and upload new one
    if (req.files?.thumbnail?.[0]) {
      await cloudinary.uploader.destroy(video.thumbnailPublicId);
      const result = await streamUpload(req.files.thumbnail[0].buffer, {
        folder: "youtube-clone/thumbnails",
      });
      thumbnailUrl = result.secure_url;
      thumbnailPublicId = result.public_id;
    }

    // Update video document fields
    video.title = title || video.title;
    video.description = description || video.description;
    video.category = category;
    video.videoUrl = videoUrl;
    video.videoPublicId = videoPublicId;
    video.thumbnailUrl = thumbnailUrl;
    video.thumbnailPublicId = thumbnailPublicId;

    const updatedVideo = await video.save();
    res.json(updatedVideo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating video" });
  }
};

// DELETE video and all associated data (Cloudinary files, comments, and channel references)
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Only uploader can delete their video
    if (video.uploader.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this video" });
    }

    // Delete video and thumbnail from Cloudinary
    await cloudinary.uploader.destroy(video.videoPublicId, {
      resource_type: "video",
    });
    await cloudinary.uploader.destroy(video.thumbnailPublicId);

    // Remove all comments related to the video
    await Comment.deleteMany({ video: video._id });

    // Delete video document
    await video.deleteOne();

    // Remove video reference from channel's videos array
    await Channel.findByIdAndUpdate(video.channel, {
      $pull: { videos: video._id },
    });

    res.json({ message: "Video and associated comments deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting video" });
  }
};

// Like video with toggle behavior and remove dislike if present
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const userId = req.user._id.toString();

    if (video.likes.includes(userId)) {
      // If already liked, remove like (toggle off)
      video.likes = video.likes.filter((id) => id.toString() !== userId);
    } else {
      // Add like and remove dislike if any
      video.dislikes = video.dislikes.filter((id) => id.toString() !== userId);
      video.likes.push(userId);
    }

    await video.save();

    // Return updated video with populated uploader and channel info
    const updatedVideo = await Video.findById(video._id)
      .populate("channel", "channelName channelBanner")
      .populate("uploader", "username");
    res.json(updatedVideo);
  } catch (err) {
    res.status(500).json({ error: "Failed to like video" });
  }
};

// Dislike video with toggle behavior and remove like if present
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const userId = req.user._id.toString();

    if (video.dislikes.includes(userId)) {
      // If already disliked, remove dislike (toggle off)
      video.dislikes = video.dislikes.filter((id) => id.toString() !== userId);
    } else {
      // Add dislike and remove like if any
      video.likes = video.likes.filter((id) => id.toString() !== userId);
      video.dislikes.push(userId);
    }

    await video.save();

    // Return updated video with populated uploader and channel info
    const updatedVideo = await Video.findById(video._id)
      .populate("channel", "channelName channelBanner")
      .populate("uploader", "username");
    res.json(updatedVideo);
  } catch (err) {
    res.status(500).json({ error: "Failed to dislike video" });
  }
};

// Search videos by partial title or description match, case-insensitive
export const searchVideos = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.status(400).json({ message: "Search term is required" });
  }

  const videos = await Video.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ],
  })
    .sort({ createdAt: -1 })
    .populate("uploader", "username")
    .populate("channel", "channelName channelBanner");

  res.status(200).json(videos);
});
