import { configureStore } from "@reduxjs/toolkit";
import noticeCore from "./notice.core";
import userCore from "./user.core";

const store = configureStore({
  reducer: {
    notice: noticeCore,
    user: userCore,
  },
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store.getState;
export default store;
