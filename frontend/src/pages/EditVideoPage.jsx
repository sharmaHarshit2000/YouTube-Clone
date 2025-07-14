import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getVideoById, updateVideo } from "../features/video/videoSlice";
import EditVideoForm from "../components/EditVideoForm";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const EditVideoPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedVideo, videoUpdating, videoFetching, error } = useSelector((state) => state.videos);
  const { user } = useSelector((state) => state.auth);

  // Safely extract the channel ID from the user's channels array
  const channelId = user?.channels?.[0]?._id || user?.channels?.[0];

  // Fetch video details when the component mounts or the video ID changes
  useEffect(() => {
    if (id) {
      dispatch(getVideoById(id));
    }
  }, [dispatch, id]);

  // Handles video update form submission and navigation on success
  const handleSubmit = async (formData) => {
    try {
      await dispatch(updateVideo({ id, formData })).unwrap();
      toast.success("Video updated successfully!");
      navigate(`/channel/${channelId}`); // Redirect to user's channel after update
    } catch (err) {
      console.error("Video update error:", err);
      toast.error("Failed to update video. Please try again.");
    }
  };

  // Show loader while video data is being fetched
  if (videoFetching) return <Loader />;

  // Show error if video fetch failed
  if (error) return <p className="text-red-500 text-center mt-5">Error: {error}</p>;

  // Graceful fallback UI if video is still null but not fetching anymore
  if (!selectedVideo && !videoFetching) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="text-gray-500">Fetching video data...</div>
      </div>
    );
  }

  // Show intermediate UI when video is being updated
  if (videoUpdating) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="text-lg text-gray-600 animate-pulse">
          Updating video, please wait...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Video</h2>
      <EditVideoForm
        video={selectedVideo}
        onSubmit={handleSubmit}
        videoUpdating={videoUpdating}
      />
    </div>
  );
};

export default EditVideoPage;
