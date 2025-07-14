import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateChannel } from "../features/channel/channelSlice";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";

const EditChannelModal = ({ channel, onClose }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.channel);

  // Local state for channel form
  const [channelName, setChannelName] = useState(channel.channelName);
  const [description, setDescription] = useState(channel.description);
  const [banner, setBanner] = useState(null);
  const [preview, setPreview] = useState(channel.banner?.url || "");
  const [localError, setLocalError] = useState("");

  // Handle banner image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBanner(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!channelName.trim()) {
      setLocalError("Channel name is required.");
      return;
    }

    const formData = new FormData();
    formData.append("channelName", channelName);
    formData.append("description", description);
    if (banner) formData.append("banner", banner);

    // Dispatch the updateChannel action
    const resultAction = await dispatch(
      updateChannel({ id: channel._id, updateData: formData })
    );

    // Handle success or failure
    if (updateChannel.fulfilled.match(resultAction)) {
      toast.success("Channel updated successfully!");
      onClose();
    } else {
      toast.error("Failed to update channel.");
    }
  };

  // Update local error if backend error changes
  useEffect(() => {
    if (error) setLocalError(error);
  }, [error]);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6">
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-20 rounded-2xl">
            <p className="text-lg font-semibold text-gray-700 animate-pulse tracking-wide">
              &gt; Updating the Channel...
            </p>
          </div>
        )}

        {/* Close Modal Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl z-30"
          onClick={onClose}
          disabled={loading}
        >
          <IoClose />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Channel</h2>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-5"
        >
          {/* Channel Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Channel Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your channel name"
              required
            />
          </div>

          {/* Channel Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Tell viewers about your channel"
            />
          </div>

          {/* Banner Upload with Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Channel Banner
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm text-gray-700 file:bg-blue-600 file:text-white file:px-3 file:py-1.5 file:rounded-md file:cursor-pointer file:mr-3"
            />
            {preview && (
              <img
                src={preview}
                alt="Banner Preview"
                className="mt-3 w-full h-40 object-cover rounded border"
              />
            )}
          </div>

          {/* Display any validation or API error */}
          {localError && (
            <p className="text-red-600 text-sm">{localError}</p>
          )}

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition ${loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
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
