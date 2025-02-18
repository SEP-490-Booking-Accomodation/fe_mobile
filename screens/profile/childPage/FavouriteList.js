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
export default function FavouriteList({ route, navigation }) {

  const dataFavourite = [
    {
      imageUrl: require("../../../assets/images/horizontalCardImage.jpeg"),
      placeName: "Nhà con nhộng giá rẻ Bình Tân",
      openHour: "3:00",
      closeHour: "23:00",
      minPrice: "120.000",
      maxPrice: "1.400.000",
      location: "Bình Tân, HCM",
      rating: "5",
      numOfReviews: "12.5k",
      initFavourite: true,
    },
    {
      imageUrl: require("../../../assets/images/horizontalCardImage.jpeg"),
      placeName: "Nhà con nhộng giá rẻ Bình Tân",
      openHour: "3:00",
      closeHour: "23:00",
      minPrice: "120.000",
      maxPrice: "1.400.000",
      location: "Bình Tân, HCM",
      rating: "5",
      numOfReviews: "12.5k",
      initFavourite: true,
    },
    {
      imageUrl: require("../../../assets/images/horizontalCardImage.jpeg"),
      placeName: "Nhà con nhộng giá rẻ Bình Tân",
      openHour: "3:00",
      closeHour: "23:00",
      minPrice: "120.000",
      maxPrice: "1.400.000",
      location: "Bình Tân, HCM",
      rating: "5",
      numOfReviews: "12.5k",
      initFavourite: true,
    },
    {
      imageUrl: require("../../../assets/images/horizontalCardImage.jpeg"),
      placeName: "Nhà con nhộng giá rẻ Bình Tân",
      openHour: "3:00",
      closeHour: "23:00",
      minPrice: "120.000",
      maxPrice: "1.400.000",
      location: "Bình Tân, HCM",
      rating: "5",
      numOfReviews: "12.5k",
      initFavourite: true,
    },
  ];
  
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.arrowBack}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={24} color="#4E72E3" />
      </TouchableOpacity>
      <Text style={styles.textHeader}>Danh sách yêu thích</Text>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
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
