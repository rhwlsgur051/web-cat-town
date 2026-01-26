import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// localStorage에 저장될 상태 (영구 저장)
interface UserState {
  email: string | null;
  name: string | null;
}

const initialState: UserState = {
  email: null,
  name: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ id: string; email: string; name: string }>) {
      state.email = action.payload.email;
      state.name = action.payload.name;
    },
    clearUser(state) {
      state.email = null;
      state.name = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;