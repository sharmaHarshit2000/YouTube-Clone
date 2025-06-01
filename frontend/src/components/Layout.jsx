import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  const { isSidebarOpen } = useSelector((state) => state.ui);

  return (
    <div>
      <div className="flex">
        <Sidebar />
        <main
          className={`
            flex-1 min-h-screen p-4 mt-16 transition-all duration-300
            ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}
          `}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;