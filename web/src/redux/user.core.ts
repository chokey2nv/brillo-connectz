import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "graphql.queries/types";
import { RootState } from "./store";

export interface NoticeState {
  open: boolean;
  message: any;
  type: string | undefined;
  onClose?: Function | undefined;
  duration?: number;
}
export type DisplayNoticeState = Pick<NoticeState, "type" | "message">;
const initialState: Partial<IUser> = {};
export type NoticePayload = Omit<NoticeState, "open">;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<IUser>>) => {
      state = action.payload;
      return state;
    },
  },
});

export const { setUser } = userSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
