import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function GoToPage() {
  const { t } = useTranslation();
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
        <Text style={styles.buttonText}>{t('go_to_detail')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.marginTop]}
        onPress={goToPolicies}
      >
        <Text style={styles.buttonText}>{t('go_to_policies')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
