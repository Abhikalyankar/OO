import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../../utils/constants";
import { getAPI, patchAPI, postAPI } from "../../axios/utils";
import { BASE_URL2 } from "../../utils/constants";
import { logToLocalStorage } from "../../utils/logger";

export const login = createAsyncThunk("auth/login", async (data: Record<string, any>, thunkAPI) => {
  console.log("Login request data1:", data.data);
  logToLocalStorage("Login request data1", data);
  console.log("Login request 001", data);
  try {
    const resp= await postAPI(`${BASE_URL2}/get-token/`, {
      ...data,
    });
    logToLocalStorage("after login", data);
    console.log("after login:", resp);
    return resp;
  } catch (error: any ) {
    console.error("Login failed:", error.response);
    logToLocalStorage("Login request data1", data);
    return thunkAPI.rejectWithValue({ error: error.response  });
  }
});

export const logout = createAsyncThunk("auth/logout", async (_,thunkAPI) => {
  try {
    // return await postAPI(`${BASE_URL}/auth/accounts/logout/`, data);
  } catch (error:any) {
    return thunkAPI.rejectWithValue({ error: error.response });
  }
});

export const register = createAsyncThunk("auth/register", async (data: Record<string, any>, thunkAPI) => {
  console.log("Login request data:", data);
  try {
    return await postAPI(`${BASE_URL2}/auth/accounts/register/`, {
      ...data,
    });
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.response });
  }
});