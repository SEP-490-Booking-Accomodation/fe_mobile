import {
  Image,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
//#region How to use this components
/**
 * @example
 * <HorizontalCardMedium
            imageUrlLogo = {require("./assets/images/horizontalCardImage.jpeg")}
            placeName = {"Nhà con nhộng giá rẻ Bình Tân"}
            openHour = {"3:00"}
            closeHour = {"23:00"}
            minPrice = {"120.000"}
            maxPrice = {"1.400.000"}
            location = {"Bình Tân, HCM"}
            rating = {"5"}
            numOfReviews = {"12.5k"}
            distance = "22.4"
            ></HorizontalCardMedium>
 * @param {imageUrlLogo, placeName, openHour, closeHour, minPrice, maxPrice,location, rating, numOfReviews} props 
 * @returns HorizontalCardMedium
 */
//#endregion
const HorizontalCardWishlist = ({
  imageUrlLogo,
  placeName,
  openHour,
  closeHour,
  minPrice,
  maxPrice,
  location,
  rating,
  numOfReviews,
  initFavourite,
  onFavouritePress = () => {},
  onCardPress = () => {},
  onPress,
}) => {
  const { t } = useTranslation();
  const [isFavourite, setIsFavourite] = useState(initFavourite);
  const handleFavouritePress = () => {
    const newValue = !isFavourite;
    setIsFavourite(newValue);
    if (onFavouritePress) {
      onFavouritePress(newValue);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: imageUrlLogo }}
        resizeMode="cover"
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{placeName}</Text>
        <View style={styles.openingHourContainer}>
          <Text style={styles.openHourText}>
          {t("open_hours")} ({openHour} - {closeHour})
          </Text>
        </View>
        <Text style={styles.priceRange}>
          {minPrice} {t("currency")} - {maxPrice} {t("currency")}
        </Text>
        <View style={styles.locationContainer}>
          <Icon name="location-on" size={20} color="#4e72e3" />
          <Text style={styles.locationText}>{location}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={20} color="#ffc907" />
          <Text style={styles.ratingText}>
            {rating} ({numOfReviews}  {t("reviews_count")})
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.favouriteContainer}
        onPress={handleFavouritePress}
        activeOpacity={0.8}
      >
        <Icon
          name={isFavourite ? "favorite" : "favorite-border"}
          size={24}
          color={isFavourite ? "#FF4B26" : "#666666"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 20,
    marginVertical: 16,
    shadowColor: "#000",
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 16,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "space-between",
  },
  title: {
    color: "#101828",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  openingHourContainer: {
    backgroundColor: "#12b347",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 12,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  openHourText: {
    color: "white",
    fontSize: 10,
    fontWeight: "500",
  },
  priceRange: {
    color: "#4e72e3",
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  locationText: {
    color: "#00000066",
    marginLeft: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 12,
    color: "#00000099",
  },
  favouriteContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "white",
    borderRadius: 100,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    zIndex: 1,
  },
});

export default HorizontalCardWishlist;
