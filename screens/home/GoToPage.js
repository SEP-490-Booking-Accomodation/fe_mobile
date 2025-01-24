import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export default function GoToPage() {
  const navigation = useNavigation();

  const goToDetailRentalLocation = () => {
    navigation.navigate("DetailRentalLocation");
  };

  const goToPolicies = () => {
    navigation.navigate("Policies");
  };

  return (
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
  );
}

const styles = StyleSheet.create({});
