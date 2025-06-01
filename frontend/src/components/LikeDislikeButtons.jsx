import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

export default function LikeDislikeButtons({ video, onLike, onDislike, user }) {
  const likeCount = video.likes?.length || 0;
  const dislikeCount = video.dislikes?.length || 0;

  return (
    <div className="flex gap-4 mb-6">
      <button
        onClick={onLike}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-full shadow-sm hover:bg-gray-200 transition duration-200"
      >
        <FaThumbsUp className="text-blue-600" />
        <span className="font-medium text-sm">Like</span>
        <span className="text-xs text-gray-600">({likeCount})</span>
      </button>

      <button
        onClick={onDislike}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-full shadow-sm hover:bg-gray-200 transition duration-200"
      >
        <FaThumbsDown className="text-red-600" />
        <span className="font-medium text-sm">Dislike</span>
        <span className="text-xs text-gray-600">({dislikeCount})</span>
      </button>
    </div>
  );
}