import  { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchComments,
  createComment,
  updateComment,
  removeComment,
} from '../features/comments/commentSlice';
import { toast } from 'react-toastify';

const CommentSection = ({ videoId }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: comments, loading } = useSelector((state) => state.comments);

  const [text, setText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (videoId) {
      dispatch(fetchComments(videoId));
    }
  }, [videoId, dispatch]);

  const handleAddComment = async () => {
    if (!user) {
      toast.info('Please login to comment.');
      return;
    }

    if (!text.trim()) return;

    await dispatch(createComment({ videoId, text }));
    await dispatch(fetchComments(videoId));
    setText('');
  };

  const handleUpdateComment = (commentId) => {
    if (!editText.trim()) return;
    dispatch(updateComment({ commentId, text: editText, videoId }));
    setEditingCommentId(null);
    setEditText('');
  };

  const handleDeleteComment = (commentId) => {
    dispatch(removeComment({ commentId, videoId }));
  };

  return (
    <div className="space-y-4 mt-4">
      <h3 className="text-xl font-semibold text-gray-800">Comments</h3>

      {
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            className="border border-gray-300 px-4 py-2 rounded-lg w-full"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            onClick={handleAddComment}
          >
            Post
          </button>
        </div>
      }

      {loading && <p className="text-gray-500">Loading comments...</p>}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="bg-white shadow p-4 rounded-lg border border-gray-200"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-800">
                {comment.author?.username || 'Unknown User'}
              </span>

              {user && comment.author?._id === user._id && (
                <div className="flex gap-2 text-sm">
                  <button
                    onClick={() => {
                      setEditingCommentId(comment._id);
                      setEditText(comment.text);
                    }}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {editingCommentId === comment._id ? (
              <div className="space-y-2">
                <input
                  className="border border-gray-300 px-3 py-2 rounded w-full"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    onClick={() => handleUpdateComment(comment._id)}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                    onClick={() => setEditingCommentId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700">{comment.text}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;