import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "video/mp4",
    "video/quicktime",    
    "video/x-msvideo",   
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only JPEG, PNG images and MP4, MOV, AVI videos are allowed!"));
  }
};


export const uploadBoth = multer({ storage, fileFilter }).fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

export const uploadProfile = multer({ storage, fileFilter }).single("profile");

export const uploadBanner = multer({ storage, fileFilter }).single("banner");
