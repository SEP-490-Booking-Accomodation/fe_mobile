import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { Alert, Linking, StatusBar } from "react-native";
import { AsyncStorageProvider } from "./context/AsyncStorageContext";
import AppStack from "./navigator/AppStack";
import { STRIPE_PUBLIC_KEY } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout, refreshToken, restoreAuth } from "./redux/authSlice";
import store from "./redux/store";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import { useRefreshTokenWithParamMutation } from "./api/authApi";
import { I18nextProvider } from "react-i18next";
import i18n from "./utils/i18n";

export default function App() {
  useEffect(() => {
    // Xử lý deep link khi ứng dụng đang chạy
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Kiểm tra nếu ứng dụng được mở bằng deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleDeepLink = ({ url }) => {
    if (url) {
      // Phân tích URL để lấy thông tin từ callback
      const route = url.replace(/.*?:\/\//g, "");

      // Kiểm tra nếu đây là callback thanh toán
      if (route.includes("payment/callback")) {
        const params = route.split("?")[1];

        if (params) {
          const paramsObj = params.split("&").reduce((prev, curr) => {
            const [key, value] = curr.split("=");
            prev[key] = value;
            return prev;
          }, {});

          // Xử lý theo trạng thái thanh toán
          if (paramsObj.status === "success") {
            // Hiển thị thông báo hoàn thành thanh toán
            Alert.alert("Thành công", "Thanh toán hoàn tất!");

            // Cập nhật lại dữ liệu đặt phòng nếu cần
            // Có thể dispatch một action để refresh dữ liệu đặt phòng
          }
        }
      }
    }
  };
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <StatusBar animated={true} />
        <NavigationContainer>
          <AsyncStorageProvider>
            <AuthLoader />
            <AppStack />
          </AsyncStorageProvider>
        </NavigationContainer>
      </I18nextProvider>
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
        const { userId, token, isAuth, userData, refreshToken, customerId } =
          JSON.parse(authData);
        dispatch(
          restoreAuth({
            userId,
            token,
            isAuth,
            userData,
            refreshToken,
            customerId,
          })
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
        // console.error("Lỗi khi decode token:", error);
        Alert.alert("Phiên đăng nhập hết hạn");
        dispatch(logout());
      }
    };
    checkAuth();
  }, [dispatch]);

  return null;
};
