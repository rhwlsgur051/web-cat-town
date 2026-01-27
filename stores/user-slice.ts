import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// localStorage에 저장될 상태 (영구 저장)
interface UserState {
  userId: string | null;
  userEmail: string | null;
  userName: string | null;
}

const initialState: UserState = {
  userId: null,
  userEmail: null,
  userName: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ userId: string; userEmail: string; userName: string }>) {
      state.userId = action.payload.userId;
      state.userEmail = action.payload.userEmail;
      state.userName = action.payload.userName;
    },
    clearUser(state) {
      state.userId = null;
      state.userEmail = null;
      state.userName = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;