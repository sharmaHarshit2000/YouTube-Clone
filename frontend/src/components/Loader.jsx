export default function Loader() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div
        className="relative w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin
          shadow-[0_0_10px_rgba(59,130,246,0.7)]"
        aria-label="Loading"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}