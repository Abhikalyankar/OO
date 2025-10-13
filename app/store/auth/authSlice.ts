import { createSlice } from "@reduxjs/toolkit";
import {
  login,
  logout
} from "./authThunk";
import TokenService from "../../axios/tokenService";

export interface AuthInitialState {
  isLoading: boolean;
  token: string | null;
  currentUser: Record<string, any> | null;
  isAuthenticated: boolean;
}

const authInitialState: AuthInitialState = {
  isLoading: false,
  token: TokenService.getToken(),
  currentUser: TokenService.getCurrentUser(),
  isAuthenticated: !!TokenService.getToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
        TokenService.setToken(action.payload.data.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
      });

  
    builder
    .addCase(logout.pending, (state, action) => {
      TokenService.removeToken()
      TokenService.removeCurrentUser();
      state.isLoading = true;
      state.isAuthenticated = false;
     
    })
    .addCase(logout.fulfilled, (state, action) => {
      state.isLoading = false;
    })
    .addCase(logout.rejected, (state, action) => {
      // console.log("Logout failed", action.error);
      state.isLoading = false;
    });
  },
});

export const authActions = authSlice.actions;

export default authSlice;