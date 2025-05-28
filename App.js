import React, { useEffect, useRef } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { Alert, Linking, StatusBar, Platform, UIManager, View, Text, TouchableOpacity } from "react-native";
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
import { useSocket } from './hooks/useSocket';
import Toast from 'react-native-toast-message';
import SocketService from './services/socketService';
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const navigationRef = useRef();

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
          }
        }
      }
    }
  };

  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <StatusBar animated={true} />
        <NavigationContainer
          ref={navigationRef}
          onReady={() => {
            SocketService.setNavigationRef(navigationRef);
          }}
        >
          <AsyncStorageProvider>
            <GlobalSocketHandler navigationRef={navigationRef} />
            <AuthLoader />
            <AppStack />
          </AsyncStorageProvider>
        </NavigationContainer>
        <Toast config={toastConfig} position="top" />
      </I18nextProvider>
    </Provider>
  );
}

const GlobalSocketHandler = ({ navigationRef }) => {
  const { isConnected } = useSocket();
  const userId = useSelector((state) => state.auth?.userId);
  const isAuth = useSelector((state) => state.auth?.isAuth);

  useEffect(() => {
    console.log('Socket connection status:', isConnected);
    SocketService.setNavigationRef(navigationRef);

    // Kết nối socket khi có userId và đã xác thực
    if (isAuth && userId && !isConnected) {
      SocketService.connect(userId);
    }

    // Ngắt kết nối khi đăng xuất
    if (!isAuth && isConnected) {
      SocketService.disconnect();
    }
  }, [isConnected, navigationRef, userId, isAuth]);

  return null;
};

const toastConfig = {
  info: ({ text1, text2, props }) => (
    <TouchableOpacity
      style={{
        backgroundColor: '#4B7BF5',
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
      onPress={props.onPress}
    >
      <Ionicons name="notifications" size={24} color="white" />
      <View style={{ marginLeft: 15, flex: 1 }}>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{text1}</Text>
        {text2 && (
          <Text style={{ color: 'white', marginTop: 2, fontSize: 14 }}>{text2}</Text>
        )}
      </View>
    </TouchableOpacity>
  ),
  success: ({ text1, text2, props }) => (
    <TouchableOpacity
      style={{
        backgroundColor: '#10B981',
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
      onPress={props.onPress}
    >
      <Ionicons name="checkmark-circle" size={24} color="white" />
      <View style={{ marginLeft: 15, flex: 1 }}>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{text1}</Text>
        {text2 && (
          <Text style={{ color: 'white', marginTop: 2, fontSize: 14 }}>{text2}</Text>
        )}
      </View>
    </TouchableOpacity>
  ),
  error: ({ text1, text2, props }) => (
    <TouchableOpacity
      style={{
        backgroundColor: '#EF4444',
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
      onPress={props.onPress}
    >
      <Ionicons name="close-circle" size={24} color="white" />
      <View style={{ marginLeft: 15, flex: 1 }}>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{text1}</Text>
        {text2 && (
          <Text style={{ color: 'white', marginTop: 2, fontSize: 14 }}>{text2}</Text>
        )}
      </View>
    </TouchableOpacity>
  ),
};

const AuthLoader = () => {
  const dispatch = useDispatch();
  const [useRefreshToken] = useRefreshTokenWithParamMutation();
  const userId = useSelector((state) => state.auth?.userId);
  const isAuth = useSelector((state) => state.auth?.isAuth);

  useEffect(() => {
    const checkAuth = async () => {
      const authData = await AsyncStorage.getItem("authData");
      const parsedAuthData = JSON.parse(authData);

      const isAuth = parsedAuthData?.isAuth || false;
      if (isAuth === false) {
        dispatch(logout());
        console.log("Đã đăng xuất");
      } else if (authData) {
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
        const token = parsedAuthData?.token;
        if (!token) return;

        const decodedToken = jwtDecode(token);
        const currentUnixTime = dayjs().unix();
        if (decodedToken.exp < currentUnixTime) {
          console.log("Token đã hết hạn, tiến hành refresh Token...");
          const refreshData = { refreshToken: parsedAuthData.refreshToken };
          const response = await useRefreshToken({
            data: refreshData,
          }).unwrap();
          dispatch(refreshToken(response.accessToken));
        } else {
          console.log("Token còn hạn sử dụng.");
        }
      } catch (error) {
        Alert.alert("Phiên đăng nhập hết hạn");
        dispatch(logout());
      }
    };
    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    console.log('Auth status changed:', { userId, isAuth });
  }, [userId, isAuth]);

  return null;
};