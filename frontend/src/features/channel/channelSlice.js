import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createChannelAPI,
  fetchChannelAPI,
  updateChannelAPI,
  deleteChannelAPI,
  toggleSubscription,
} from "./channelAPI";
import { fetchUser } from "../auth/authSlice";

// Create Channel
export const createChannel = createAsyncThunk(
  "channel/createChannel",
  async (formData, thunkAPI) => {
    try {
      const response = await createChannelAPI(formData);
      await thunkAPI.dispatch(fetchUser());
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Error creating channel"
      );
    }
  }
);

// Get channel + its videos
export const getChannel = createAsyncThunk(
  "channel/getChannel",
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const loggedInUserId = state.auth?.user?._id;

      const response = await fetchChannelAPI(id);
      const isMyChannel =
        response?.channel?.owner?._id &&
        response.channel.owner._id === loggedInUserId;

      return {
        channel: response.channel,
        videos: response.videos || [],
        isMyChannel,
      };
    } catch (err) {
      if (err.response?.status === 404) {
        return thunkAPI.rejectWithValue("404");
      }
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Error fetching channel"
      );
    }
  }
);

export const updateChannel = createAsyncThunk(
  "channel/updateChannel",
  async ({ id, updateData }, thunkAPI) => {
    try {
      const response = await updateChannelAPI({ id, updateData });
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Error updating channel"
      );
    }
  }
);

export const deleteChannel = createAsyncThunk(
  "channel/deleteChannel",
  async (id, thunkAPI) => {
    try {
      const response = await deleteChannelAPI(id);
      await thunkAPI.dispatch(fetchUser());
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Error deleting channel"
      );
    }
  }
);

// Subscription toggle thunks
export const subscribeToChannel = createAsyncThunk(
  "channel/subscribe",
  async (channelId, { rejectWithValue }) => {
    try {
      const data = await toggleSubscription(channelId);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Error subscribing"
      );
    }
  }
);

export const unsubscribeFromChannel = createAsyncThunk(
  "channel/unsubscribe",
  async (channelId, { rejectWithValue }) => {
    try {
      const data = await toggleSubscription(channelId);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Error unsubscribing"
      );
    }
  }
);

const channelSlice = createSlice({
  name: "channel",
  initialState: {
    currentChannel: null,
    myChannel: null,
    videos: [],
    loading: false,
    subscriptionLoading: false,
    error: null,
  },
  reducers: {
    clearChannelState: (state) => {
      state.currentChannel = null;
      state.videos = [];
      state.error = null;
      state.loading = false;
      state.myChannel = null;
    },
    setCurrentChannel: (state, action) => {
      state.currentChannel = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChannel = action.payload;
        state.myChannel = action.payload;
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Get
      .addCase(getChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChannel.fulfilled, (state, action) => {
        state.loading = false;
        const { channel, videos, isMyChannel } = action.payload;
        state.currentChannel = channel;
        state.videos = videos;
        if (isMyChannel) {
          state.myChannel = channel;
        }
      })
      .addCase(getChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Update
      .addCase(updateChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateChannel.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChannel = action.payload;
      })
      .addCase(updateChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Delete
      .addCase(deleteChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChannel.fulfilled, (state) => {
        state.loading = false;
        state.currentChannel = null;
        state.myChannel = null;
        state.videos = [];
      })
      .addCase(deleteChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // Subscribe
      .addCase(subscribeToChannel.pending, (state) => {
        state.subscriptionLoading = true;
        state.error = null;
      })
      .addCase(subscribeToChannel.fulfilled, (state, action) => {
        state.subscriptionLoading = false;
        if (!state.currentChannel) return;

        const { subscribers, subscribersList } = action.payload;

        // Handle both possible channel structures
        state.currentChannel = {
          ...state.currentChannel,
          ...(state.currentChannel.channel
            ? {
                channel: {
                  ...state.currentChannel.channel,
                  subscribers,
                  subscribersList,
                },
              }
            : {
                subscribers,
                subscribersList,
              }),
          subscribers,
          subscribersList,
        };
      })
      .addCase(subscribeToChannel.rejected, (state, action) => {
        state.subscriptionLoading = false;
        state.error = action.payload || action.error.message;
      })

      // Unsubscribe
      .addCase(unsubscribeFromChannel.pending, (state) => {
        state.subscriptionLoading = true;
        state.error = null;
      })
      .addCase(unsubscribeFromChannel.fulfilled, (state, action) => {
        state.subscriptionLoading = false;
        if (!state.currentChannel) return;

        const { subscribers, subscribersList } = action.payload;

        // Handle both possible channel structures
        state.currentChannel = {
          ...state.currentChannel,
          ...(state.currentChannel.channel
            ? {
                channel: {
                  ...state.currentChannel.channel,
                  subscribers,
                  subscribersList,
                },
              }
            : {
                subscribers,
                subscribersList,
              }),
          subscribers,
          subscribersList,
        };
      })
      .addCase(unsubscribeFromChannel.rejected, (state, action) => {
        state.subscriptionLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearChannelState, setCurrentChannel } = channelSlice.actions;
export default channelSlice.reducer;
