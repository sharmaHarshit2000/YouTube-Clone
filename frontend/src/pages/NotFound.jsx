import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center animate-fadeIn">
      <h1 className="text-6xl font-extrabold text-red-600 mb-6 animate-bounce">404</h1>

      <h2 className="text-3xl font-semibold mb-4 text-gray-900 tracking-wide">
        Oops! Page Not Found
      </h2>

      <p className="max-w-xl text-gray-700 text-lg leading-relaxed mb-10 px-4 sm:px-0">
        The page you’re looking for doesn’t exist, may have been moved, or is temporarily unavailable.  
        Please check the URL or return to the homepage.
      </p>

      <Link
        to="/"
        className="inline-block bg-red-600 text-white font-semibold px-7 py-3 rounded-full shadow-lg transition-transform transform hover:scale-105 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300"
      >
        Go to Home
      </Link>
    </div>
  );
}
