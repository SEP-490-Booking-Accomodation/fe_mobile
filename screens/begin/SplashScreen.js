import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";

const SplashScreenComponent = ({ navigation }) => {
  useEffect(() => {
    const loadApp = async () => {
      await SplashScreen.preventAutoHideAsync();
      setTimeout(async () => {
        await SplashScreen.hideAsync(); 
        navigation.replace("Onboarding");
      }, 3000);
    };

    loadApp();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Mean</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4169E1",
  },
  text: {
    fontSize: 64,
    color: "#fff",
    fontWeight: "600",
  },
});

export default SplashScreenComponent;
