import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';

// Lazy-loaded pages for code splitting and performance optimization
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const ChannelPage = lazy(() => import('../pages/ChannelPage'));
const CreateChannel = lazy(() => import('../pages/CreateChannel'));
const UploadVideo = lazy(() => import('../pages/UploadVideo'));
const EditVideoPage = lazy(() => import('../pages/EditVideoPage'));
const VideoWatchPage = lazy(() => import('../pages/VideoWatchPage'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Wrapper component to protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  // If user is authenticated, render children (protected content)
  // Otherwise, redirect to login and store current location to redirect back after login
  return user ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default function AppRouter() {
  const location = useLocation();
  const { user, loading } = useSelector((state) => state.auth);

  // While authentication state is loading, show a loader to avoid flicker
  if (loading) return <Loader />;

  // Check if user has at least one channel and get the first channel's id
  const hasChannel = user?.channels?.length > 0;
  const channelId = user?.channels?.[0]?._id;

  return (
    <Suspense fallback={<Loader />}>
      {/* Key ensures route component remounts when user changes */}
      <Routes key={user?._id || 'guest'}>
        {/* Public Routes accessible to everyone */}
        <Route path="/" element={<Home />} />
        <Route path="/video/:videoId" element={<VideoWatchPage />} />
        <Route path="/channel/:id" element={<ChannelPage />} />
        <Route path="/register" element={<Register />} />

        {/* Login Route with special redirect logic */}
        <Route
          path="/login"
          element={
            !user ? (
              // If no user logged in, show Login page
              <Login />
            ) : location.state?.from?.pathname === '/create-channel' ? (
              // If user came from /create-channel and is logged in:
              hasChannel ? (
                // If user already has a channel, redirect to their channel page
                <Navigate to={`/channel/${channelId}`} replace />
              ) : (
                // If user does NOT have a channel, redirect back to create channel page
                <Navigate to="/create-channel" replace />
              )
            ) : (
              // If logged in and not coming from /create-channel, redirect to homepage
              <Navigate to="/" replace />
            )
          }
        />

        {/* Create Channel Route - accessible only to logged-in users without a channel */}
        <Route
          path="/create-channel"
          element={
            user ? (
              hasChannel ? (
                // If user has a channel, redirect to it instead of showing create channel page
                <Navigate to={`/channel/${channelId}`} replace />
              ) : (
                // If user does NOT have a channel, show create channel page
                <CreateChannel />
              )
            ) : (
              // If user not logged in, redirect to login and store current location for redirect after login
              <Navigate to="/login" state={{ from: location }} replace />
            )
          }
        />

        {/* Protected Routes - require authentication */}
        <Route
          path="/upload-video/:id"
          element={
            <ProtectedRoute>
              <UploadVideo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/videos/:id/edit"
          element={
            <ProtectedRoute>
              <EditVideoPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all fallback route for unmatched paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
