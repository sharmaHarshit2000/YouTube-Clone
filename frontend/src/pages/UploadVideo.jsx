import { useState } from "react";
import { useDispatch } from "react-redux";
import { uploadVideo } from "../features/video/videoSlice";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UploadVideo = () => {
  const { id: channelId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Set thumbnail preview URL for selected file
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (file) setThumbnailPreview(URL.createObjectURL(file));
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
  };

  // Set video preview URL for selected file
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);
    if (file) setVideoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!videoFile || !thumbnail || !category) {
      toast.error("All fields including video, thumbnail, and category are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("video", videoFile);
    formData.append("thumbnail", thumbnail);

    setLoading(true);

    try {
      // Dispatch Redux action to upload video
      const uploadedVideo = await dispatch(uploadVideo(formData)).unwrap();
      toast.success("Video uploaded successfully!");

      // Navigate to channel page after successful upload
      const newChannelId = uploadedVideo?.channel?._id || channelId;
      navigate(`/channel/${newChannelId}`);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Video upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate(-1); // Go back to previous page

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm p-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mb-4 shadow-md" />
          <p className="text-blue-700 text-lg font-semibold animate-pulse text-center">
            Uploading video, please wait...
          </p>
        </div>
      )}

      <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded mt-8 relative z-10">
        <h2 className="text-2xl font-bold mb-6 text-center">Upload New Video</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Title<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter video title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
            <textarea
              placeholder="Write something about your video..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          </div>

          <div className="bg-gray-50 p-4 border rounded-lg">
            <label className="block text-sm font-semibold mb-2 text-gray-800">
              Upload Video File <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              required
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
            {videoPreview && (
              <div className="relative w-48 mt-3">
                <video
                  src={videoPreview}
                  controls
                  className="rounded shadow border w-full h-auto max-h-40 object-cover"
                />
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 border rounded-lg">
            <label className="block text-sm font-semibold mb-2 text-gray-800">
              Upload Thumbnail <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              required
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
            />
            {thumbnailPreview && (
              <div className="relative w-48 mt-3">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                  className="rounded shadow border w-full h-auto max-h-40 object-cover"
                />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute top-0 right-0 bg-red-500 text-white px-2 py-0.5 text-xs rounded-bl hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 bg-gray-300 text-gray-800 font-semibold py-3 rounded-md hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UploadVideo;
