import Channel from "../models/Channel.js";
import Video from "../models/Video.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import {
  uploadChanelBannerToCloudinary,
  cloudinary,
} from "../config/cloudinary.js";
import { nanoid } from "nanoid";

export const createChannel = async (req, res) => {
  try {
    // Prevent user from creating multiple channels
    const existingChannel = await Channel.findOne({ owner: req.user._id });
    if (existingChannel) {
      return res.status(400).json({ message: "You already have a channel." });
    }

    let channelBanner = null;
    let bannerPublicId = null;

    // If banner file exists, upload to Cloudinary and save public ID for deletion later
    if (req.file) {
      try {
        const result = await uploadChanelBannerToCloudinary(req.file.buffer);
        channelBanner = result.secure_url;
        bannerPublicId = result.public_id;
      } catch (uploadErr) {
        console.error("Cloudinary Upload Error:", uploadErr);
        return res
          .status(500)
          .json({ message: "Failed to upload banner image" });
      }
    }

    // Create channel with unique nanoid as channelId
    const newChannel = new Channel({
      channelId: nanoid(12),
      channelName: req.body.channelName,
      description: req.body.description,
      channelBanner,
      bannerPublicId,
      owner: req.user._id,
    });

    const savedChannel = await newChannel.save();

    // Add newly created channel to user's channels array
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { channels: savedChannel._id } },
      { new: true }
    );

    return res.status(201).json(savedChannel);
  } catch (err) {
    console.error("Error in createChannel:", err);
    return res
      .status(500)
      .json({ error: err.message || "Failed to create channel" });
  }
};

export const getChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate("owner", "username profilePic")
      .lean();

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Calculate subscriber count based on subscribersList array length
    const subscriberCount = channel.subscribersList?.length || 0;

    // Fetch all videos belonging to this channel
    const videos = await Video.find({ channel: channel._id });

    res.json({
      channel: {
        ...channel,
        subscribers: subscriberCount,
        subscribersList: channel.subscribersList || [],
      },
      videos,
    });
  } catch (err) {
    console.error("Error in getChannel:", err.message);
    res.status(500).json({ error: "Error fetching channel" });
  }
};

export const updateChannel = async (req, res) => {
  try {
    const channelId = req.params.id;
    const userId = req.user._id;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Ensure only the owner can update their channel
    if (channel.owner.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this channel" });
    }

    const { channelName, description } = req.body;

    if (req.file) {
      // Delete existing banner from Cloudinary before uploading new one
      if (channel.bannerPublicId) {
        await cloudinary.uploader.destroy(channel.bannerPublicId);
      }

      const result = await uploadChanelBannerToCloudinary(req.file.buffer);
      channel.channelBanner = result.secure_url;
      channel.bannerPublicId = result.public_id;
    }

    if (channelName) channel.channelName = channelName;
    if (description) channel.description = description;

    await channel.save();
    res.status(200).json(channel);
  } catch (err) {
    console.error("Error updating channel:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteChannel = async (req, res) => {
  try {
    const channelId = req.params.id;
    const userId = req.user._id;

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    if (!channel.owner.equals(userId)) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this channel" });
    }

    // Fetch all videos to delete related data (comments, Cloudinary media)
    const videos = await Video.find({ channel: channel._id });
    const videoIds = videos.map((video) => video._id);

    // Delete all comments associated with channel's videos
    await Comment.deleteMany({ video: { $in: videoIds } });

    // Remove Cloudinary stored video files and thumbnails
    for (const video of videos) {
      try {
        if (video.videoPublicId) {
          await cloudinary.uploader.destroy(video.videoPublicId, {
            resource_type: "video",
          });
        }
        if (video.thumbnailPublicId) {
          await cloudinary.uploader.destroy(video.thumbnailPublicId);
        }
      } catch (err) {
        console.error("Cloudinary deletion error for video:", err.message);
      }
    }

    // Delete videos from DB
    await Video.deleteMany({ channel: channel._id });

    // Delete channel banner image from Cloudinary
    if (channel.bannerPublicId) {
      try {
        await cloudinary.uploader.destroy(channel.bannerPublicId);
      } catch (err) {
        console.error(
          "Failed to delete channel banner from Cloudinary:",
          err.message
        );
      }
    }

    // Delete channel document itself
    await channel.deleteOne();

    // Remove channel reference from user's channels array
    await User.findByIdAndUpdate(userId, {
      $pull: { channels: channel._id },
    });

    res.json({
      message: "Channel, its videos, banner, and comments deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting channel:", err);
    res.status(500).json({ error: err.message || "Failed to delete channel" });
  }
};

export const toggleSubscription = async (req, res) => {
  const userId = req.user._id;
  const channelId = req.params.id;

  try {
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Check if user is already subscribed to channel
    const alreadySubscribed = channel.subscribersList.includes(userId);

    // Toggle subscription status
    if (alreadySubscribed) {
      channel.subscribersList.pull(userId);
    } else {
      channel.subscribersList.push(userId);
    }

    // Update subscriber count for channel document
    channel.subscribers = channel.subscribersList.length;
    await channel.save();

    // Reflect subscription change in user's subscriptions array
    const user = await User.findById(userId);
    if (alreadySubscribed) {
      user.subscriptions.pull(channelId);
    } else {
      user.subscriptions.push(channelId);
    }
    await user.save();

    // Populate owner info for updated channel response
    const updatedChannel = await Channel.findById(channelId)
      .populate("owner", "username profilePic")
      .lean();

    res.status(200).json({
      _id: updatedChannel._id,
      channelName: updatedChannel.channelName,
      channelBanner: updatedChannel.channelBanner,
      subscribers: updatedChannel.subscribers,
      subscribersList: updatedChannel.subscribersList,
      owner: updatedChannel.owner,
      isMyChannel: updatedChannel.owner?._id === req.user._id,
    });
  } catch (err) {
    console.error("Error in toggleSubscription:", err);
    res
      .status(500)
      .json({ message: "Server error while toggling subscription" });
  }
};
