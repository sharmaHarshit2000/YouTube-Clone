import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchAllVideos } from "../features/video/videoSlice";
import moment from "moment";
import { formatDuration } from "../utils/formatDuration";

const SuggestedVideos = ({ videos = [], currentVideoId, isLoading, error }) => {
  const dispatch = useDispatch();

  // Fetch all videos if the videos array is initially empty
  useEffect(() => {
    if (videos.length === 0) {
      dispatch(fetchAllVideos());
    }
  }, [dispatch, videos.length]);

  // Show loader while fetching videos
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loader animate-spin w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Show error message if fetching failed
  if (error) {
    return (
      <div className="bg-red-100 text-red-700 px-4 py-3 rounded-md text-sm">
        {error || "Something went wrong while loading suggested videos."}
      </div>
    );
  }

  // Defensive check: if videos prop is not an array, don't render anything
  if (!Array.isArray(videos)) return null;

  // Filter out the currently playing video from the suggested list
  const suggested = videos.filter((video) => video._id !== currentVideoId);

  return (
    <div className="w-full">
      {/* Section header with sticky positioning for visibility on scroll */}
      <h3 className="text-lg sm:text-xl font-bold mb-3 px-1 text-gray-900 border-b pb-2 sticky top-0 bg-white z-10">
        Suggested Videos
      </h3>

      {/* Map over suggested videos and render each as a clickable link */}
      {suggested.map((video) => (
        <Link
          key={video._id}
          to={`/video/${video._id}`}
          className="flex flex-col sm:flex-row gap-3 p-2 mb-2 hover:bg-gray-100 rounded-lg transition duration-200"
        >
          {/* Thumbnail section */}
          <div className="relative w-full sm:w-40 h-24 sm:h-24 rounded overflow-hidden flex-shrink-0">
            <img
              src={video.thumbnailUrl || "/images/default-thumbnail.jpg"}
              alt={video.title || "Video thumbnail"}
              className="w-full h-full object-cover rounded"
            />
            {video.duration && (
              <span className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1.5 py-0.5 rounded">
                {formatDuration(video.duration)} {/* Format video duration */}
              </span>
            )}
          </div>

          {/* Video info section: title, channel banner/name, and upload time */}
          <div className="flex flex-col justify-between w-full overflow-hidden">
            <p className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 leading-snug">
              {video.title}
            </p>

            <div className="flex items-center gap-2 mt-2">
              {/* Channel banner as avatar */}
              <img
                src={video.channel?.channelBanner || "/images/channel-banner.jpeg"}
                alt={video.channel?.channelName || "Channel"}
                className="w-6 aspect-square object-cover rounded-full shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-sm text-gray-800 truncate max-w-[160px]">
                  {video.channel?.channelName || "Unknown Channel"} {/* Fallback if channel name is missing */}
                </span>
                <span className="text-xs text-gray-500">
                  {moment(video.createdAt).fromNow()} {/* Time since upload */}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SuggestedVideos;
