// src/redux/friendsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api"; // your axios instance with token interceptor

// thunks
export const fetchFriendStatus = createAsyncThunk(
  "friends/fetchStatus",
  async (targetUserId, thunkAPI) => {
    const res = await api.get(`/api/friends/status/${targetUserId}`);
    return res.data; // { status: "not_friends" | "request_sent" | "request_received" | "friends" }
  }
);

export const sendFriendRequest = createAsyncThunk(
  "friends/send",
  async (targetUserId, thunkAPI) => {
    const res = await api.post(`/api/friends/send/${targetUserId}`);
    return { targetUserId, message: res.data };
  }
);

export const cancelFriendRequest = createAsyncThunk(
  "friends/cancel",
  async (targetUserId, thunkAPI) => {
    const res = await api.post(`/api/friends/cancel/${targetUserId}`);
    return { targetUserId, message: res.data };
  }
);

export const acceptFriendRequest = createAsyncThunk(
  "friends/accept",
  async (targetUserId, thunkAPI) => {
    const res = await api.post(`/api/friends/accept/${targetUserId}`);
    return { targetUserId, message: res.data };
  }
);

export const rejectFriendRequest = createAsyncThunk(
  "friends/reject",
  async (targetUserId, thunkAPI) => {
    const res = await api.post(`/api/friends/reject/${targetUserId}`);
    return { targetUserId, message: res.data };
  }
);

export const unfriendUser = createAsyncThunk(
  "friends/unfriend",
  async (targetUserId, thunkAPI) => {
    const res = await api.post(`/api/friends/unfriend/${targetUserId}`);
    return { targetUserId, message: res.data };
  }
);

// slice
const friendsSlice = createSlice({
  name: "friends",
  initialState: {
    statusByUser: {}, // map: userId -> status string
    loading: false,
    error: null,
  },
  reducers: {
    // optional local helpers
    setStatusLocally: (state, action) => {
      const { userId, status } = action.payload;
      state.statusByUser[userId] = status;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchFriendStatus
      .addCase(fetchFriendStatus.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchFriendStatus.fulfilled, (s, action) => {
        s.loading = false;
        s.statusByUser[action.meta.arg] = action.payload.status;
      })
      .addCase(fetchFriendStatus.rejected, (s, action) => {
        s.loading = false;
        s.error = action.error.message;
      })

      // send
      .addCase(sendFriendRequest.fulfilled, (s, action) => {
        s.statusByUser[action.payload.targetUserId] = "request_sent";
      })
      .addCase(cancelFriendRequest.fulfilled, (s, action) => {
        s.statusByUser[action.payload.targetUserId] = "not_friends";
      })
      .addCase(acceptFriendRequest.fulfilled, (s, action) => {
        s.statusByUser[action.payload.targetUserId] = "friends";
      })
      .addCase(rejectFriendRequest.fulfilled, (s, action) => {
        s.statusByUser[action.payload.targetUserId] = "not_friends";
      })
      .addCase(unfriendUser.fulfilled, (s, action) => {
        s.statusByUser[action.payload.targetUserId] = "not_friends";
      });
  },
});

export const { setStatusLocally } = friendsSlice.actions;
export default friendsSlice.reducer;
