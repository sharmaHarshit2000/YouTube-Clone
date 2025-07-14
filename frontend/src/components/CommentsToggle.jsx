import { useState } from "react";
import CommentSection from "./CommentSection";

export default function CommentsToggle({ videoId }) {
  const [showComments, setShowComments] = useState(true);

  return (
    <div className="mb-8 bg-[#f9f9f9] p-4 sm:p-6 rounded-xl shadow-sm w-full max-w-3xl mx-auto">
      {/* Toggle Button */}
      <button
        className="text-sm font-semibold text-blue-600 hover:underline"
        onClick={() => setShowComments((prev) => !prev)}
      >
        {showComments ? "Hide Comments" : "Show Comments"}
      </button>

      {/* Animated Toggle Section */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          showComments ? "max-h-[1000px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"
        } mt-4`}
      >
        {showComments && <CommentSection videoId={videoId} />}
      </div>
    </div>
  );
}
