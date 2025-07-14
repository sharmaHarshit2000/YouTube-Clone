import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, resetError } from '../features/auth/authSlice';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { error, loading } = useSelector((state) => state.auth);

  // Determine redirect path after login (fallback to '/' if not available)
  const redirectTo = useMemo(() => {
    const fromState = location.state?.from?.pathname;
    if (fromState) {
      sessionStorage.setItem('redirectAfterLogin', fromState);
      return fromState;
    }
    const savedRedirect = sessionStorage.getItem('redirectAfterLogin');
    return savedRedirect || '/';
  }, [location.state]);

  // Clear any previous error when component mounts
  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(loginUser(form)).unwrap();
      toast.success(`Welcome back, ${res.username}!`);
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-blue-50 to-blue-100 px-4">
      <div className="relative w-full max-w-md bg-white p-8 rounded-xl shadow-xl">

        {/* Overlay loader on top of form when logging in */}
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="w-14 h-14 border-4 border-blue-500 border-dashed rounded-full animate-spin mb-3" />
            <p className="text-blue-700 font-medium animate-pulse text-sm">Logging you in...</p>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login to Your Account</h2>

        {error && !loading && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 px-4 py-2 pr-10 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute bottom-2.5 right-3 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 rounded-md font-medium shadow-sm hover:bg-blue-700 transition duration-200 ${loading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
