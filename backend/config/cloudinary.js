import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import streamifier from "streamifier";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload video to /youtube-clone/videos
 const uploadVideoToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: "video", folder: "youtube-clone/videos" },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    ).end(fileBuffer);
  });
};

// Upload thumbnail to /youtube-clone/thumbnails
 const uploadThumbnailToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: "youtube-clone/thumbnails" },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    ).end(fileBuffer);
  });
};

// Upload user profile picture to /youtube-clone/profiles
 const uploadUserProfileToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "youtube-clone/profiles" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// Upload channel banner to /youtube-clone/channel-banners
 const uploadChanelBannerToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "youtube-clone/channel-banners" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    ).end(fileBuffer);
  });
};


export {
  cloudinary,
  uploadVideoToCloudinary,
  uploadThumbnailToCloudinary,
  uploadUserProfileToCloudinary,
  uploadChanelBannerToCloudinary
};