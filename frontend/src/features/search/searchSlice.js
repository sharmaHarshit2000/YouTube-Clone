import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchVideosAPI } from "./searchAPI";

// Async thunk for searching videos
export const searchVideos = createAsyncThunk(
  "videos/searchVideos",
  async (searchTerm, thunkAPI) => {
    try {
      const res = await searchVideosAPI(searchTerm);
      return res;
    } catch (err) {
      // Forward error message to the reducer
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    term: "",             // Current search term entered by user
    searchLoading: false, // Show loading spinner
    searchResults: [],    // Matched videos from search
    searchError: null,    // To display any fetch-related errors
  },
  reducers: {
    // Set the search term when user types
    setSearchTerm: (state, action) => {
      state.term = action.payload;
    },
    // Clear state on reset or route change
    clearSearchTerm: (state) => {
      state.term = "";
      state.searchResults = [];
      state.searchError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // When search begins
      .addCase(searchVideos.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
        state.searchResults = []; // Clear old results while loading
      })

      // When search completes successfully
      .addCase(searchVideos.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })

      // On search error
      .addCase(searchVideos.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload;
      });
  },
});

export const { setSearchTerm, clearSearchTerm } = searchSlice.actions;
export default searchSlice.reducer;
