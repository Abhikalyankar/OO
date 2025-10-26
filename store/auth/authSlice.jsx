import { createSlice } from "@reduxjs/toolkit";
import { login, logout } from "./authThunk";
import TokenService from "../../app/axios/tokenService";

const authInitialState = {
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
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
        TokenService.setToken(action.payload.data.token);
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
      });

    builder
      .addCase(logout.pending, (state) => {
        TokenService.removeToken();
        TokenService.removeCurrentUser();
        state.isLoading = true;
        state.isAuthenticated = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const authActions = authSlice.actions;

export default authSlice;
