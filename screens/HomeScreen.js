import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import BottomTabs from "../components/BottomTabs";

export default function HomeScreen() {
  const navigation = useNavigation(); 

  const goToDetailRentalLocation = () => {
    navigation.navigate("DetailRentalLocation");
  };

  const goToPolicies = () => {
    navigation.navigate("Policies");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#E5E7EB" }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          style={styles.button}
          onPress={goToDetailRentalLocation}
        >
          <Text style={styles.buttonText}>Go to Detail Rental Location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.marginTop]}
          onPress={goToPolicies}
        >
          <Text style={styles.buttonText}>Go to Policies</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <BottomTabs navigation={navigation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#1D4ED8",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  marginTop: {
    marginTop: 16,
  },
});
