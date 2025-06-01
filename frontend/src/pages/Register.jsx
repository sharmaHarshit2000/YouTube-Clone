import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, resetError } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, error, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profilePic: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) toast.error(error);
    return () => {
      dispatch(resetError());
    };
  }, [error, dispatch]);

  const handleChange = (e) => {
    if (e.target.name === 'profilePic') {
      const file = e.target.files[0];
      setFormData({ ...formData, profilePic: file });
      if (file) {
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, profilePic: null });
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('username', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    if (formData.profilePic) {
      data.append('profile', formData.profilePic);
    }

    const result = await dispatch(registerUser(data));

    if (registerUser.fulfilled.match(result)) {
      toast.success('Registered successfully! Redirecting to login...');
      navigate('/login');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
          <input
            type="text"
            name="name"
            onChange={handleChange}
            placeholder="Name"
            required
            className="w-full border px-4 py-2 rounded outline-none"
          />
          <input
            type="email"
            name="email"
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full border px-4 py-2 rounded outline-none"
          />
          <input
            type="password"
            name="password"
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full border px-4 py-2 rounded outline-none"
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Profile Picture</label>
            <input
              type="file"
              name="profilePic"
              accept="image/*"
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
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
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
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
  );
}