import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useAsyncStorage } from "../../context/AsyncStorageContext";
import HorizontalCardMedium from "../../components/cards/HorizontalCardMedium";

const SearchScreen = ({ route, navigation }) => {
  const { searchHistory, addSearchTerm, clearSearchHistory, removeSearchTerm } =
    useAsyncStorage();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);

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

  const filteredHistory = searchTerm
    ? searchHistory.filter((item) =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSearch = () => {
    if (searchTerm.trim()) {
      addSearchTerm(searchTerm.trim());
      navigation.navigate("SearchResult", { query: searchTerm.trim() });
      setSearchTerm("");
      setIsSearching(false);
    }
  };

  const renderHistoryItem = ({ item }) => (
    <View style={styles.historyItemContainer}>
      <TouchableOpacity
        style={styles.historyItem}
        onPress={() => {
          removeSearchTerm(item);
          addSearchTerm(item);
          setSearchTerm(item);
          navigation.navigate("SearchResult", { query: item }); // Điều hướng
        }}
      >
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
  const renderHistoryItemOverlay = ({ item }) => (
    <View style={styles.historyItemContainer}>
      <TouchableOpacity
        style={styles.historyItem}
        onPress={() => {
          removeSearchTerm(item);
          addSearchTerm(item);
          setSearchTerm(item);
          navigation.navigate("SearchResult", { query: item }); // Điều hướng
        }}
      >
        <Text style={styles.historyText}>{item}</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeSearchTerm(item)}
      >
        <Icon name="close" size={20} color="#4E72E3" />
      </TouchableOpacity> */}
    </View>
  );

  const renderContent = () => {
    const sections = [
      {
        title: "Lịch sử tìm kiếm",
        data: showAllHistory ? searchHistory : searchHistory.slice(0, 3),
        renderItem: renderHistoryItem,
        keyExtractor: (item, index) => index.toString(),
        footer:
          searchHistory.length > 3 ? (
            <>
              <TouchableOpacity
                onPress={() => setShowAllHistory(!showAllHistory)}
                style={styles.showMoreButton}
              >
                <Text style={styles.showMoreText}>
                  {showAllHistory ? "Ẩn bớt" : "Xem thêm"}
                </Text>
              </TouchableOpacity>
              {showAllHistory && searchHistory.length > 0 && (
                <TouchableOpacity
                  onPress={clearSearchHistory}
                  style={styles.clearHistoryButton}
                >
                  <Text style={styles.clearHistoryText}>Xóa tất cả</Text>
                </TouchableOpacity>
              )}
            </>
          ) : null,
      },
      // {
      //   title: "Gợi ý địa điểm",
      //   data: exampleData,
      //   renderItem: ({ item }) => (
      //     <HorizontalCardMedium
      //       key={item.id}
      //       imageUrlLogo={item.imageUrlLogo}
      //       placeName={item.placeName}
      //       openHour={item.openHour}
      //       closeHour={item.closeHour}
      //       minPrice={item.minPrice}
      //       maxPrice={item.maxPrice}
      //       location={item.location}
      //       rating={item.rating}
      //       numOfReviews={item.numOfReviews}
      //       distance={item.distance}
      //     />
      //   ),
      //   keyExtractor: (item) => item.id.toString(),
      // },
    ];

    return (
      <FlatList
        data={sections}
        keyExtractor={(item) => item.title}
        renderItem={({ item }) => (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            <FlatList
              data={item.data}
              renderItem={item.renderItem}
              keyExtractor={item.keyExtractor}
              ListFooterComponent={item.footer}
            />
          </View>
        )}
      />
    );
  };

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
          onChangeText={(text) => {
            setSearchTerm(text);
            setIsSearching(text.trim() !== "");
          }}
          onSubmitEditing={handleSearch}
        />
        {searchTerm ? (
          <TouchableOpacity
            onPress={() => {
              setSearchTerm("");
              setIsSearching(false);
            }}
            style={styles.clearButton}
          >
            <Icon name="close" size={20} color="#666" />
          </TouchableOpacity>
        ) : null}
      </View>

      {isSearching ? (
        <View style={styles.overlay}>
          {filteredHistory.length > 0 ? (
            <FlatList
              data={filteredHistory}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderHistoryItemOverlay}
            />
          ) : (
            <Text style={styles.noResultsText}>Không có kết quả phù hợp</Text>
          )}
        </View>
      ) : (
        renderContent()
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;

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
  overlay: {
    padding: 15,
    backgroundColor: "#fff",
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
    // paddingVertical: 10,
  },
  historyItem: {
    flex: 1,
    paddingVertical: 10,
    borderBottomColor: "#999",
    borderBottomWidth: 0.2,
  },
  historyText: {
    fontSize: 16,
    borderBottomColor: "#999",
  },
  deleteButton: {
    marginLeft: 10,
  },
  showMoreButton: {
    alignItems: "center",
    marginTop: 10,
  },
  showMoreText: {
    color: "#4E72E3",
    fontSize: 14,
  },
  clearHistoryButton: {
    alignItems: "center",
    marginTop: 10,
  },
  clearHistoryText: {
    color: "#4E72E3",
    fontSize: 14,
  },
  noResultsText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});
