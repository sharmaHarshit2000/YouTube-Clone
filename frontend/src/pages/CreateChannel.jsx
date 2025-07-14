import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createChannel, clearChannelState } from '../features/channel/channelSlice';
import { fetchUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateChannelForm = () => {
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [channelBanner, setChannelBanner] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { currentChannel, loading, error } = useSelector((state) => state.channel);
  const [isCreating, setIsCreating] = useState(false);

  const hasChannel = user?.channels?.length > 0;

  // Redirect if user already has a channel
  useEffect(() => {
    if (hasChannel) {
      navigate(`/channel/${user.channels[0]._id}`, { replace: true });
    }
  }, [hasChannel, user?.channels, navigate]);

  // Generate preview image URL from uploaded file
  useEffect(() => {
    if (!channelBanner) {
      setPreviewBanner(null);
      return;
    }
    const objectUrl = URL.createObjectURL(channelBanner);
    setPreviewBanner(objectUrl);

    // Revoke object URL to avoid memory leaks
    return () => URL.revokeObjectURL(objectUrl);
  }, [channelBanner]);

  // Clear channel-related state when unmounting
  useEffect(() => {
    return () => {
      dispatch(clearChannelState());
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    const formData = new FormData();
    formData.append('channelName', channelName);
    formData.append('description', description);
    if (channelBanner) formData.append('banner', channelBanner);

    try {
      const createdChannel = await dispatch(createChannel(formData)).unwrap();
      await dispatch(fetchUser()).unwrap();

      toast.success('Channel created successfully!');
      navigate(`/channel/${createdChannel._id}`, { replace: true });
    } catch (err) {
      toast.error('Failed to create channel.');
    } finally {
      setIsCreating(false);
    }
  };

  // Prevent rendering if channel already exists
  if (hasChannel || currentChannel?._id) return null;

  return (
    <div className="relative">
      {(loading || isCreating) && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm p-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mb-4 shadow-md" />
          <p className="text-blue-700 text-lg font-semibold animate-pulse text-center">
            Creating your channel, please wait...
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-6 max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Create Your Channel</h2>

        <div className="flex flex-col gap-1">
          <label htmlFor="channelName" className="text-sm font-medium text-gray-700">
            Channel Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="channelName"
            id="channelName"
            placeholder="e.g. Tech Explorer"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            required
            className="w-full border px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm font-medium text-gray-700">
            Channel Description
          </label>
          <textarea
            id="description"
            placeholder="Tell us about your channel..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-4 py-2 rounded-md outline-none resize-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="banner" className="text-sm font-medium text-gray-700">
            Channel Banner
          </label>
          <label className="inline-block w-fit bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition">
            Browse Banner
            <input
              type="file"
              id="banner"
              name="banner"
              accept="image/*"
              onChange={(e) => setChannelBanner(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>

        {previewBanner && (
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-700 mb-1">Banner Preview:</p>
            <img
              src={previewBanner}
              alt="Channel Banner Preview"
              className="w-full h-36 object-cover rounded-md border"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading || isCreating}
          className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-md text-lg font-medium hover:opacity-90 transition ${loading || isCreating ? 'opacity-60 cursor-not-allowed' : ''
            }`}
        >
          {loading || isCreating ? 'Creating...' : 'Create Channel'}
        </button>

        {error && (
          <p className="text-red-500 text-sm text-center mt-2">{error}</p>
        )}
      </form>
    </div>
  );
};

export default CreateChannelForm;
