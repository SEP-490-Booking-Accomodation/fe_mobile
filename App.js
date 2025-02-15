import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { AsyncStorageProvider } from "./context/AsyncStorageContext";
import AppStack from "./navigator/AppStack";
import { StripeProvider } from "@stripe/stripe-react-native";
import { STRIPE_PUBLIC_KEY } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { restoreAuth } from "./redux/authSlice";
import store from "./redux/store";

const AuthLoader = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const authData = await AsyncStorage.getItem("authData");
      if (authData) {
        const { userId, token } = JSON.parse(authData);
        dispatch(restoreAuth({ userId, token }));
      }
    };
    checkAuth();
  }, [dispatch]);

  return null;
};

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
