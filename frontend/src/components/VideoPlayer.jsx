import { useState } from "react";
import { toast } from "react-hot-toast";

export default function VideoPlayer({ video }) {
  const [loading, setLoading] = useState(true); // Controls loading overlay
  const [error, setError] = useState(false); // Tracks if video failed to load

  // Called when video has successfully loaded
  const handleLoadedData = () => {
    setLoading(false); // Hide loading overlay
  };

  // Called when there's an error loading the video
  const handleError = () => {
    setLoading(false);
    setError(true); // Mark error state
    toast.error("Failed to load video."); // Show toast notification
  };

  // Return fallback UI if video object is missing
  if (!video) {
    return (
      <div className="text-center text-red-500 text-base font-semibold py-6">
        No video data available.
      </div>
    );
  }

  return (
    <>
      {/* Video container with aspect ratio and styling */}
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-md mb-6">
        
        {/* Loading overlay while video is still buffering */}
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-60">
            <span className="text-white text-base font-medium animate-pulse">
              Loading video...
            </span>
          </div>
        )}

        <video
          src={video.videoUrl}
          controls
          onLoadedData={handleLoadedData}
          onError={handleError}
          className={`w-full h-full object-contain transition-opacity duration-300 ${
            loading ? "opacity-0" : "opacity-100" // Fade in video once loaded
          }`}
        />
      </div>

      {/* Error message if video fails to load */}
      {error && (
        <div className="text-center text-base text-red-600 font-semibold mb-4">
          Unable to display video. Please try again later.
        </div>
      )}
    </>
  );
}
