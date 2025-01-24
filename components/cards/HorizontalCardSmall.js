import React from "react";
import { Image, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

/**
 * HorizontalCardSmall Component
 * @param {Object} props - Component props
 * @param {string|number} props.imageUrl - Source of the image (require() or URL)
 * @param {string} props.roomName - Room name
 * @param {string} props.location - Location text
 * @param {string|number} props.rating - Rating value
 * @param {string|number} props.numOfReviews - Number of reviews
 * @param {string} props.tagName - Tag label
 * @param {function} [props.onPress] - Optional onPress handler
 * @returns {React.ReactElement}
 */
export default function HorizontalCardSmall({
  imageUrl,
  roomName,
  location,
  rating,
  numOfReviews,
  tagName,
  onPress,
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: imageUrl }}
        resizeMode="cover"
        style={styles.image}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {roomName}
        </Text>
        <View style={styles.locationContainer}>
          <Icon name="location-on" size={20} color={"#4e72e3"} />
          <Text style={styles.locationText} numberOfLines={1}>
            {location}
          </Text>
        </View>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={20} color={"#ffc907"} />
          <Text style={styles.ratingText}>
            {rating} ({numOfReviews} đánh giá)
          </Text>
        </View>
      </View>

      <View style={styles.tagContainer}>
        <Text style={styles.tagText}>{tagName}</Text>
      </View>
    </TouchableOpacity>
  );
}

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
    width: 60,
    height: 60,
    borderRadius: 7,
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
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 12,
    color: "#00000099",
  },
  tagContainer: {
    backgroundColor: "#4e72e333",
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    borderRadius: 20,
  },
  tagText: {
    color: "#4e72e3",
    fontSize: 10,
    fontWeight: "500",
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
});
