import { Link } from "react-router-dom";
import moment from "moment";
import { formatDuration } from "../utils/formatDuration";

const VideoCard = ({ video }) => {
  if (!video) return null;

  const {
    _id,
    title = "Untitled Video",
    thumbnailUrl,
    duration,
    views = 0,
    createdAt,
    channel = {},
  } = video;

  const {
    channelName = "Unknown Channel",
    channelBanner,
  } = channel;

  return (
    <Link
      to={`/video/${_id}`}
      className="w-full group rounded-lg bg-white shadow-md overflow-hidden transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label={`Watch video titled ${title}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden rounded-t-lg">
        <img
          src={thumbnailUrl || "/images/default-thumbnail.jpg"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        {duration && (
          <span className="absolute bottom-2 right-2 text-xs bg-black bg-opacity-75 text-white px-2 py-0.5 rounded-md font-mono">
            {formatDuration(duration)}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex gap-4 p-4">
        {/* Avatar */}
        <img
          src={channelBanner || "/images/channel-banner.jpeg"}
          alt={`${channelName} avatar`}
          className="w-12 h-12 rounded-full object-cover border border-gray-300 flex-shrink-0"
          loading="lazy"
        />

        {/* Text Info */}
        <div className="flex flex-col overflow-hidden">
          <h3
            className="text-base font-semibold leading-snug text-gray-900 line-clamp-2"
            title={title}
          >
            {title}
          </h3>
          <p
            className="text-sm text-gray-600 truncate mt-1"
            title={channelName}
          >
            {channelName}
          </p>
          <p className="text-xs text-gray-500 mt-1 whitespace-nowrap">
            {views.toLocaleString()} views • {moment(createdAt).fromNow()}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
