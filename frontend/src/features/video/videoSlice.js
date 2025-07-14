import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  uploadVideoAPI,
  fetchAllVideosAPI,
  fetchMyVideosAPI,
  updateVideoAPI,
  deleteVideoAPI,
  fetchVideoByIdAPI,
  likeVideoAPI,
  dislikeVideoAPI,
} from "./videoAPI";

// Thunks for async operations

export const getVideoById = createAsyncThunk(
  "videos/getVideoById",
  async (id, thunkAPI) => {
    try {
      return await fetchVideoByIdAPI(id);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const uploadVideo = createAsyncThunk(
  "videos/uploadVideo",
  async (formData, { rejectWithValue }) => {
    try {
      return await uploadVideoAPI(formData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllVideos = createAsyncThunk(
  "videos/fetchAllVideos",
  async (_, thunkAPI) => {
    try {
      return await fetchAllVideosAPI();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const fetchMyVideos = createAsyncThunk(
  "videos/fetchMyVideos",
  async (_, thunkAPI) => {
    try {
      return await fetchMyVideosAPI();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateVideo = createAsyncThunk(
  "videos/updateVideo",
  async ({ id, formData }, thunkAPI) => {
    try {
      return await updateVideoAPI({ id, formData });
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const deleteVideo = createAsyncThunk(
  "videos/deleteVideo",
  async (videoId, { rejectWithValue }) => {
    try {
      await deleteVideoAPI(videoId);
      return { videoId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const likeVideo = createAsyncThunk(
  "videos/likeVideo",
  async (videoId, { rejectWithValue }) => {
    try {
      return await likeVideoAPI(videoId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const dislikeVideo = createAsyncThunk(
  "videos/dislikeVideo",
  async (videoId, { rejectWithValue }) => {
    try {
      return await dislikeVideoAPI(videoId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Video Slice
const videoSlice = createSlice({
  name: "videos",
  initialState: {
    videos: [],
    myVideos: [],
    selectedVideo: null,
    uploading: false,
    videoFetching: false,
    videoUpdating: false,
    loading: false,
    error: null,
    uploadedVideo: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upload Video
      .addCase(uploadVideo.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadedVideo = action.payload.video;
        state.videos.unshift(action.payload.video); // Add to top
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      })

      // Fetch All Videos
      .addCase(fetchAllVideos.pending, (state) => {
        state.videoFetching = true;
        state.error = null;
      })
      .addCase(fetchAllVideos.fulfilled, (state, action) => {
        state.videoFetching = false;
        state.videos = action.payload;
      })
      .addCase(fetchAllVideos.rejected, (state, action) => {
        state.videoFetching = false;
        state.error = action.payload;
      })

      // Fetch My Videos
      .addCase(fetchMyVideos.pending, (state) => {
        state.videoFetching = true;
        state.error = null;
      })
      .addCase(fetchMyVideos.fulfilled, (state, action) => {
        state.videoFetching = false;
        state.myVideos = action.payload;
      })
      .addCase(fetchMyVideos.rejected, (state, action) => {
        state.videoFetching = false;
        state.error = action.payload;
      })

      // Update Video
      .addCase(updateVideo.pending, (state) => {
        state.videoUpdating = true;
        state.error = null;
      })
      .addCase(updateVideo.fulfilled, (state, action) => {
        state.videoUpdating = false;
        const updated = action.payload;

        state.myVideos = state.myVideos.map((video) =>
          video._id === updated._id ? updated : video
        );
        state.videos = state.videos.map((video) =>
          video._id === updated._id ? updated : video
        );
        if (state.selectedVideo?._id === updated._id) {
          state.selectedVideo = updated;
        }
      })
      .addCase(updateVideo.rejected, (state, action) => {
        state.videoUpdating = false;
        state.error = action.payload;
      })

      // Delete Video
      .addCase(deleteVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.videoId;
        state.videos = state.videos.filter((video) => video._id !== deletedId);
        state.myVideos = state.myVideos.filter(
          (video) => video._id !== deletedId
        );
        if (state.selectedVideo?._id === deletedId) {
          state.selectedVideo = null;
        }
      })
      .addCase(deleteVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Video by ID
      .addCase(getVideoById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedVideo = null;
      })
      .addCase(getVideoById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedVideo = action.payload;
      })
      .addCase(getVideoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Like Video
      .addCase(likeVideo.fulfilled, (state, action) => {
        if (state.selectedVideo?._id === action.payload._id) {
          state.selectedVideo = action.payload;
        }
      })

      // Dislike Video
      .addCase(dislikeVideo.fulfilled, (state, action) => {
        if (state.selectedVideo?._id === action.payload._id) {
          state.selectedVideo = action.payload;
        }
      });
  },
});

export default videoSlice.reducer;
