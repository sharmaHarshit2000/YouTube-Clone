import { FiMenu, FiLogIn, FiLogOut, FiMoreVertical } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { logoutUser } from "../features/auth/authSlice";
import { setSearchTerm } from "../features/search/searchSlice";
import { toggleSidebar } from "../features/ui/uiSlice";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const searchTerm = useSelector((state) => state.search.term);

  // Get user's channels, fallback to empty array if none
  const userChannels = user?.channels || [];

  // Determine if user has at least one channel
  const hasChannel = userChannels.length > 0;

  // Extract the channel ID, handle cases where channels are stored as strings or objects
  const myChannelId =
    hasChannel && typeof userChannels[0] === "string"
      ? userChannels[0]
      : userChannels[0]?._id;

  // Redirect user to create-channel page if they are on a channel route but have no channel
  useEffect(() => {
    if (!user) return; // If not logged in, no redirect needed

    // Check if user is on a channel page
    if (!hasChannel && location.pathname.startsWith("/channel/")) {
      const currentChannelId = location.pathname.split("/channel/")[1];

      // Redirect if user has no channel or if URL channel matches user's channel ID
      if (!myChannelId || currentChannelId === myChannelId) {
        console.log("Redirecting to create-channel");
        navigate("/create-channel", { replace: true }); // Replace history so user can't go back
      }
    }
  }, [user, location.pathname, navigate, hasChannel, myChannelId,]);

  // Logout handler: dispatch logout, show toast, and navigate to login page
  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  // Dispatch search term changes to global state
  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white h-16 border-b border-gray-300 shadow-md px-2 sm:px-4 md:px-6 flex items-center justify-between">
      {/* Left: Sidebar toggle and logo */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={() => dispatch(toggleSidebar())}
          aria-label="Toggle sidebar"
          className="text-2xl text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded transition"
        >
          <FiMenu />
        </button>
        <Link to="/" className="flex items-center">
          <img
            src="/images/youtube-logo.jpg"
            alt="Logo"
            className="w-[80px] h-[50px] sm:w-[90px] sm:h-[65px] object-contain select-none"
            draggable={false}
          />
        </Link>
      </div>

      {/* Center: Search input (only show on Home page) */}
      {location.pathname === "/" && (
        <div className="flex-1 mx-2 sm:mx-4 md:mx-6 max-w-full md:max-w-xl lg:max-w-2xl">
          <input
            type="text"
            placeholder="Search videos..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-3 py-1 sm:px-4 sm:py-2 rounded-full border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm transition duration-200"
            aria-label="Search videos"
          />
        </div>
      )}

      {/* Right: Auth controls */}
      <div className="flex items-center gap-1 sm:gap-3">
        {!user ? (
          <Link
            to="/login"
            state={location.pathname !== "/login" ? { from: location } : undefined}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 focus-visible:ring-4 focus-visible:ring-blue-300 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-sm font-semibold shadow-md transition duration-200"
          >
            <FiLogIn className="text-lg" />
            <span className="hidden sm:inline">Login</span>
          </Link>
        ) : (
          <>
            {/* Mobile dropdown toggle */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="sm:hidden text-gray-600 hover:text-gray-900 p-2 rounded-full"
                aria-label="Toggle menu"
              >
                <FiMoreVertical className="text-xl" />
              </button>

              {/* Mobile dropdown menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 flex items-center gap-2 border-b border-gray-100">
                    <img
                      src={user?.profilePic?.trim() ? user.profilePic : '/images/default-avatar.png'}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {user.username}
                    </span>
                  </div>
                  {hasChannel ? (
                    <button
                      onClick={() => {
                        navigate(`/channel/${myChannelId}`);
                        setShowDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Channel
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        navigate("/create-channel");
                        setShowDropdown(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Create Channel
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Desktop view */}
            <div className="hidden sm:flex items-center gap-2 md:gap-3">
              <img
                src={user.profilePic || "/images/default-avatar.png"}
                alt="Profile"
                className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border border-gray-300 shadow-sm"
                draggable={false}
              />
              <span className="hidden md:inline text-sm font-semibold text-gray-700 truncate max-w-[100px] lg:max-w-[130px]">
                {user.username}
              </span>

              {hasChannel ? (
                <button
                  onClick={() => navigate(`/channel/${myChannelId}`)}
                  className="bg-gray-100 hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-gray-300 text-gray-700 px-3 py-1 md:px-4 md:py-2 text-sm rounded-full font-medium shadow-sm transition duration-200"
                >
                  My Channel
                </button>
              ) : (
                <button
                  onClick={() => navigate("/create-channel")}
                  className="bg-blue-600 hover:bg-blue-700 focus-visible:ring-4 focus-visible:ring-blue-300 text-white px-3 py-1 md:px-4 md:py-2 text-sm rounded-full font-semibold shadow-md transition duration-200"
                >
                  Create Channel
                </button>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-600 hover:text-red-800 focus-visible:ring-2 focus-visible:ring-red-300 px-2 py-1 md:px-3 md:py-2 rounded-full border border-red-200 hover:border-red-400 transition duration-200 font-medium"
              >
                <FiLogOut className="text-lg" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
