import axios from "axios";
const axiosInstance = axios.create({
 baseURL: import.meta.env.VITE_API_URL,
});

// Attach JWT token from localStorage to every request if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
 console.log("Request URL:", config.baseURL + config.url);
  return config;
});

export default axiosInstance;
