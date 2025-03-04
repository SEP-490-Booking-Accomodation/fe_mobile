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
import { Ionicons, MaterialIcons, Feather, AntDesign } from "@expo/vector-icons";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";

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
import TicketList from "../screens/ticket/TicketList";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
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

const TabsContext = React.createContext();

export const useTabsContext = () => React.useContext(TabsContext);

const TabsProvider = ({ children }) => {
  const [currentLayout, setCurrentLayout] = useState("default");

  return (
    <TabsContext.Provider value={{ currentLayout, setCurrentLayout }}>
      {children}
    </TabsContext.Provider>
  );
};

const tabLayouts = {
  // Home screen tabs
  home: [
    {
      name: "Home",
      component: HomeScreen,
      icon: (color) => <Ionicons name="home" size={24} color={color} />,
    },
    {
      name: "Favourite",
      component: FavouriteList,
      icon: (color) => <AntDesign name="heart" size={24} color={color} />,
    },
    {
      name: "Map",
      component: MapScreen,
      icon: (color) => <Ionicons name="map" size={24} color={color} />,
      isMiddleButton: true,
    },
    {
      name: "Activities",
      component: TicketList,
      icon: (color) => <MaterialIcons name="local-activity" size={24} color={color} />,
    },
    {
      name: "Settings",
      component: SettingList,
      icon: (color) => <Feather name="settings" size={24} color={color} />,
    },
  ],
  default: [
    {
      name: "Home",
      component: HomeScreen,
      icon: (color) => <Ionicons name="home" size={24} color={color} />,
    },
    {
      name: "Messages",
      component: MessagesScreen,
      icon: (color) => <Ionicons name="chatbubble-outline" size={24} color={color} />,
    },
    {
      name: "Map",
      component: MapScreen,
      icon: (color) => <Ionicons name="map" size={24} color={color} />,
      isMiddleButton: true,
    },
    {
      name: "Activities",
      component: TicketList,
      icon: (color) => <MaterialIcons name="local-activity" size={24} color={color} />,
    },
    {
      name: "Settings",
      component: SettingList,
      icon: (color) => <Feather name="settings" size={24} color={color} />,
    },
  ],
};

// Custom Middle Button Component
const MiddleButton = ({ item, color, onPress }) => (
  <View
    style={{
      alignItems: "center",
      justifyContent: "center",
    }}
  >
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

const FlexibleTabNavigator = ({ layout = "default" }) => {
  const tabs = tabLayouts[layout] || tabLayouts.default;
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
      {tabs.map((item) => (
        <Tab.Screen
          key={item.name}
          name={item.name}
          component={item.component}
          options={{
            tabBarIcon: ({ color }) => item.icon(color),
            tabBarButton: item.isMiddleButton
              ? (props) => (
                <MiddleButton
                  {...props}
                  item={item}
                  onPress={() => navigation.navigate(item.name)}
                />
              )
              : undefined,
          }}
        />
      ))}
    </Tab.Navigator>
  );
};


const MainTabsScreen = () => {
  const { currentLayout, setCurrentLayout } = useTabsContext();
  const route = useRoute();

  useEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";

    if (routeName === "Home" || routeName === "HomeScreen") {
      setCurrentLayout("home");
    } else if (routeName === "Profile" || routeName === "ProfileScreen") {
      setCurrentLayout("profile");
    } else {
      setCurrentLayout("default");
    }
  }, [route, setCurrentLayout]);

  return <FlexibleTabNavigator layout={currentLayout} />;
};

// Main App Stack
const AppStack = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkAppState = async () => {
      setInitialRoute("MainTabs");
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
    <TabsProvider>
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
          component={MainTabsScreen}
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
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DetailRentalLocation"
          component={DetailRentalLocationScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </TabsProvider>
  );
};

export default AppStack;