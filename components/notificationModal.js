import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const NotificationModal = ({
  visible,
  message,
  type = "success", // 'success', 'error', 'info'
  duration = 2000,
  onClose,
}) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Show notification
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Hide after duration
      const timer = setTimeout(() => {
        hideNotification();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideNotification = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onClose) onClose();
    });
  };

  // Don't render anything if not visible
  if (!visible) return null;

  // Determine icon and color based on type
  let iconName = "check-circle";
  let backgroundColor = "#12B347";

  if (type === "error") {
    iconName = "error";
    backgroundColor = "#FF4B26";
  } else if (type === "info") {
    iconName = "info";
    backgroundColor = "#4E72E3";
  } else if (type === "favorite-added") {
    iconName = "favorite";
    backgroundColor = "#FF4B26";
  } else if (type === "favorite-removed") {
    iconName = "favorite-border";
    backgroundColor = "#666666";
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <MaterialIcons name={iconName} size={24} color="white" />
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50, // Position below status bar
    left: width * 0.1, // 10% from left
    right: width * 0.1, // 10% from right
    width: width * 0.8, // 80% of screen width
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  message: {
    color: "white",
    marginLeft: 12,
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
});

export default NotificationModal;
