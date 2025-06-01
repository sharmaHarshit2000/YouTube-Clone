import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FaHome, FaStream, FaPlay, FaHistory, FaHeart, FaClock, FaMusic,
  FaFire, FaShoppingCart, FaGamepad, FaNewspaper, FaFilm,
  FaBroadcastTower, FaUserAlt
} from "react-icons/fa";

export default function Sidebar() {
  const { isSidebarOpen } = useSelector((state) => state.ui);

  const mainLinks = [
    { name: "Home", icon: <FaHome />, path: "/" },
    { name: "Shorts", icon: <FaStream />, path: "/" },
    { name: "Subscriptions", icon: <FaPlay />, path: "/" },
  ];

  const youLinks = [
    { name: "History", icon: <FaHistory /> },
    { name: "Playlists", icon: <FaStream /> },
    { name: "Watch later", icon: <FaClock /> },
    { name: "Liked videos", icon: <FaHeart /> },
  ];

  const exploreLinks = [
    { name: "Trending", icon: <FaFire /> },
    { name: "Shopping", icon: <FaShoppingCart /> },
    { name: "Music", icon: <FaMusic /> },
    { name: "Movies", icon: <FaFilm /> },
    { name: "Live", icon: <FaBroadcastTower /> },
    { name: "Gaming", icon: <FaGamepad /> },
    { name: "News", icon: <FaNewspaper /> },
    { name: "Sports", icon: <FaUserAlt /> },
  ];

  return (
    <aside
      className={`
    top-16 left-0 h-[calc(100vh-4rem)] bg-gray-50 border-r border-gray-300 z-40
    w-60 transform transition-transform duration-300 ease-in-out
    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    fixed lg:fixed overflow-y-auto
    scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
  `}
      style={{ minWidth: '200px' }}
    >
      <div className="pt-4 space-y-6">
        <section>
          <h3 className="text-xs font-semibold text-gray-500 mb-3 px-5 uppercase tracking-wide">Home</h3>
          {mainLinks.map((link) => (
            <Link
              to={link.path}
              key={link.name}
              className="flex items-center gap-4 py-2 px-5 rounded hover:bg-gray-200 text-sm text-gray-800 transition-colors"
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </section>

        <section>
          <h3 className="text-xs font-semibold text-gray-500 mb-3 px-5 uppercase tracking-wide">You</h3>
          {youLinks.map((link) => (
            <div
              key={link.name}
              className="flex items-center gap-4 py-2 px-5 rounded hover:bg-gray-200 text-sm text-gray-800 cursor-pointer transition-colors"
            >
              {link.icon}
              <span>{link.name}</span>
            </div>
          ))}
        </section>

        <section>
          <h3 className="text-xs font-semibold text-gray-500 mb-3 px-5 uppercase tracking-wide">Explore</h3>
          {exploreLinks.map((link) => (
            <div
              key={link.name}
              className="flex items-center gap-4 py-2 px-5 rounded hover:bg-gray-200 text-sm text-gray-800 cursor-pointer transition-colors"
            >
              {link.icon}
              <span>{link.name}</span>
            </div>
          ))}
        </section>
      </div>
    </aside>
  );
}