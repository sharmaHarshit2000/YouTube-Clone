import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteVideo } from "../features/video/videoSlice";
import { getChannel } from "../features/channel/channelSlice";
import { toast } from "react-toastify";
import { useState } from "react";
import { FiEdit2, FiTrash2, FiLoader } from "react-icons/fi";

// Helper function to format date in "Month Day, Year" format
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const VideoCardWithActions = ({ video }) => {
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false); // State to track if delete action is in progress

  // Handles deleting the video after user confirmation
  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this video? This action cannot be undone."
      )
    ) {
      setIsDeleting(true); // Set loading state on delete button
      try {
        // Dispatch deleteVideo thunk and wait for it to finish
        await dispatch(deleteVideo(video._id)).unwrap();
        // After deleting video, refresh the channel data to reflect changes
        dispatch(getChannel(video.channel));
        toast.success("Video deleted successfully");
      } catch (error) {
        console.error("Error deleting video:", error);
        toast.error("Failed to delete video.");
      } finally {
        setIsDeleting(false); // Reset loading state regardless of success or failure
      }
    }
  };

  return (
    <article className="group relative w-full max-w-sm sm:max-w-md mx-auto rounded-xl overflow-hidden border border-gray-200 bg-white shadow hover:shadow-md transition-shadow duration-300">

      {/* Video thumbnail linking to video page */}
      <Link
        to={`/video/${video._id}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        <div className="relative aspect-video bg-gray-100 overflow-hidden">
          <img
            src={video.thumbnailUrl || "/images/default-thumbnail.jpg"} // Fallback thumbnail if none provided
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      {/* Video title and description */}
      <div className="p-4">
        <Link
          to={`/video/${video._id}`}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
        >
          {/* Title with truncation and hover color change */}
          <h3
            className="text-lg font-semibold text-gray-800 line-clamp-2 mb-1 hover:text-blue-600 transition-colors"
            title={video.title}
          >
            {video.title}
          </h3>
        </Link>

        {/* Description with fallback text if not available */}
        <p
          className="text-sm text-gray-600 line-clamp-2 mb-3"
          title={video.description || "No description available."}
        >
          {video.description || "No description available."}
        </p>

        {/* Video metadata: upload date and view count */}
        <div className="flex justify-between items-center text-xs text-gray-500">
          <time dateTime={video.createdAt}>
            {formatDate(video.createdAt)} {/* Formatted upload date */}
          </time>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium">
            {video.views || 0} views {/* View count with default 0 */}
          </span>
        </div>
      </div>

      {/* Edit and Delete action buttons */}
      <div className="px-4 pb-4 flex justify-end gap-3">
        {/* Edit button linking to edit page */}
        <Link
          to={`/videos/${video._id}/edit`}
          className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
        >
          <FiEdit2 className="mr-1.5 h-4 w-4" />
          Edit
        </Link>

        {/* Delete button with loading state and confirmation */}
        <button
          onClick={handleDelete}
          disabled={isDeleting} // Disable button while deleting
          className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isDeleting ? (
            <>
              <FiLoader className="animate-spin mr-1.5 h-4 w-4" />
              Deleting...
            </>
          ) : (
            <>
              <FiTrash2 className="mr-1.5 h-4 w-4" />
              Delete
            </>
          )}
        </button>
      </div>

      {/* Border highlight on hover */}
      <div className="absolute inset-0 pointer-events-none border-2 border-transparent group-hover:border-blue-400 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
    </article>
  );
};

export default VideoCardWithActions;
