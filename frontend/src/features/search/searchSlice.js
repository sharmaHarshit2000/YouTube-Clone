import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchVideosAPI } from "./searchAPI";

export const searchVideos = createAsyncThunk(
  "videos/searchVideos",
  async (searchTerm, thunkAPI) => {
    try {
      const res = await searchVideosAPI(searchTerm);
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: {
    term: "",
    searchLoading: false,
    searchResults: [],
    searchError: null,
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.term = action.payload;
    },
    clearSearchTerm: (state) => {
      state.term = "";
      state.searchResults = [];
      state.searchError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchVideos.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
        state.searchResults = [];
      })
      .addCase(searchVideos.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchVideos.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload;
      });
  },
});

export const { setSearchTerm, clearSearchTerm } = searchSlice.actions;
export default searchSlice.reducer;