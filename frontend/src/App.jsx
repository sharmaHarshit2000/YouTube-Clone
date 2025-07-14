import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from './features/auth/authSlice';
import { clearChannelState } from './features/channel/channelSlice';
import { useLocation } from 'react-router-dom';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Layout from './components/Layout';
import AppRouter from './router/AppRouter';
import Loader from './components/Loader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  useEffect(() => {
    // On app load or user change, if token exists but no user data, fetch user info
    const token = localStorage.getItem('token');
    if (token && !user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  useEffect(() => {
    // Clear channel-related state when navigating away from channel or video pages
    const isChannelOrVideoPage =
      location.pathname.startsWith('/channel/') ||
      location.pathname.startsWith('/video/');
    if (!isChannelOrVideoPage) {
      dispatch(clearChannelState());
    }
  }, [location.pathname]);

  if (loading) return <Loader />;

  return (
    <>
      <Header />
      <Sidebar />
      <Layout>
        <AppRouter />
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
