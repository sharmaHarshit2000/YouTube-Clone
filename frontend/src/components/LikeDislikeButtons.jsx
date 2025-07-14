import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

export default function LikeDislikeButtons({ video, onLike, onDislike, user }) {
  const likeCount = video.likes?.length || 0;
  const dislikeCount = video.dislikes?.length || 0;

  return (
    <div className="flex gap-3 mb-4 flex-wrap">
      <button
        onClick={onLike}
        className="flex items-center gap-2 px-4 py-1.5 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition"
      >
        <FaThumbsUp className="text-blue-600" />
        <span className="text-sm font-medium">Like</span>
        <span className="text-xs text-gray-500">({likeCount})</span>
      </button>

      <button
        onClick={onDislike}
        className="flex items-center gap-2 px-4 py-1.5 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition"
      >
        <FaThumbsDown className="text-red-600" />
        <span className="text-sm font-medium">Dislike</span>
        <span className="text-xs text-gray-500">({dislikeCount})</span>
      </button>
    </div>

  );
}
