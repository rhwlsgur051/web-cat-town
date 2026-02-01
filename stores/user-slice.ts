import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// localStorage에 저장될 상태 (영구 저장)
interface UserState {
  userNo: number | null;
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
  userAvatarUrl: string | null;
}

const initialState: UserState = {
  userNo: null,
  userId: null,
  userEmail: null,
  userName: null,
  userAvatarUrl: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ userNo: number; userId: string; userEmail: string; userName: string; userAvatarUrl?: string }>) {
      state.userNo = action.payload.userNo;
      state.userId = action.payload.userId;
      state.userEmail = action.payload.userEmail;
      state.userName = action.payload.userName;
      state.userAvatarUrl = action.payload.userAvatarUrl || null;
    },
    updateUserAvatar(state, action: PayloadAction<string | null>) {
      state.userAvatarUrl = action.payload;
    },
    clearUser(state) {
      state.userNo = null;
      state.userId = null;
      state.userEmail = null;
      state.userName = null;
      state.userAvatarUrl = null;
    },
  },
});

export const { setUser, updateUserAvatar, clearUser } = userSlice.actions;
export default userSlice.reducer;