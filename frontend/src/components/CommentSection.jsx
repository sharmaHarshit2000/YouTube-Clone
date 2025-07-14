import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchComments,
  createComment,
  updateComment,
  removeComment,
} from '../features/comments/commentSlice';
import { toast } from 'react-toastify';
import {
  FiSend,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiX,
  FiUser,
} from 'react-icons/fi';
import { BiLoaderAlt } from 'react-icons/bi';

const CommentSection = ({ videoId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: comments, loading } = useSelector((state) => state.comments);

  const [text, setText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch comments for the current video
  useEffect(() => {
    if (videoId) {
      dispatch(fetchComments(videoId));
    }
  }, [videoId, dispatch]);

  // Add a new comment
  const handleAddComment = async () => {
    if (!user) {
      toast.info('Please login to comment.');
      return;
    }

    if (!text.trim()) return;

    setIsPosting(true);
    try {
      await dispatch(createComment({ videoId, text }));
      await dispatch(fetchComments(videoId)); // Refresh comments after adding
      setText('');
    } finally {
      setIsPosting(false);
    }
  };

  // Update an existing comment
  const handleUpdateComment = async (commentId) => {
    if (!editText.trim()) return;

    setIsUpdating(true);
    try {
      await dispatch(updateComment({ commentId, text: editText, videoId }));
      setEditingCommentId(null);
      setEditText('');
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete a comment
  const handleDeleteComment = (commentId) => {
    dispatch(removeComment({ commentId, videoId }));
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Header with comment count */}
      <h3 className="text-lg sm:text-xl font-bold text-gray-900">
        Comments{' '}
        {comments.length > 0 && (
          <span className="text-blue-600 font-bold">({comments.length})</span>
        )}
      </h3>

      {/* Comment input field */}
      <div className="flex items-start gap-4">
        {/* User avatar or placeholder icon */}
        <div className="flex-shrink-0">
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <FiUser className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Input box and submit button */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="relative">
            <input
              className="w-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-4 py-3 rounded-xl transition-all bg-white text-gray-800 placeholder-gray-400"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a comment..."
              onKeyUp={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all disabled:opacity-70"
              onClick={handleAddComment}
              disabled={isPosting || !text.trim()}
            >
              {isPosting ? (
                <BiLoaderAlt className="w-4 h-4 animate-spin" />
              ) : (
                <FiSend className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Display loading state */}
      {loading ? (
        <div className="flex justify-center py-8">
          <BiLoaderAlt className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : comments.length === 0 ? (
        // Show when no comments
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
          <p className="text-lg">No comments yet</p>
          <p className="mt-1 text-sm">Be the first to comment!</p>
        </div>
      ) : (
        // Render list of comments
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="flex items-start gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Comment author avatar */}
              <div className="flex-shrink-0">
                {comment.author?.profilePic ? (
                  <img
                    src={comment.author.profilePic}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <FiUser className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Comment content */}
              <div className="flex-1 min-w-0">
                {/* Header with username and date */}
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800 truncate">
                    {comment.author?.username || 'Unknown User'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {/* Editable input for updating comment */}
                {editingCommentId === comment._id ? (
                  <div className="space-y-3 mt-2">
                    <textarea
                      className="w-full border border-gray-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white text-gray-800"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows="3"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm transition-all disabled:opacity-70"
                        onClick={() => handleUpdateComment(comment._id)}
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <BiLoaderAlt className="w-3 h-3 animate-spin" />
                        ) : (
                          <FiCheck className="w-3 h-3" />
                        )}
                        Save
                      </button>
                      <button
                        className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded-lg text-sm transition-all"
                        onClick={() => setEditingCommentId(null)}
                      >
                        <FiX className="w-3 h-3" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Static comment text */}
                    <p className="text-gray-700 mt-1 whitespace-pre-wrap break-words">
                      {comment.text}
                    </p>

                    {/* Show Edit/Delete only for the author */}
                    {user && comment.author?._id === user._id && (
                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => {
                            setEditingCommentId(comment._id);
                            setEditText(comment.text);
                          }}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <FiEdit2 className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 transition-colors"
                        >
                          <FiTrash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
