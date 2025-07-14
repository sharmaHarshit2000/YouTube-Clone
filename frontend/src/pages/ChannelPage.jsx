import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { HiPencilAlt, HiTrash, HiPlusCircle, HiVideoCamera } from "react-icons/hi";
import { MdSubscriptions } from "react-icons/md";

import {
  clearChannelState,
  deleteChannel,
  getChannel,
} from "../features/channel/channelSlice";

import VideoCardWithActions from "../components/VideoCardWithActions";
import EditChannelModal from "../components/EditChannelModal";
import Loader from "../components/Loader";

const ChannelPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { currentChannel, loading, error, videos } = useSelector((state) => state.channel);

  // Check if the logged-in user owns the current channel
  const isOwner = useMemo(() => {
    return user?.channels?.some((ch) => ch._id === id);
  }, [user, id]);

  // Fetch channel data
  useEffect(() => {
    if (!id || isDeleting || currentChannel?._id === id) return;
    if (!isOwner) return;
    dispatch(getChannel(id));
  }, [dispatch, id, isOwner, currentChannel, isDeleting]);

  // Handle delete
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this channel? This action cannot be undone."
    );
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await dispatch(deleteChannel(currentChannel._id)).unwrap();
      toast.success("Channel deleted successfully!");
      setDeleted(true);
      dispatch(clearChannelState());
      navigate("/", { replace: true });
    } catch (err) {
      toast.error("Failed to delete channel.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Redirects and error states
  if (deleted || !user) return <Navigate to="/" replace />;
  if (loading) return <Loader />;
  if (error === "404") return <Navigate to="/create-channel" replace />;
  if (error)
    return (
      <div className="text-center py-10">
        <p className="text-red-600 font-semibold text-lg">Error: {error}</p>
      </div>
    );
  if (!currentChannel)
    return (
      <div className="text-center py-10">
        <p className="text-gray-600 text-lg">Channel not found.</p>
      </div>
    );
  if (!isOwner)
    return (
      <div className="text-center py-10">
        <p className="text-red-500 font-semibold text-lg">
          You are not authorized to view this channel.
        </p>
      </div>
    );




  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Banner */}
      <div className="relative h-64 w-full mb-8 rounded-2xl overflow-hidden shadow-xl">
        {currentChannel.channelBanner ? (
          <>
            <img
              src={currentChannel.channelBanner}
              alt="Channel Banner"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600" />
        )}

        <div className="absolute bottom-6 left-6 right-6 text-white z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold drop-shadow-lg">
                {currentChannel.channelName}
              </h1>
              <p className="text-lg mt-2 max-w-2xl line-clamp-2">
                {currentChannel.description}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
              <MdSubscriptions className="h-6 w-6 text-yellow-400" />
              <span className="ml-1 font-semibold">
                {(currentChannel?.subscribers ?? 0).toLocaleString()} subscriber
                {(currentChannel?.subscribers ?? 0) !== 1 ? "s" : ""}


              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setShowModal(true)}
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md"
        >
          <HiPencilAlt className="h-5 w-5" />
          Edit Channel
        </button>

        <button
          onClick={() => navigate(`/upload-video/${currentChannel._id}`)}
          disabled={loading}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md"
        >
          <HiPlusCircle className="h-5 w-5" />
          Upload Video
        </button>

        <button
          onClick={handleDelete}
          disabled={loading || isDeleting}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md disabled:opacity-70"
        >
          {isDeleting ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              Deleting...
            </>
          ) : (
            <>
              <HiTrash className="h-5 w-5" />
              Delete Channel
            </>
          )}
        </button>
      </div>

      {/* Video Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <HiVideoCamera />
            Your Videos
          </h2>
          <span className="inline-block bg-indigo-100 text-indigo-800 font-semibold text-sm px-3 py-1 rounded-full shadow-sm">
            {videos.length.toLocaleString()} video{videos.length !== 1 ? "s" : ""}
          </span>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <HiVideoCamera className="h-16 w-16 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-700">No videos yet</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              Upload your first video to start building your channel
            </p>
            <button
              onClick={() => navigate(`/upload-video/${currentChannel._id}`)}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              Upload Video
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...videos]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((video) => (
                <VideoCardWithActions key={video._id} video={video} />
              ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <EditChannelModal
          channel={currentChannel}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ChannelPage;
