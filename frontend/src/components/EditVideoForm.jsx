import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
const filters = ["Music", "Gaming", "News", "Sports", "Education", "Entertainment"];

const EditVideoForm = ({ video, onSubmit, videoUpdating }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  useEffect(() => {
    if (video) {
      setTitle(video.title || "");
      setDescription(video.description || "");
      setCategory(video.category || "");
    }
  }, [video]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    if (thumbnail) formData.append("thumbnail", thumbnail);
    if (videoFile) formData.append("video", videoFile);

    onSubmit(formData);
  };

  const removeThumbnail = () => setThumbnail(null);
  const removeVideoFile = () => setVideoFile(null);

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto p-4 border rounded-lg shadow" encType="multipart/form-data">
      <div>
        <label className="block mb-1 font-semibold">Title</label>
        <input
          className="w-full border px-3 py-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Description</label>
        <textarea
          className="w-full border px-3 py-2 rounded"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold">Category <span className="text-red-500">*</span></label>
        <select
          className="w-full border px-3 py-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">-- Select Category --</option>
          {filters.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-semibold">Replace Thumbnail</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files[0])}
        />
        {thumbnail && (
          <div className="relative w-40 mt-2">
            <img src={URL.createObjectURL(thumbnail)} alt="Preview" className="rounded" />
            <button
              type="button"
              className="absolute top-0 right-0 text-white bg-black rounded-full px-1"
              onClick={removeThumbnail}
            >
            <IoClose />
            </button>
          </div>
        )}
      </div>

      <div>
        <label className="block mb-1 font-semibold">Replace Video</label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files[0])}
        />
        {videoFile && (
          <div className="relative mt-2">
            <video className="w-full max-w-sm rounded" controls src={URL.createObjectURL(videoFile)} />
            <button
              type="button"
              className="absolute top-2 right-2 text-white bg-black rounded-full px-2"
              onClick={removeVideoFile}
            >
              <IoClose />
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={videoUpdating}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {videoUpdating ? "Updating..." : "Update Video"}
      </button>
    </form>
  );
};

export default EditVideoForm;