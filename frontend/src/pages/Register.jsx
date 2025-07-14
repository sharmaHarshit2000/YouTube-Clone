import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, resetError } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profilePic: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setFormError(error);
    } else {
      setFormError(null);
    }

    // Reset error when component unmounts
    return () => {
      dispatch(resetError());
    };
  }, [error, dispatch]);

  const handleChange = (e) => {
    if (e.target.name === 'profilePic') {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, profilePic: file }));
      setImagePreview(file ? URL.createObjectURL(file) : null);
    } else {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, profilePic: null }));
    setImagePreview(null);
  };

  // Enforce strong password rules: min 8 chars, 1 upper, 1 lower, 1 number, 1 special char
  const validatePassword = (password) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(formData.password)) {
      setFormError(
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
      );
      return;
    }

    setFormError(null);

    // Use FormData to include file upload
    const data = new FormData();
    data.append('username', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    if (formData.profilePic) data.append('profile', formData.profilePic);

    const result = await dispatch(registerUser(data));

    if (registerUser.fulfilled.match(result)) {
      toast.success('Registered successfully! Welcome 🎉');
      navigate('/');
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm p-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mb-4 shadow-md" />
          <p className="text-blue-700 text-lg font-semibold animate-pulse text-center">
            Creating your account, please wait...
          </p>
        </div>
      )}

      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
                className="w-full border px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="abc@gmail.com"
                required
                className="w-full border px-4 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                  className={`w-full border px-4 pr-10 py-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500 ${formError?.toLowerCase().includes('password') ? 'border-red-500' : ''
                    }`}
                  aria-describedby="password-error"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
              </div>
              {formError?.toLowerCase().includes('password') && (
                <p id="password-error" className="mt-1 text-sm text-red-600">
                  {formError}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Profile Picture
              </label>
              <label className="cursor-pointer inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition w-fit">
                Choose Image
                <input
                  type="file"
                  name="profilePic"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <div className="relative w-32 h-32 mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                    aria-label="Remove profile picture"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-md text-lg font-medium hover:opacity-90 transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <p className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
