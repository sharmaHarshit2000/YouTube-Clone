import { useState } from "react";

export default function DescriptionToggle({ description }) {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow">
      <button
        className="font-medium text-blue-600 hover:underline"
        onClick={() => setShowDescription((prev) => !prev)}
      >
        {showDescription ? "Hide Description" : "Show Description"}
      </button>
      {showDescription && <p className="text-gray-800 whitespace-pre-wrap mt-2">{description}</p>}
    </div>
  );
}