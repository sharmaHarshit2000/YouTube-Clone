import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./authAPI";
import { clearChannelState } from "../channel/channelSlice";

// Helper function to extract error message from API response or fall back to a default
const getErrorMessage = (error, fallback = "Something went wrong") =>
  error.response?.data?.message || fallback;

// Thunks 

// Register thunk that sends multipart form data (including file if any)
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, thunkAPI) => {
    try {
      const res = await api.register(formData);
      const { token, user } = res.data;

      // Save token to localStorage for persistent login
      if (token) localStorage.setItem("token", token);

      return user;
    } catch (error) {
      // Gracefully handle and forward error
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Registration failed"));
    }
  }
);

// Login thunk
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, thunkAPI) => {
    try {
      const res = await api.login(formData);
      const { token, user } = res.data;

      // Save token to localStorage on successful login
      if (token) localStorage.setItem("token", token);

      // Clear any existing channel-related state after login
      thunkAPI.dispatch(clearChannelState());

      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Login failed"));
    }
  }
);

// Fetch current authenticated user
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, thunkAPI) => {
    try {
      const res = await api.getMe(); // Uses stored JWT for auth
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to fetch user"));
    }
  }
);

// Logout thunk
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    // Remove token and reset dependent state
    localStorage.removeItem("token");
    thunkAPI.dispatch(clearChannelState());
    return;
  }
);

// Slice

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Clears any error in the auth state 
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //  Register Lifecycle
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Set registered user
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Set error message
      })

      // Login Lifecycle
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Set logged-in user
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Current User Lifecycle 
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Set user from token
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        // Clear user state and flags on logout
        state.user = null;
        state.error = null;
        state.loading = false;
      });
  },
});

export const { resetError } = authSlice.actions;
export default authSlice.reducer;
