# 🎬 YouTube Clone - Frontend

Welcome to the **frontend** of a YouTube Clone built with **React**, **Redux Toolkit**, **Tailwind CSS**, and **Vite**. This project connects to an Express + MongoDB backend, providing full YouTube-like features: authentication, video uploads, channel management, likes, comments, and search.

👉 **GitHub Repo:** [YouTube-Clone](https://github.com/sharmaHarshit2000/YouTube-Clone.git)

---

## ✨ Features

- 🔐 JWT-based Authentication (Login/Register)
- 📺 Watch and Upload Videos
- 👤 Channel Management (Create, Edit, View)
- 📥 Like/Dislike Videos
- 💬 Comment System
- 🔍 Search & Filter Videos
- 📱 Fully Responsive UI
- ⚛️ Global State via Redux Toolkit
- ⚡ Fast bundling with Vite
- 🎨 Styled with Tailwind CSS

---

## 📁 Project Structure

```
yotube-clone/
├── backend/
├── frontend/
│   ├── node_modules/
│   ├── public/
│   │   └── react.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ChannelInfo.jsx
│   │   │   ├── CommentSection.jsx
│   │   │   ├── CommentsToggle.jsx
│   │   │   ├── CreateChannelForm.jsx
│   │   │   ├── DescriptionToggle.jsx
│   │   │   ├── EditChannelModal.jsx
│   │   │   ├── EditVideoForm.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── LikeDislikeButtons.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── SuggestedVideos.jsx
│   │   │   ├── VideoCard.jsx
│   │   │   ├── VideoCardWithActions.jsx
│   │   │   └── VideoPlayer.jsx
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── authAPI.js
│   │   │   │   └── authSlice.js
│   │   │   ├── channel/
│   │   │   │   ├── channelAPI.js
│   │   │   │   └── channelSlice.js
│   │   │   ├── comments/
│   │   │   │   ├── commentAPI.js
│   │   │   │   └── commentSlice.js
│   │   │   ├── search/
│   │   │   │   ├── searchAPI.js
│   │   │   │   └── searchSlice.js
│   │   │   ├── ui/
│   │   │   │   └── uiSlice.js
│   │   │   └── video/
│   │   │       ├── videoAPI.js
│   │   │       └── videoSlice.js
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── ChannelPage.jsx
│   │   │   ├── CreateChannel.jsx
│   │   │   ├── EditVideoPage.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── UploadVideo.jsx
│   │   │   └── VideoWatchPage.jsx
│   │   ├── router/
│   │   │   └── AppRouter.jsx
│   │   ├── utils/
│   │   │   ├── axiosInstance.js
│   │   │   └── formatDuration.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── store.js
│   ├── .gitignore
│   ├── eslint.config.js
│   └── index.html
```

---

## 🛠️ Installation & Usage

### 1. Clone the Repository

```bash
git clone https://github.com/sharmaHarshit2000/YouTube-Clone.git
cd YouTube-Clone/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

Open your browser and visit: [http://localhost:5173](http://localhost:5173)

### 4. Build for Production

```bash
npm run build
```

---

## 🙋‍♂️ Author

**Harshit Sharma**  
GitHub: [@sharmaHarshit2000](https://github.com/sharmaHarshit2000)

---
