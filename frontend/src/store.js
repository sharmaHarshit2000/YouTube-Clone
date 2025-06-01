import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import channelReducer from "./features/channel/channelSlice";
import videoReducer from "./features/video/videoSlice";
import commentReducer from "./features/comments/commentSlice";
import searchReducer from "./features/search/searchSlice";
import uiReducer from "./features/ui/uiSlice";
export default configureStore({
  reducer: {
    auth: authReducer,
    channel: channelReducer,
    videos: videoReducer,
    comments: commentReducer,
    search: searchReducer,
    ui: uiReducer,
  },
});
