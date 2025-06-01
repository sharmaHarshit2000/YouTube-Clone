import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getVideoById, updateVideo } from "../features/video/videoSlice";
import EditVideoForm from "../components/EditVideoForm";
import { toast } from "react-toastify";
import Loader from "../components/Loader"; // Your global loader component

const EditVideoPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedVideo, videoUpdating, videoFetching, error } = useSelector((state) => state.videos);
  const { user } = useSelector((state) => state.auth);
  const channelId = user?.channels?.[0]?._id || user?.channels?.[0];

  useEffect(() => {
    if (id) dispatch(getVideoById(id));
  }, [dispatch, id]);

  const handleSubmit = async (formData) => {
    try {
      await dispatch(updateVideo({ id, formData })).unwrap();
      toast.success("Video updated successfully!");
      navigate(`/channel/${channelId}`);
    } catch (err) {
      console.error("Video update error:", err);
      toast.error("Failed to update video. Please try again.");
    }
  };

  if (videoFetching) return <Loader />;
  if (error) return <p className="text-red-500 text-center mt-5">Error: {error}</p>;
  if (!selectedVideo) return <p className="text-center mt-5">No video found</p>;

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