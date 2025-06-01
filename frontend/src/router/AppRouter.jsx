import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ChannelPage from '../pages/ChannelPage';
import CreateChannel from '../pages/CreateChannel';
import UploadVideo from '../pages/UploadVideo';
import EditVideoPage from '../pages/EditVideoPage';
import VideoWatchPage from '../pages/VideoWatchPage';
import NotFound from '../pages/NotFound';

export default function AppRouter({ isAuthenticated }) {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/video/:videoId" element={<VideoWatchPage />} />
      <Route path="/channel/:id" element={<ChannelPage />} />

      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <Login />
          ) : (
            <Navigate to={location.state?.from?.pathname || '/'} replace />
          )
        }
      />
      <Route
        path="/register"
        element={
          !isAuthenticated ? (
            <Register />
          ) : (
            <Navigate to={location.state?.from?.pathname || '/'} replace />
          )
        }
      />

      <Route
        path="/create-channel"
        element={
          isAuthenticated ? (
            <CreateChannel />
          ) : (
            <Navigate to="/login" replace state={{ from: location }} />
          )
        }
      />
      <Route
        path="/upload-video/:id"
        element={
          isAuthenticated ? (
            <UploadVideo />
          ) : (
            <Navigate to="/login" replace state={{ from: location }} />
          )
        }
      />
      <Route
        path="/videos/:id/edit"
        element={
          isAuthenticated ? (
            <EditVideoPage />
          ) : (
            <Navigate to="/login" replace state={{ from: location }} />
          )
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
