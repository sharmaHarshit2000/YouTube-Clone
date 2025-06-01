import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateChannel } from "../features/channel/channelSlice";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";

const EditChannelModal = ({ channel, onClose }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.channel);

  const [channelName, setChannelName] = useState(channel.channelName);
  const [description, setDescription] = useState(channel.description);
  const [banner, setBanner] = useState(null);
  const [preview, setPreview] = useState(channel.banner?.url || "");
  const [localError, setLocalError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBanner(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!channelName.trim()) {
      setLocalError("Channel name is required.");
      return;
    }

    const formData = new FormData();
    formData.append("channelName", channelName);
    formData.append("description", description);
    if (banner) {
      formData.append("banner", banner);
    }

    const resultAction = await dispatch(
      updateChannel({ id: channel._id, updateData: formData })
    );

    if (updateChannel.fulfilled.match(resultAction)) {
      toast.success("Channel updated successfully!");
      onClose();
    } else {
      toast.error("Failed to update channel.");
    }
  };

  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-40 flex items-center justify-center z-50 px-4">
      <div className="relative bg-white p-6 rounded-xl w-full max-w-md shadow-lg border border-gray-200">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl"
          onClick={onClose}
        >
          <IoClose />
        </button>

        <h2 className="text-2xl font-semibold mb-5 text-gray-800">Edit Channel</h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
          <input
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="Channel Name"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Channel Banner</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 rounded w-full h-32 object-cover border border-gray-200"
              />
            )}
          </div>

          {localError && (
            <p className="text-red-600 text-sm -mt-2">{localError}</p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditChannelModal;