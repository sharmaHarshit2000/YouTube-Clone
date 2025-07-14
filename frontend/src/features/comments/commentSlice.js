import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./commentAPI";

// Thunks for CRUD operations on comments
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (videoId) => await api.getComments(videoId)
);

export const createComment = createAsyncThunk(
  "comments/createComment",
  async ({ videoId, text }) => await api.addComment({ videoId, text })
);

export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async ({ commentId, text, videoId }) => 
    await api.editComment({ commentId, text, videoId })
);

export const removeComment = createAsyncThunk(
  "comments/removeComment",
  async ({ commentId, videoId }) => {
    await api.deleteComment({ commentId, videoId });
    return commentId; // Used to remove from local state
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetching all comments
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      // Adding new comment at the top
      .addCase(createComment.fulfilled, (state, action) => {
        state.items.unshift(action.payload.comment); // Prepend new comment to top
      })

      // Updating a comment in-place using its ID
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c._id === action.payload.comment._id);
        if (index !== -1) {
          state.items[index] = action.payload.comment; // Replace comment by ID
        }
      })

      // Removing a comment by ID
      .addCase(removeComment.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c._id !== action.payload);
      });
  },
});

export default commentSlice.reducer;
