import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  StatusBar,
  ActivityIndicator,
  View,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

// Begin Screens
import SplashScreen from "../screens/begin/SplashScreen";
import OnboardingScreen from "../screens/begin/OnboardingScreen";

// Auth Screens
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import VerifyByScreen from "../screens/auth/VerifyByScreen";
import OTPVerificationScreen from "../screens/auth/OTPVerificationScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen";

// Main Screens
import HomeScreen from "../screens/home/HomeScreen";
import SearchScreen from "../screens/search/SearchScreen";
import SearchResult from "../screens/search/SearchResult";
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
import WalletScreen from "../screens/profile/childPage/WalletScreen";
import PaymentMethod from "../screens/payment/PaymentMethod";
import NotificationScreen from "../screens/notification/Notification";
import SettingList from "../screens/setting/SettingList";
import ProfileScreen from "../screens/profile/ProfileScreen";
import EditInfo from "../screens/profile/childPage/EditInfo";
import ChangePassword from "../screens/profile/childPage/ChangePassword";
import FavouriteList from "../screens/profile/childPage/FavouriteList";
import HistoryScreen from "../screens/profile/childPage/HistoryScreen";
import RatingHistory from "../screens/profile/childPage/RatingHistory";
// import ActivitiesScreen from "../screens/activities/ActivitiesScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Screens where we want to hide the tab bar
const hideTabBarScreens = [
  "SearchScreen",
  "SearchResult",
  "DetailRentalLocation",
  "DetailAccomodation",
  "ConfirmBooking",
  "PaymentConfirm",
  "PaymentSuccess",
  "Chat",
  "Policies",
  "PolicyDetail",
  "MapScreen",
];

// Default tab bar style
const defaultTabBarStyle = {
  backgroundColor: "#1C1C1E",
  borderTopWidth: 0,
  elevation: 0,
  height: 60,
  paddingBottom: 8,
  paddingTop: 8,
};

// Home Stack Navigator
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="SearchResult" component={SearchResult} />
      <Stack.Screen
        name="DetailRentalLocation"
        component={DetailRentalLocationScreen}
      />
      <Stack.Screen
        name="DetailAccomodation"
        component={AccomodationDetailScreen}
      />
      <Stack.Screen name="Policies" component={PolicyScreen} />
      <Stack.Screen name="PolicyDetail" component={PolicyDetailScreen} />
      <Stack.Screen name="ConfirmBooking" component={ConfirmBooking} />
      <Stack.Screen name="PaymentConfirm" component={PaymentConfirm} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
    </Stack.Navigator>
  );
};

// Messages Stack Navigator
const MessageStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MessagesScreen"
        component={MessagesScreen}
        options={{ title: "Nhắn tin" }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Custom Tab Button Component for Map
const TabBarAdvancedButton = ({ bgColor, ...props }) => (
  <View
    style={{
      top: -20,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <TouchableOpacity
      {...props}
      style={{
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#4B7BF5",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 4,
        borderColor: bgColor,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <Ionicons name="map" size={28} color="#FFFFFF" />
    </TouchableOpacity>
  </View>
);

// Bottom Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: (() => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "";
          if (hideTabBarScreens.includes(routeName)) {
            return { display: "none" };
          }
          return {
            position: "absolute",
            bottom: 40,
            left: 20,
            right: 20,
            backgroundColor: "#1C1C1E",
            borderRadius: 30,
            height: 60,
            paddingHorizontal: 20,
            paddingVertical: 20,
            borderTopWidth: 0,
            elevation: 0,
            marginHorizontal: 20,
          };
        })(),
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#8E8E93",
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarItemStyle: {
          height: 40,
          width: 40,
          borderRadius: 20,
          marginTop: 10,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarLabelStyle: {
          display: "none",
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessageStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={28} color="#FFFFFF" />
          ),
          tabBarButton: (props) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                {...props}
                style={{
                  position: "absolute",
                  bottom: -30,
                  height: 70,
                  width: 70,
                  borderRadius: 35,
                  backgroundColor: "#4B7BF5",
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#000",
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  elevation: 5,
                  borderWidth: 4,
                  borderColor: "#FFFFFF",
                }}
              >
                <Ionicons name="map" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Activities"
        component={SettingList}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="local-activity" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingList}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main App Stack
const AppStack = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    // const checkAppState = async () => {
    //   try {
    //     const userToken = await AsyncStorage.getItem("userToken");
    //     setInitialRoute(userToken ? "MainTabs" : "Login");
    //   } catch (error) {
    //     console.error("Error loading app state:", error);
    //     setInitialRoute("Login");
    //   }
    // };

    const checkAppState = async () => {
      setInitialRoute("MainTabs"); // Mặc định vào trang Home
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
        initialRouteName={initialRoute}
        screenOptions={{ gestureEnabled: true }}
      >
        {/* Begin Screens */}
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

        {/* Auth Screens */}
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

        {/* Main Tab Navigation */}
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
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
        <Stack.Screen
          name="NotificationScreen"
          component={NotificationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SettingList"
          component={SettingList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditInfo"
          component={EditInfo}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FavouriteList"
          component={FavouriteList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HistoryScreen"
          component={HistoryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RatingHistory"
          component={RatingHistory}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </>
  );
};

export default AppStack;
