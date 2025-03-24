import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuth: false,
    userId: null,
    token: null,
    userData: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      const { isAuth, userId, token, userData } = action.payload;
      state.isAuth = isAuth;
      state.userId = userId;
      state.token = token;
      state.userData = userData;

      // Lưu vào AsyncStorage
      AsyncStorage.setItem(
        "authData",
        JSON.stringify({ isAuth, userId, token, userData })
      );
    },
    logout: (state) => {
      state.isAuth = false;
      state.userId = null;
      state.token = null;
      state.userData = null;

      // Xóa dữ liệu khỏi AsyncStorage
      AsyncStorage.removeItem("authData");
    },
    restoreAuth: (state, action) => {
      const { isAuth, userId, token, userData } = action.payload;
      state.isAuth = true;
      state.userId = userId;
      state.token = token;
      state.userData = userData;
    },
  },
});

export const { loginSuccess, logout, restoreAuth } = authSlice.actions;
export default authSlice.reducer;
