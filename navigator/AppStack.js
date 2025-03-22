import React, { useEffect, useState, createContext, useContext } from "react";
import {
  StatusBar,
  ActivityIndicator,
  View,
  TouchableOpacity,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Ionicons,
  MaterialIcons,
  Feather,
  AntDesign,
} from "@expo/vector-icons";

// Import screens
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
import TicketList from "../screens/ticket/TicketList";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Navigation context
const NavigationContext = createContext();
export const useNavigationContext = () => useContext(NavigationContext);

// Hidden tab bar screens
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
  "TicketList",
  "HistoryScreen",
];

// AUTH STACK
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="VerifyBy" component={VerifyByScreen} />
    <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
  </Stack.Navigator>
);

// HOME STACK
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="SearchScreen" component={SearchScreen} />
    <Stack.Screen name="SearchResult" component={SearchResult} />
    <Stack.Screen
      name="DetailRentalLocation"
      component={DetailRentalLocationScreen}
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
    <Stack.Screen name="PolicyDetail" component={PolicyDetailScreen} />
    <Stack.Screen
      name="ConfirmBooking"
      component={ConfirmBooking}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="PaymentConfirm" component={PaymentConfirm} />
    <Stack.Screen
      name="PaymentSuccess"
      component={PaymentSuccess}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="FavouriteList"
      component={FavouriteList}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="NotificationScreen"
      component={NotificationScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ProfileScreen"
      component={ProfileScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="EditInfo" component={EditInfo} />
    <Stack.Screen name="ChangePassword" component={ChangePassword} />
    <Stack.Screen name="RatingHistory" component={RatingHistory} />
    <Stack.Screen name="Wallet" component={WalletScreen} />
    <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
    <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
  </Stack.Navigator>
);

// MESSAGE STACK
const MessageStack = () => (
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

//Setting Stack
const SettingStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Setting" component={SettingList} />
  </Stack.Navigator>
);

//TicketList
const TicketStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TicketList" component={TicketList} />
  </Stack.Navigator>
);

// Custom Middle Button Component
const MiddleButton = ({ item, onPress }) => (
  <View style={{ alignItems: "center", justifyContent: "center" }}>
    <TouchableOpacity
      onPress={onPress}
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
      {item.icon("#FFFFFF")}
    </TouchableOpacity>
  </View>
);

// Main Tab Navigator
const MainTabNavigator = () => {
  const navigation = useNavigation();

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
        name="Home"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessageStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble-outline" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="map" size={24} color={color} />
          ),
          tabBarButton: (props) => (
            <MiddleButton
              {...props}
              item={{
                icon: (color) => (
                  <Ionicons name="map" size={24} color={color} />
                ),
              }}
              onPress={() => navigation.navigate("Map")}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Ticket"
        component={TicketStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="local-activity" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Initial Navigation Flow
const AppStack = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  const [navigationState, setNavigationState] = useState({
    currentLayout: "default",
  });

  useEffect(() => {
    const checkAppState = async () => {
      try {
        // Thay đổi từ DrawerNavigation sang MainTabs
        setInitialRoute("MainTabs");
      } catch (e) {
        console.error("Failed to load app state", e);
        setInitialRoute("Splash");
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
    <NavigationContext.Provider
      value={{
        ...navigationState,
        updateState: (newState) =>
          setNavigationState({ ...navigationState, ...newState }),
      }}
    >
      <StatusBar animated={true} />
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ gestureEnabled: true, headerShown: false }}
      >
        {/* Onboarding & Splash */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />

        {/* Auth Flow */}
        <Stack.Screen name="Auth" component={AuthStack} />

        {/* Main App Flow - Thay DrawerNavigator bằng MainTabNavigator */}
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContext.Provider>
  );
};

export default AppStack;
