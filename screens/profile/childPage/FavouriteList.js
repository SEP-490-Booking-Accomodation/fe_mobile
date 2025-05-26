import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import HorizontalCardWishlist from "../../../components/cards/HorizontalCardWishlist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { useAsyncStorage } from "../../../context/AsyncStorageContext";
import DataEmpty from "../../../components/DataEmpty";
import { useTranslation } from "react-i18next";

export default function FavouriteList({ route, navigation }) {
  const { t } = useTranslation();
  const { favorites, addFavorite, removeFavorite } = useAsyncStorage();
  const [dataFavourite, setDataFavourite] = useState(favorites);
  console.log(dataFavourite);
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.arrowBack}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="left" size={24} color="#4E72E3" />
      </TouchableOpacity>
      <Text style={styles.textHeader}>{t("favorites_list")}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {dataFavourite.length === 0 ? (
        <DataEmpty 
          iconName="heart-broken" 
          description={t("empty_favorites")} 
        /> 
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {dataFavourite.map((item, index) => (
            <HorizontalCardWishlist
              key={index}
              imageUrlLogo={item.imageUrl}
              placeName={item.placeName}
              openHour={item.openHour}
              closeHour={item.closeHour}
              minPrice={item.minPrice}
              maxPrice={item.maxPrice}
              location={item.location}
              rating={item.rating}
              numOfReviews={item.numOfReviews}
              initFavourite={item.initFavourite}
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
    zIndex: 10
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
    padding: 24
  },
});
