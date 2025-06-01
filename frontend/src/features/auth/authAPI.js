import axiosInstance from "../../utils/axiosInstance";

export const login = (data) => {
  return axiosInstance.post("/auth/login", data);
};

export const register = (formData) => {
  return axiosInstance.post("/auth/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getMe = () => {
  return axiosInstance.get("/auth/me");
};
