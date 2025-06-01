import { FiMenu, FiLogIn, FiLogOut } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { setSearchTerm } from '../features/search/searchSlice';
import { toggleSidebar } from '../features/ui/uiSlice';
import { toast } from 'react-toastify';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const searchTerm = useSelector((state) => state.search.term);

  const hasChannel = user?.channels?.length > 0;
  const myChannelId = hasChannel ? user.channels[0]._id || user.channels[0] : null;

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully.");
    navigate('/login');
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm h-16 px-4 sm:px-6 flex items-center justify-between border-b border-gray-200">
      {/* Left: Hamburger & Logo */}
      <div className="flex items-center gap-4 min-w-[140px]">
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="text-2xl text-gray-600 hover:text-gray-900 transition"
        >
          <FiMenu />
        </button>
        <Link to="/" className="flex items-center">
          <img
            src="/images/youtube-logo.jpg"
            alt="Logo"
            className="w-[90px] h-[65px] object-contain"
          />
        </Link>
      </div>

      {/* Center: Search Bar (hidden on small screens) */}
      {location.pathname === '/' && (
        <div className="flex-1 mx-4 max-w-lg hidden sm:block">
          <input
            type="text"
            placeholder="Search videos..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      )}

      {/* Right: Auth Buttons and Channel Controls */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-fit">
        {!user ? (
          <Link
            to="/login"
            state={{ from: location }}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm transition whitespace-nowrap"
          >
            <FiLogIn className="text-base" />
            <span className="hidden sm:inline">Login</span>
          </Link>
        ) : (
          <>
            <img
              src={user.profilePic || 'https://www.gravatar.com/avatar/?d=mp'}
              alt="Profile"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-gray-300"
            />
            <span className="hidden sm:inline text-sm font-medium text-gray-700 truncate max-w-[100px]">
              {user.username}
            </span>

            {hasChannel ? (
              <button
                onClick={() => navigate(`/channel/${myChannelId}`)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-full transition whitespace-nowrap"
              >
                My Channel
              </button>
            ) : (
              <button
                onClick={() => navigate('/create-channel')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-full transition whitespace-nowrap"
              >
                Create Channel
              </button>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm transition whitespace-nowrap px-2 sm:px-3 py-1.5 sm:py-2 rounded-full border border-red-100 hover:border-red-300"
            >
              <FiLogOut className="text-base" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}