import React from "react";
import { View, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

const QRCodeComponent = ({
  value = "example",
  size = 80,
  logo,
  logoSize = 20,
  logoBackgroundColor = "#FFF",
  logoBorderRadius = 10,
  quietZone = 6,
  enableLinearGradient = false,
  linearGradient = ["#4E72E3", "#7B9EF0"],
  color = "#000",
  backgroundColor = "#FFF",
}) => {
  return (
    <View style={styles.container}>
      <QRCode
        value={value}
        size={size}
        color={color}
        backgroundColor={backgroundColor}
        logo={logo}
        logoSize={logoSize}
        logoBackgroundColor={logoBackgroundColor}
        logoBorderRadius={logoBorderRadius}
        quietZone={quietZone}
        enableLinearGradient={enableLinearGradient}
        linearGradient={linearGradient}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default QRCodeComponent;
