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
    const { channelName, description } = req.body;

    if (!channelName || !description) {
      return res.status(400).json({
        message: "Both channelName and description are required.",
      });
    }

    const existingChannel = await Channel.findOne({ owner: req.user._id });
    if (existingChannel) {
      return res.status(400).json({ message: "You already have a channel." });
    }

    let channelBanner = null;
    let bannerPublicId = null;

    if (req.file) {
      try {
        const result = await uploadChanelBannerToCloudinary(req.file.buffer);
        channelBanner = result.secure_url;
        bannerPublicId = result.public_id;
      } catch (uploadErr) {
        console.error("Cloudinary Upload Error", uploadErr);
        return res
          .status(500)
          .json({ message: "Failed to upload banner image" });
      }
    }

    const newChannel = new Channel({
      channelId: nanoid(12),
      channelName,
      description,
      channelBanner,
      bannerPublicId,
      owner: req.user._id,
    });

    const savedChannel = await newChannel.save();

    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { channels: savedChannel._id } },
      { new: true }
    );

    return res.status(201).json(savedChannel);
  } catch (err) {
    console.error("Error in createChannel", err);
    return res.status(500).json({
      message: "Failed to create channel",
      error: err.message,
    });
  }
};
