import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useAsyncStorage } from "../../context/AsyncStorageContext";
import HorizontalCardSmall from "../../components/cards/HorizontalCardSmall";
import HorizontalCardMedium from "../../components/cards/HorizontalCardMedium";

const SearchScreen = ({ route, navigation }) => {
  const [searchQuery, setSearchQuery] = useState(
    route.params?.initialQuery || ""
  );
  const { searchHistory, addSearchTerm, clearSearchHistory, removeSearchTerm } =
    useAsyncStorage();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllHistory, setShowAllHistory] = useState(false);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      addSearchTerm(searchTerm.trim());
      setSearchQuery(searchTerm.trim());
      setSearchTerm("");
    }
  };

  const displayedHistory = showAllHistory
    ? searchHistory
    : searchHistory.slice(0, 3);

  const renderHistoryItem = (item, index) => (
    <View key={index} style={styles.historyItemContainer}>
      <TouchableOpacity
        style={styles.historyItem}
        onPress={() => {
          setSearchQuery(item);
          setSearchTerm(item);
          handleSearch();
        }}
      >
        {/* <Icon
          name="time-outline"
          size={20}
          color="#666"
          style={styles.historyIcon}
        /> */}
        <Text style={styles.historyText}>{item}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeSearchTerm(item)}
      >
        <Icon name="close" size={20} color="#4E72E3" />
      </TouchableOpacity>
    </View>
  );

  const exampleData = [
    {
      id: 1,
      imageUrlLogo:
        "https://cafebiz.cafebizcdn.vn/2018/12/22/photo-2-15454504530612141260827.jpg",
      placeName: "Nhà Con Nhộng Bình Tân",
      openHour: "3:00",
      closeHour: "23:00",
      minPrice: "120.000",
      maxPrice: "1.400.000",
      location: "Bình Tân, Hồ Chí Minh",
      rating: 5,
      numOfReviews: "12.5k",
      distance: "2.4",
    },
    {
      id: 2,
      imageUrlLogo:
        "https://cafebiz.cafebizcdn.vn/2018/12/22/photo-2-15454504530612141260827.jpg",
      placeName: "Phòng Thương Gia",
      openHour: "6:00",
      closeHour: "22:00",
      minPrice: "250.000",
      maxPrice: "2.000.000",
      location: "Quận 1, Hồ Chí Minh",
      rating: 4.8,
      numOfReviews: "8.3k",
      distance: "5.7",
    },
  ];

  const renderSuggestLocation = () =>
    exampleData.map((item) => (
      <HorizontalCardMedium
        key={item.id}
        imageUrlLogo={item.imageUrlLogo}
        placeName={item.placeName}
        openHour={item.openHour}
        closeHour={item.closeHour}
        minPrice={item.minPrice}
        maxPrice={item.maxPrice}
        location={item.location}
        rating={item.rating}
        numOfReviews={item.numOfReviews}
        distance={item.distance}
      />
    ));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Nhập nội dung tìm kiếm"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
        />
        {searchTerm ? (
          <TouchableOpacity
            onPress={() => setSearchTerm("")}
            style={styles.clearButton}
          >
            <Icon name="close" size={20} color="#666" />
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView>
        <View style={styles.section}>
          <View style={styles.flexBetween}>
            <Text style={styles.sectionTitle}>Lịch sử tìm kiếm</Text>
          </View>

          {displayedHistory.map((item, index) =>
            renderHistoryItem(item, index)
          )}

          {searchHistory.length > 3 && (
            <TouchableOpacity
              onPress={() => setShowAllHistory(!showAllHistory)}
              style={styles.showMoreButton}
            >
              <Text style={styles.showMoreText}>
                {showAllHistory ? "Ẩn bớt" : "Xem thêm"}
              </Text>
            </TouchableOpacity>
          )}

          {showAllHistory && searchHistory.length > 0 && (
            <TouchableOpacity
              onPress={clearSearchHistory}
              style={styles.clearHistoryButton}
            >
              <Text style={styles.clearHistoryText}>Xóa tất cả</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gợi ý địa điểm</Text>
          {renderSuggestLocation()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    marginRight: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  clearButton: {
    marginLeft: 10,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  historyItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderRadius: 20,
    // marginBottom: 10,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  historyIcon: {
    marginRight: 10,
  },
  historyText: {
    fontSize: 14,
  },
  deleteButton: {
    marginLeft: 10,
    padding: 5,
  },
  showMoreButton: {
    justifyContent: "center",
    alignItems: "center",
    // paddingHorizontal: 20,
    paddingVertical: 10,
  },
  showMoreText: {
    fontSize: 14,
    color: "#4E72E3",
  },
  clearHistoryButton: {
    marginTop: 10,
    alignItems: "center",
  },
  clearHistoryText: {
    color: "#4E72E3",
    // fontWeight: "bold",
  },
  flexBetween: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
});

export default SearchScreen;
