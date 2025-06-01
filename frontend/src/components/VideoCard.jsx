import { Link } from "react-router-dom";
import moment from "moment";
import { formatDuration } from "../utils/formatDuration";

const VideoCard = ({ video }) => {
  if (!video) return null;

  return (
    <Link
      to={`/video/${video._id}`}
      className="w-full sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg transition-transform hover:scale-105 group rounded-lg shadow-lg bg-white overflow-hidden"
      aria-label={`Watch video titled ${video.title}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-100 rounded-t-lg overflow-hidden shadow-sm">
        <img
          src={video.thumbnailUrl || "/default-thumbnail.jpg"}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        {video.duration && (
          <span className="absolute bottom-2 right-2 text-xs bg-black bg-opacity-75 text-white px-2 py-0.5 rounded-md font-mono select-none">
            {formatDuration(video.duration)}
          </span>
        )}
      </div>

      {/* Video Info */}
      <div className="flex gap-4 p-4">
        {/* Channel Avatar */}
        <img
          src={video.channel?.channelBanner || "/default-avatar.png"}
          alt={`${video.channel?.channelName || "Channel"} avatar`}
          className="w-12 h-12 rounded-full object-cover border border-gray-300 flex-shrink-0"
          loading="lazy"
        />

        {/* Text Info */}
        <div className="flex flex-col overflow-hidden">
          <h3
            className="text-base font-semibold leading-tight text-gray-900 line-clamp-2"
            title={video.title}
          >
            {video.title}
          </h3>
          <p className="text-sm text-gray-600 truncate mt-1" title={video.channel?.channelName}>
            {video.channel?.channelName || "Unknown Channel"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {video.views?.toLocaleString() || 0} views • {moment(video.createdAt).fromNow()}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;