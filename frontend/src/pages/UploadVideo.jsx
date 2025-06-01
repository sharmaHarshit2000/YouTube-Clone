import { useState } from "react";
import { useDispatch } from "react-redux";
import { uploadVideo } from "../features/video/videoSlice";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";

const UploadVideo = () => {
  const { id: channelId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(""); // ✅ Added category state
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
  };

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile || !thumbnail || !category) {
      toast.error("All fields including video, thumbnail, and category are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category); // ✅ Add category
    formData.append("video", videoFile);
    formData.append("thumbnail", thumbnail);

    setLoading(true);

    try {
      await dispatch(uploadVideo(formData)).unwrap();
      toast.success("Video uploaded successfully!");
      navigate(`/channel/${channelId}`);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Video upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Upload New Video</h2>

      {loading && <Loader />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-3 rounded"
          required
        />

        {/* ✅ Category Selector */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-3 rounded"
          required
        >
          <option value="">Select Category</option>
          <option value="Music">Music</option>
          <option value="Gaming">Gaming</option>
          <option value="Education">Education</option>
          <option value="News">News</option>
          <option value="Sports">Sports</option>
          <option value="Entertainment">Entertainment</option>
        </select>

        <div className="space-y-2">
          <label className="block font-medium">Upload Video File</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Upload Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            required
            className="w-full"
          />

          {thumbnailPreview && (
            <div className="relative w-40 mt-2">
              <img
                src={thumbnailPreview}
                alt="Thumbnail Preview"
                className="rounded shadow border"
              />
              <button
                type="button"
                onClick={removeThumbnail}
                className="absolute top-0 right-0 bg-red-500 text-white px-1 rounded-bl hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default UploadVideo;