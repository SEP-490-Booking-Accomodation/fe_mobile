import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import HorizontalCardWishlist from "../../../components/cards/HorizontalCardWishlist";
import React, { useEffect, useState } from "react";
import { useAsyncStorage } from "../../../context/AsyncStorageContext";
import DataEmpty from "../../../components/DataEmpty";
import { useTranslation } from "react-i18next";

export default function FavouriteList({ navigation }) {
  const { t } = useTranslation();
  const { favorites } = useAsyncStorage();
  const [refreshKey, setRefreshKey] = useState(0); // Used to force re-render

  // Force component to update when favorites change
  useEffect(() => {
    setRefreshKey((prevKey) => prevKey + 1);
  }, [favorites]);

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.arrowBack}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={24} color="#4E72E3" />
      </TouchableOpacity>
      <Text style={styles.textHeader}>{t("favorites_list")}</Text>
    </View>
  );

  const handleCardPress = (item) => {
    // Navigate to detail screen with the selected item
    navigation.navigate("DetailRentalLocation", {
      rentalId: item._id || item.id,
    });
  };

  return (
    <SafeAreaView style={styles.container} key={refreshKey}>
      {renderHeader()}
      {favorites.length === 0 ? (
        <DataEmpty iconName="heart-broken" description={t("empty_favorites")} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {favorites.map((item) => (
            <HorizontalCardWishlist
              key={item._id || item.id}
              item={item}
              onPress={() => handleCardPress(item)}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 1.32,
    elevation: 5,
    zIndex: 10,
  },
  textHeader: {
    fontSize: 20,
    fontWeight: "600",
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flexGrow: 1,
    padding: 24,
  },
  arrowBack: {
    padding: 8,
  },
});
