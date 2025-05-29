import express from "express";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

//Routes
import authRoutes from "./routes/authRoutes.js"
import channelRoutes from "./routes/channelRoutes.js"
import videoRoutes from "./routes/videoRoutes.js"
dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//API Routes
app.use("/api/auth", authRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/videos", channelRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
