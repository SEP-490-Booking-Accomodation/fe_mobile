import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthen: false,
    userId: null,
    token: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      const { userId, token } = action.payload;
      state.isAuthen = true;
      state.userId = userId;
      state.token = token;

      // Lưu vào AsyncStorage
      AsyncStorage.setItem("authData", JSON.stringify({ userId, token }));
    },
    logout: (state) => {
      state.isAuthen = false;
      state.userId = null;
      state.token = null;

      // Xóa dữ liệu khỏi AsyncStorage
      AsyncStorage.removeItem("authData");
    },
    restoreAuth: (state, action) => {
      const { userId, token } = action.payload;
      state.isAuthen = true;
      state.userId = userId;
      state.token = token;
    },
  },
});

export const { loginSuccess, logout, restoreAuth } = authSlice.actions;
export default authSlice.reducer;
