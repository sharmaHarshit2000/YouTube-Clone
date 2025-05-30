import axiosInstance from "../../utils/axiosInstance";

export const register = (formData) => {
  axiosInstance.post("/auth/register", formData),
    {
      headers: { "Content-Type": "multipart/formData" },
    };
};

export const login = (data) => {
  axiosInstance.post("/auth/login", data);
};

export const getMe = axiosInstance.get("/auth/me");
