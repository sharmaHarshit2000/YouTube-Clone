import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteVideo } from "../features/video/videoSlice";
import { getChannel } from "../features/channel/channelSlice";
import { toast } from "react-toastify";

const VideoCardWithActions = ({ video }) => {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await dispatch(deleteVideo(video._id)).unwrap();
        dispatch(getChannel(video.channel));
        toast.success("Video deleted successfully");
      } catch (error) {
        console.error("Error deleting video:", error);
        toast.error("Failed to delete video.");
      }
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 max-w-sm mx-auto sm:max-w-md md:max-w-lg">
      <Link to={`/video/${video._id}`} className="block group rounded-md overflow-hidden">
        <div className="aspect-video bg-gray-100 rounded-md overflow-hidden shadow-sm">
          <img
            src={video.thumbnailUrl || "/default-thumbnail.jpg"}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <h3
          className="mt-3 text-lg font-semibold text-gray-900 line-clamp-2"
          title={video.title}
        >
          {video.title}
        </h3>
        <p className="mt-1 text-sm text-gray-600 line-clamp-3" title={video.description}>
          {video.description || "No description available."}
        </p>
      </Link>

      <div className="mt-4 flex justify-end gap-6">
        <Link
          to={`/videos/${video._id}/edit`}
          className="px-3 py-1 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200 transition-colors"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
          aria-label={`Delete video titled ${video.title}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default VideoCardWithActions;