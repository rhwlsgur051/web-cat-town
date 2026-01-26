import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 세션 스토리지에 저장될 상태 (브라우저 닫으면 삭제)
interface SessionState {
  isLoggedIn: boolean;
  tempData: any;
}

const initialState: SessionState = {
  isLoggedIn: false,
  tempData: null,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setLogin(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
    },
    setTempData(state, action: PayloadAction<any>) {
      state.tempData = action.payload;
    },
    clearSession(state) {
      state.isLoggedIn = false;
      state.tempData = null;
    },
  },
});

export const { setLogin, setTempData, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
