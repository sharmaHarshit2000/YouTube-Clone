import axiosInstance from "../../utils/axiosInstance";

// Call backend search endpoint with URL-encoded search term
export const searchVideosAPI = async (searchTerm) => {
  try {
    const res = await axiosInstance.get(
      `/videos/search?query=${encodeURIComponent(searchTerm)}`
    );
    return res.data;
  } catch (err) {
    console.error("Error searching videos:", err);
    // Pass only a friendly message to UI, fallback to generic
    throw new Error(err.response?.data?.message || "Error searching videos");
  }
};
