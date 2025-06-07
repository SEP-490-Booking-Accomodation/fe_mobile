import React from "react";
import { View, Image, StyleSheet } from "react-native";

export default function BookingImage({ imageUrl }) {
  if (!imageUrl) return null;
  
  return (
    <View style={styles.imageContainer}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.imageShadowOverlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageShadowOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "rgba(0,0,0,0.15)",
    backgroundImage: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.3))",
  }
});
