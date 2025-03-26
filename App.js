import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { Alert, StatusBar } from "react-native";
import { AsyncStorageProvider } from "./context/AsyncStorageContext";
import AppStack from "./navigator/AppStack";
import { StripeProvider } from "@stripe/stripe-react-native";
import { STRIPE_PUBLIC_KEY } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout, refreshToken, restoreAuth } from "./redux/authSlice";
import store from "./redux/store";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useRefreshTokenWithParamMutation } from "./api/authApi";

export default function App() {
  return (
    <Provider store={store}>
      <StripeProvider publishableKey={STRIPE_PUBLIC_KEY}>
        <StatusBar animated={true} />
        <NavigationContainer>
          <AsyncStorageProvider>
            <AuthLoader />
            <AppStack />
          </AsyncStorageProvider>
        </NavigationContainer>
      </StripeProvider>
    </Provider>
  );
}

const AuthLoader = () => {
  const dispatch = useDispatch();
  const [useRefreshToken] = useRefreshTokenWithParamMutation();

  useEffect(() => {
    const checkAuth = async () => {
      const authData = await AsyncStorage.getItem("authData");
      // console.log("authData", authData);
      const parsedAuthData = JSON.parse(authData);

      const isAuth = parsedAuthData.isAuth || false;
      if (isAuth === false) {
        dispatch(logout());
        console.log("Đã đăng xuất");
      } else if (authData) {
        // console.log("Đã đăng nhập");
        const { userId, token, isAuth, userData, refreshToken } =
          JSON.parse(authData);
        dispatch(
          restoreAuth({ userId, token, isAuth, userData, refreshToken })
        );
      }

      try {
        const token = parsedAuthData.token;
        // console.log("Token cũ:", token);

        const decodedToken = jwtDecode(token);
        const currentUnixTime = dayjs().unix();
        if (decodedToken.exp < currentUnixTime) {
          console.log("Token đã hết hạn, tiến hàn refresh Token...");
          const refreshData = { refreshToken: parsedAuthData.refreshToken };
          const response = await useRefreshToken({
            data: refreshData,
          }).unwrap();
          dispatch(refreshToken(response.accessToken));
        } else {
          console.log("Token còn hạn sử dụng.");
        }
      } catch (error) {
        console.error("Lỗi khi decode token:", error);
        Alert.alert("Phiên đăng nhập hết hạn");
        dispatch(logout());
      }
    };
    checkAuth();
  }, [dispatch]);

  return null;
};
