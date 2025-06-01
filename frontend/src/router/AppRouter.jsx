import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Loader from '../components/Loader';

// Lazy-loaded page components
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const ChannelPage = lazy(() => import('../pages/ChannelPage'));
const CreateChannel = lazy(() => import('../pages/CreateChannel'));
const UploadVideo = lazy(() => import('../pages/UploadVideo'));
const EditVideoPage = lazy(() => import('../pages/EditVideoPage'));
const VideoWatchPage = lazy(() => import('../pages/VideoWatchPage'));
const NotFound = lazy(() => import('../pages/NotFound'));

export default function AppRouter({ isAuthenticated }) {
  const location = useLocation();

  return (
    <Suspense fallback={<Loader />}>
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
              // If already logged in, redirect to previous page or home
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
    </Suspense>
  );
}