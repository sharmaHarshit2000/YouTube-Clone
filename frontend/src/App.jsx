import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AppRouter from './router/AppRouter';
import Layout from './components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from './features/auth/authSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />
      <Layout>
        <AppRouter isAuthenticated={!!user} />
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}