import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  // Get the sidebar open/close state from Redux store
  const { isSidebarOpen } = useSelector((state) => state.ui);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Placeholder for Topbar component */}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar component */}
        <Sidebar />
        <main
          className={`
            flex-1 overflow-y-auto px-4 pt-4 pb-10 mt-16
            transition-all duration-300
            ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}  /* Adjust margin based on sidebar visibility */
          `}
        >
          {children} {/* Render nested page content */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
