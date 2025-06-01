import { useState } from "react";
import CommentSection from "./CommentSection";

export default function CommentsToggle({ videoId }) {
  const [showComments, setShowComments] = useState(true);

  return (
    <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow">
      <button
        className="font-medium text-blue-600 hover:underline"
        onClick={() => setShowComments((prev) => !prev)}
      >
        {showComments ? "Hide Comments" : "Show Comments"}
      </button>
      {showComments && (
        <div className="mt-4">
          <CommentSection videoId={videoId} />
        </div>
      )}
    </div>
  );
}