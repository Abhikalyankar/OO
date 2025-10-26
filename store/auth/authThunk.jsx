import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL, BASE_URL2 } from "../../app/utils/constants";
import { getAPI, patchAPI, postAPI } from "../../app/axios/utils";
import { logToLocalStorage } from "../../app/utils/logger";

export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  console.log("Login request data1:", data.data);
  logToLocalStorage("Login request data1", data);
  console.log("Login request 001", data);
  try {
    const resp = await postAPI(`${BASE_URL2}/get-token/`, {
      ...data,
    });
    logToLocalStorage("after login", data);
    console.log("after login:", resp);
    return resp;
  } catch (error) {
    console.error("Login failed:", error.response);
    logToLocalStorage("Login request data1", data);
    return thunkAPI.rejectWithValue({ error: error.response });
  }
});

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    // Uncomment and add data if needed:
    // return await postAPI(`${BASE_URL}/auth/accounts/logout/`, data);
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error.response });
  }
});

export const register = createAsyncThunk("auth/register", async (data, thunkAPI) => {
  console.log("Registration request data:", data);
  try {
    return await postAPI(`${BASE_URL2}/api/users/register2/`, {
      ...data,
    });
  } catch (error) {
    return thunkAPI.rejectWithValue({ error: error.response });
  }
});
