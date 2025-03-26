import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuth: false,
    userId: null,
    token: null,
    userData: null,
    refreshToken: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      const { isAuth, userId, token, userData, refreshToken } = action.payload;
      state.isAuth = isAuth;
      state.userId = userId;
      state.token = token;
      state.userData = userData;
      state.refreshToken = refreshToken;

      // Lưu vào AsyncStorage
      AsyncStorage.setItem(
        "authData",
        JSON.stringify({ isAuth, userId, token, userData, refreshToken })
      );
    },
    logout: (state) => {
      state.isAuth = false;
      state.userId = null;
      state.token = null;
      state.userData = null;
      state.refreshToken = null;

      // Xóa dữ liệu khỏi AsyncStorage
      AsyncStorage.removeItem("authData");
    },
    restoreAuth: (state, action) => {
      const { userId, token, userData, refreshToken } = action.payload;
      state.isAuth = true;
      state.userId = userId;
      state.token = token;
      state.userData = userData;
      state.refreshToken = refreshToken;
    },
    refreshToken: (state, action) => {
      state.token = action.payload;
      // Update token in AsyncStorage
      AsyncStorage.getItem("authData").then((data) => {
        if (data) {
          const authData = JSON.parse(data);
          authData.token = action.payload;
          AsyncStorage.setItem("authData", JSON.stringify(authData));
        }
      });
    },
  },
});

export const { loginSuccess, logout, restoreAuth, refreshToken } =
  authSlice.actions;
export default authSlice.reducer;
