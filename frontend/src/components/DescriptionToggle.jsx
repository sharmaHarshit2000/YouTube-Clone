import { useState } from "react";

function formatUploadDate(dateStr) {
  if (!dateStr) return "Unknown date";
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function DescriptionToggle({ description, views = 0, uploadDate = "" }) {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <div className="mb-8 bg-[#f9f9f9] p-4 sm:p-6 rounded-xl shadow-sm w-full max-w-3xl mx-auto">
      {/* Views and Upload Date */}
      <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-600 mb-3">
        <p>{views.toLocaleString()} views</p>
        <p>{formatUploadDate(uploadDate)}</p>
      </div>

      {/* Toggle Button */}
      <button
        className="text-sm font-semibold text-blue-600 hover:underline"
        onClick={() => setShowDescription((prev) => !prev)}
      >
        {showDescription ? "Hide Description" : "Show Description"}
      </button>

      {/* Smooth Animated Description */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          showDescription ? "max-h-[1000px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"
        }`}
      >
        <p className="mt-3 text-gray-800 text-sm whitespace-pre-line leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
