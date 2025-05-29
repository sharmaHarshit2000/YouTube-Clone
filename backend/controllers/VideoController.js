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

// Upload video
export const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  const userId = req.user._id;

  if (!req.files?.video?.[0] || !req.files?.thumbnail?.[0]) {
    return res.status(400).json({ error: "Video and thumbnail are required" });
  }

  const channel = await Channel.findOne({ owner: userId });
  if (!channel) {
    return res.status(400).json({ message: "Channel not found for the user" });
  }

  try {
    const videoResult = await uploadVideoToCloudinary(
      req.files.video[0].buffer
    );
    const thumbnailResult = await uploadThumbnailToCloudinary(
      req.files.thumbnail[0].buffer
    );

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

    channel.videos.push(newVideo._id);
    await channel.save();

    res.status(201).json({
      message: "Video uploaded successfully",
      video: newVideo,
    });
  } catch (err) {
    console.error("Video upload failed:", err);
    res.status(500).json({ error: "Video upload failed" });
  }
});

// Update Video
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

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

    if (req.files?.thumbnail?.[0]) {
      await cloudinary.uploader.destroy(video.thumbnailPublicId);

      const result = await streamUpload(req.files.thumbnail[0].buffer, {
        folder: "youtube-clone/thumbnails",
      });

      thumbnailUrl = result.secure_url;
      thumbnailPublicId = result.public_id;
    }

    video.title = title || video.title;
    video.description = description || video.description;
    video.category = category || video.category;
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

// Delete video
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

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

    // Delete all comments associated with this video
    await Comment.deleteMany({ video: video._id });

    // Delete the video document
    await video.deleteOne();

    // Remove video reference from channel.videos array
    await Channel.findByIdAndUpdate(video.channel, {
      $pull: { videos: video._id },
    });

    // Send response
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting video" });
  }
};

// Like video
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const userId = req.user._id.toString();

    if (video.likes.includes(userId)) {
      video.likes = video.likes.filter((id) => id.toString() !== userId);
    } else {
      video.dislikes = video.dislikes.filter((id) => id.toString() !== userId);
      video.likes.push(userId);
    }

    await video.save();

    const updatedVideo = await Video.findById(video._id)
      .populate("channel", "channelName channelBanner")
      .populate("uploader", "username");

    res.json(updatedVideo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to like video" });
  }
};

// Dislike video
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const userId = req.user._id.toString();

    if (video.dislikes.includes(userId)) {
      video.dislikes = video.dislikes.filter((id) => id.toString() !== userId);
    } else {
      video.likes = video.likes.filter((id) => id.toString() !== userId);
      video.dislikes.push(userId);
    }

    await video.save();

    const updatedVideo = await Video.findById(video._id)
      .populate("channel", "channelName channelBanner")
      .populate("uploader", "username");

    res.json(updatedVideo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to dislike video" });
  }
};

// Put video views id

export const incraseViews = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) {
    res.status(404);
    throw new Error("Video not found");
  }

  video.views += 1;
  await video.save();

  res.status(200).json(video);
});


export const searchVideos = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.status(400).json({ message: "Search term is required" });
  }

  // Case-insensitive partial match on title or description
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
