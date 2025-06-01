# 🎬 YouTube Clone - Backend

This is the **backend** for a full-stack YouTube Clone built with **Node.js**, **Express**, **MongoDB**, and **Cloudinary**. It provides a RESTful API for the frontend, supporting authentication, video uploads, comments, channel management, and more.


---

## ⚙️ Tech Stack

- **Node.js** & **Express** – REST API
- **MongoDB** & **Mongoose** – NoSQL Database
- **Cloudinary** – Media storage (videos, images)
- **Multer** & **Streamifier** – File uploads
- **JWT** – Secure authentication
- **bcrypt** – Password hashing
- **dotenv** – Environment variables

---

## 📁 Folder Structure

```
backend/
├── config/
│   ├── cloudinary.js        # Cloudinary config
│   └── db.js                # MongoDB connection
│
├── controllers/
│   ├── authController.js
│   ├── channelController.js
│   ├── commentController.js
│   └── videoController.js
│
├── middleware/
│   ├── authMiddleware.js    # JWT auth logic
│   ├── errorMiddleware.js   # Global error handler
│   └── multer.js            # File handling
│
├── models/
│   ├── User.js
│   ├── Channel.js
│   ├── Video.js
│   └── Comment.js
│
├── routes/
│   ├── authRoutes.js
│   ├── channelRoutes.js
│   ├── commentRoutes.js
│   └── videoRoutes.js
│
├── .env
├── server.js                # App entry point
└── package.json
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sharmaHarshit2000/YouTube-Clone.git
cd YouTube-Clone/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the `backend/` directory and add your configuration (MongoDB URI, JWT secret, Cloudinary keys, etc.).

### 4. Start the server

```bash
npm run start
```

Server will run at [http://localhost:5000](http://localhost:5000)

---

## 🔌 API Routes

### 🔐 Auth Routes – `/api/auth`

| Method | Endpoint    | Description                                      |
|--------|-------------|--------------------------------------------------|
| POST   | /register   | Register a new user (with profile image upload)  |
| POST   | /login      | Login a user                                     |
| GET    | /me         | Get logged-in user info (protected)              |

### 📺 Video Routes – `/api/videos`

| Method | Endpoint      | Description                                         |
|--------|---------------|-----------------------------------------------------|
| GET    | /search       | Search videos                                       |
| GET    | /             | Get all videos                                      |
| GET    | /user         | Get videos uploaded by logged-in user               |
| GET    | /:id          | Get a single video by ID                            |
| POST   | /upload       | Upload a new video (with thumbnail & video)         |
| PUT    | /:id          | Update a video (protected, with new files)          |
| DELETE | /:id          | Delete a video (protected)                          |
| POST   | /:id/like     | Like or unlike a video                              |
| POST   | /:id/dislike  | Dislike or remove dislike                           |
| PATCH  | /:id/views    | Increase view count                                 |

### 💬 Comment Routes – `/api/videos/:videoId/comments`

| Method | Endpoint                                   | Description                    |
|--------|--------------------------------------------|--------------------------------|
| POST   | /api/videos/:videoId/comments              | Add a comment (protected)      |
| GET    | /api/videos/:videoId/comments              | Get comments on a video        |
| PUT    | /api/videos/:videoId/comments/:commentId   | Edit a comment (protected)     |
| DELETE | /api/videos/:videoId/comments/:commentId   | Delete a comment (protected)   |

> Comments are nested under videos, using `mergeParams: true`.

### 📡 Channel Routes – `/api/channels`

| Method | Endpoint         | Description                              |
|--------|------------------|------------------------------------------|
| POST   | /                | Create a channel (with banner)           |
| GET    | /:id             | Get a channel by ID                      |
| PUT    | /:id             | Update channel info (with banner)        |
| DELETE | /:id             | Delete a channel                         |
| POST   | /:id/subscribe   | Toggle subscription to a channel         |

---

## ✅ Scripts

| Command         | Description                |
|-----------------|---------------------------|
| npm run start   | Start server with nodemon |

---

## 📦 Dependencies

| Package                | Description                        |
|------------------------|------------------------------------|
| express                | Web framework                      |
| mongoose               | MongoDB ORM                        |
| cloudinary             | Media storage                      |
| multer                 | File handling                      |
| streamifier            | Buffer to stream (for Cloudinary)  |
| bcrypt                 | Password hashing                   |
| jsonwebtoken           | JWT authentication                 |
| express-async-handler  | Clean async/await error handling   |
| cors                   | Cross-origin requests              |
| dotenv                 | Env file support                   |
| nanoid                 | Unique ID generation               |

---

## 🧪 Development Tools

- **Nodemon** – Dev server auto-reloading
- **ES Modules** – `"type": "module"` enabled

---

## 👤 Author

Harshit Sharma  
GitHub: [@sharmaHarshit2000](https://github.com/sharmaHarshit2000)

