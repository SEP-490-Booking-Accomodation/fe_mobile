import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar, ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SplashScreen from "../screens/begin/SplashScreen";
import OnboardingScreen from "../screens/begin/OnboardingScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import HomeScreen from "../screens/home/HomeScreen";
import SearchScreen from "../screens/search/SearchScreen";
import SearchResult from "../screens/search/SearchResult";
import VerifyByScreen from "../screens/auth/VerifyByScreen";
import OTPVerificationScreen from "../screens/auth/OTPVerificationScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen";
import DetailRentalLocationScreen from "../screens/rentalLocation/DetailRentalLocationScreen";
import AccomodationDetailScreen from "../screens/accomodation/AccomodationDetailScreen";
import PolicyScreen from "../screens/policies/PolicyScreen";
import PolicyDetailScreen from "../screens/policies/PolicyDetailScreen";
import MapScreen from "../screens/map/MapScreen";
import MessagesScreen from "../screens/chat/MessagesScreen";
import ChatScreen from "../screens/chat/ChatScreen";
import ConfirmBooking from "../screens/booking/ConfirmBooking";
import PaymentConfirm from "../screens/payment/PaymentConfirm";
import PaymentSuccess from "../screens/payment/PaymentSuccess";
import WalletScreen from "../screens/wallet/WalletScreen";
import PaymentMethod from "../screens/payment/PaymentMethod";

const Stack = createNativeStackNavigator();

const AppStack = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkAppState = async () => {
      try {
        const userToken = await AsyncStorage.getItem("userToken");

        if (userToken) {
          setInitialRoute("AppDrawer");
        } else {
          setInitialRoute("Login");
        }
      } catch (error) {
        console.error("Error loading app state:", error);
        setInitialRoute("Login");
      }
    };

    checkAppState();
  }, []);

  if (initialRoute === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <>
      <StatusBar animated={true} />
      <Stack.Navigator
        initialRouteName="PaymentMethod"
        screenOptions={{ gestureEnabled: true }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VerifyBy"
          component={VerifyByScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OTPVerification"
          component={OTPVerificationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SearchResult"
          component={SearchResult}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DetailRentalLocation"
          component={DetailRentalLocationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DetailAccomodation"
          component={AccomodationDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Policies"
          component={PolicyScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PolicyDetail"
          component={PolicyDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ConfirmBooking"
          component={ConfirmBooking}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PaymentConfirm"
          component={PaymentConfirm}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="PaymentSuccess"
          component={PaymentSuccess}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Messages"
          component={MessagesScreen}
          options={{ headerShown: true, title: "Nhắn tin" }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{ headerShown: false, title: "Tin nhắn" }}
        />
        <Stack.Screen
          name="Wallet"
          component={WalletScreen}
          options={{ headerShown: true, title: "Ví Mean" }}
        />
        <Stack.Screen
          name="PaymentMethod"
          component={PaymentMethod}
          options={{ headerShown: true, title: "Payment Method" }}
        />
      </Stack.Navigator>
    </>
  );
};

export default AppStack;
