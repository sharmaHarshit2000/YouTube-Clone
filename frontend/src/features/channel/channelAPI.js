
import axiosInstance from "../../utils/axiosInstance";

export const createChannelAPI = async (formData) => {
  try {
    const res = await axiosInstance.post("/channels", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`, 
      },
    });
    return res.data; // returns { channel }
  } catch (err) {
    console.error("Error creating channel:", err);
    throw new Error(err.response?.data?.message || "Error creating channel");
  }
};

export const fetchChannelAPI = async (channelId) => {
  try {
    const res = await axiosInstance.get(`/channels/${channelId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data; // { channel, videos }
  } catch (err) {
    console.error("Error fetching channel:", err);
    throw new Error(err.response?.data?.message || "Error fetching channel");
  }
};

export const updateChannelAPI = async ({ id, updateData }) => {
  try {
    const res = await axiosInstance.put(`/channels/${id}`, updateData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return res.data; // Returns the updated channel data
  } catch (err) {
    console.error("Error updating channel:", err);
    throw new Error(err.response?.data?.message || "Error updating channel");
  }
};

export const deleteChannelAPI = async (id) => {
  try {
    const res = await axiosInstance.delete(`/channels/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, 
      },
    });
    return res.data; 
  } catch (err) {
    console.error("Error deleting channel:", err);
    throw new Error(err.response?.data?.message || "Error deleting channel");
  }
};

export const toggleSubscription = async (channelId) => {
  try {
    const res = await axiosInstance.post(
      `/channels/${channelId}/subscribe`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Subscription error:", err);
    throw new Error(err.response?.data?.message || "Subscription error");
  }
};
