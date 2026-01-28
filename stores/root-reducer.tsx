import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import userReducer from "./user-slice";
import sessionReducer from "./session-slice";
import { localStorage, sessionStorage } from "./storage";

// localStorage persist 설정 (영구 저장)
const userPersistConfig = {
  key: "user",
  storage: localStorage,
  whitelist: ["userId", "userEmail", "userName"], // 저장할 필드
};

// sessionStorage persist 설정 (세션 저장)
const sessionPersistConfig = {
  key: "session",
  storage: sessionStorage,
  whitelist: ["isLoggedIn", "tempData"], // 저장할 필드
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  session: persistReducer(sessionPersistConfig, sessionReducer),
});

export default rootReducer;