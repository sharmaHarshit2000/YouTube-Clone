import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  deleteChannel,
  getChannel,
} from "../features/channel/channelSlice";

import VideoCardWithActions from "../components/VideoCardWithActions";
import EditChannelModal from "../components/EditChannelModal";
import Loader from "../components/Loader"; 

const ChannelPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentChannel, loading, error, videos } = useSelector((state) => state.channel);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(getChannel(id)).unwrap().catch((err) => {
      toast.error("Failed to load channel.");
    });
  }, [dispatch, id]);

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this channel?");
    if (!confirm) return;

    try {
      await dispatch(deleteChannel(currentChannel._id)).unwrap();
      toast.success("Channel deleted successfully!");
      navigate("/");
    } catch (err) {
      toast.error("Failed to delete channel.");
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-600 font-semibold">Error: {error}</p>;
  if (!currentChannel) return <p className="text-gray-600">Channel not found.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* Channel Banner */}
      {currentChannel.channelBanner && (
        <div className="relative h-64 w-full mb-6 rounded-xl overflow-hidden shadow-md">
          <img
            src={currentChannel.channelBanner}
            alt="Channel Banner"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
          <div className="absolute bottom-4 left-4 text-white drop-shadow-lg z-10">
            <h2 className="text-3xl font-bold">{currentChannel.channelName}</h2>
            <p className="text-lg">{currentChannel.description}</p>
          </div>
        </div>
      )}

      {/* Channel Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          className="bg-yellow-500 px-4 py-2 rounded text-white hover:bg-yellow-600 transition"
          onClick={() => setShowModal(true)}
        >
          Edit Channel
        </button>
        <button
          className="bg-red-600 px-4 py-2 rounded text-white hover:bg-red-700 transition"
          onClick={handleDelete}
        >
          Delete Channel
        </button>
        <button
          className="bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700 transition"
          onClick={() => navigate(`/upload-video/${currentChannel._id}`)}
        >
          Upload Video
        </button>
      </div>

      {/* Channel Videos */}
      <h3 className="text-2xl font-semibold mb-4">Your Videos</h3>
      {videos.length === 0 ? (
        <p className="text-gray-500">No videos yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((video) => (
            <VideoCardWithActions key={video._id} video={video} />
          ))}
        </div>
      )}

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