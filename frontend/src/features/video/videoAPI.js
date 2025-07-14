import axiosInstance from "../../utils/axiosInstance";

// Returns authorization header with Bearer token from localStorage
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// Upload a new video to the server
export const uploadVideoAPI = async (formData) => {
  try {
    const res = await axiosInstance.post("/videos/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...getAuthHeader(),
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error uploading video:", err);
    throw new Error(err.response?.data?.message || "Error uploading video");
  }
};

// Fetch all videos from the server
export const fetchAllVideosAPI = async () => {
  try {
    const res = await axiosInstance.get("/videos");
    return res.data;
  } catch (err) {
    console.error("Error fetching all videos:", err);
    throw new Error(err.response?.data?.message || "Error fetching videos");
  }
};

// Fetch only the videos uploaded by the logged-in user
export const fetchMyVideosAPI = async () => {
  try {
    const res = await axiosInstance.get("/videos/user", {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching my videos:", err);
    throw new Error(err.response?.data?.message || "Error fetching my videos");
  }
};

// Update an existing video by ID
export const updateVideoAPI = async ({ id, formData }) => {
  try {
    const res = await axiosInstance.put(`/videos/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...getAuthHeader(),
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error updating video:", err);
    throw new Error(err.response?.data?.message || "Error updating video");
  }
};

// Delete a video by ID
export const deleteVideoAPI = async (id) => {
  try {
    const res = await axiosInstance.delete(`/videos/${id}`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err) {
    console.error("Error deleting video:", err);
    throw new Error(err.response?.data?.message || "Error deleting video");
  }
};

// Fetch a single video by ID
export const fetchVideoByIdAPI = async (id) => {
  try {
    const res = await axiosInstance.get(`/videos/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching video by ID:", err);
    throw new Error(err.response?.data?.message || "Error fetching video");
  }
};

// Like a video
export const likeVideoAPI = async (videoId) => {
  try {
    const res = await axiosInstance.post(
      `/videos/${videoId}/like`,
      {},
      { headers: getAuthHeader() }
    );
    return res.data;
  } catch (err) {
    console.error("Error liking video:", err);
    throw new Error(err.response?.data?.message || "Error liking video");
  }
};

// Dislike a video
export const dislikeVideoAPI = async (videoId) => {
  try {
    const res = await axiosInstance.post(
      `/videos/${videoId}/dislike`,
      {},
      { headers: getAuthHeader() }
    );
    return res.data;
  } catch (err) {
    console.error("Error disliking video:", err);
    throw new Error(err.response?.data?.message || "Error disliking video");
  }
};
