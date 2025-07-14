import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

// Predefined categories for the video
const filters = ["Music", "Gaming", "News", "Sports", "Education", "Entertainment"];

const EditVideoForm = ({ video, onSubmit, videoUpdating }) => {
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [previewThumb, setPreviewThumb] = useState("");
  const [previewVideo, setPreviewVideo] = useState("");

  // Hook to navigate back
  const navigate = useNavigate(); 

  // Populate form fields when video prop changes
  useEffect(() => {
    if (video) {
      setTitle(video.title || "");
      setDescription(video.description || "");
      setCategory(video.category || "");
      setPreviewThumb(video.thumbnail?.url || "");
      setPreviewVideo(video.video?.url || "");
    }
  }, [video]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!category.trim()) {
      toast.error("Please select a category");
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    if (thumbnail) formData.append("thumbnail", thumbnail);
    if (videoFile) formData.append("video", videoFile);

    // Call parent submit handler
    onSubmit(formData);
  };

  // Remove selected thumbnail
  const removeThumbnail = () => {
    setThumbnail(null);
    setPreviewThumb("");
  };

  // Remove selected video file
  const removeVideoFile = () => {
    setVideoFile(null);
    setPreviewVideo("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-3xl mx-auto p-6 bg-white border rounded-2xl shadow-sm"
      encType="multipart/form-data"
    >
      {/* Title Input */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-800 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Description Input */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-800 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category Select */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-800 mb-1">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select Category --</option>
          {filters.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Thumbnail Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Replace Thumbnail</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setThumbnail(file);
            setPreviewThumb(URL.createObjectURL(file)); // Show preview
          }}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
        />
        {/* Thumbnail Preview */}
        {previewThumb && (
          <div className="relative w-48 mt-3 rounded-lg border shadow overflow-hidden">
            <img
              src={previewThumb}
              alt="Thumbnail Preview"
              className="w-full h-auto max-h-40 object-cover rounded"
            />
            <button
              type="button"
              onClick={removeThumbnail}
              title="Remove thumbnail"
              className="absolute top-0 right-0 bg-red-500 text-white px-2 py-0.5 text-xs rounded-bl hover:bg-red-600"
            >
              <IoClose />
            </button>
          </div>
        )}
      </div>

      {/* Video Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Replace Video</label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => {
            const file = e.target.files[0];
            setVideoFile(file);
            setPreviewVideo(URL.createObjectURL(file)); // Show preview
          }}
          className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
        />
        {/* Video Preview */}
        {previewVideo && (
          <div className="relative w-48 mt-3 rounded-lg border shadow overflow-hidden">
            <video
              className="w-full h-auto max-h-40 object-contain rounded"
              controls
              src={previewVideo}
            />
            <button
              type="button"
              onClick={removeVideoFile}
              title="Remove video"
              className="absolute top-0 right-0 bg-red-500 text-white px-2 py-0.5 text-xs rounded-bl hover:bg-red-600"
            >
              <IoClose />
            </button>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={videoUpdating}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200 disabled:opacity-50"
      >
        {videoUpdating ? "Updating..." : "Update Video"}
      </button>

      {/* Cancel Button - Navigates back */}
      <button
        type="button"
        onClick={() => navigate(-1)} // Go to previous route
        className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-400 transition duration-200"
      >
        Cancel
      </button>
    </form>
  );
};

export default EditVideoForm;
