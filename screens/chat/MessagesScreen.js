import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import BottomTabs from "../../components/BottomTabs";
import Icon from "react-native-vector-icons/Ionicons";

const messagesData = [
  {
    id: "1",
    name: "John Doe",
    message: "Hey, how are you?",
    time: "10:30 AM",
    avatar: "https://i.pravatar.cc/300?img=1",
    unread: true,
  },
  {
    id: "2",
    name: "Jane Smith",
    message: "Let's catch up later!",
    time: "9:15 AM",
    avatar: "https://i.pravatar.cc/300?img=2",
    unread: true,
  },
  {
    id: "3",
    name: "Emily Johnson",
    message: "Got it, thanks!",
    time: "Yesterday",
    avatar: "https://i.pravatar.cc/300?img=3",
    unread: false,
  },
];

export default function MessagesScreen({ navigation }) {
  const [searchText, setSearchText] = useState("");
  const [filteredMessages, setFilteredMessages] = useState(messagesData);
  const [unreadMessages, setUnreadMessages] = useState(
    messagesData.filter((msg) => msg.unread)
  );

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = messagesData.filter(
      (item) =>
        item.name.toLowerCase().includes(text.toLowerCase()) ||
        item.message.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredMessages(filtered);
  };

  const handlePressMessage = (item) => {
    // Điều hướng đến màn hình chat và đánh dấu tin nhắn là đã đọc
    navigation.navigate("Chat", { name: item.name });

    // Cập nhật trạng thái đã đọc
    setUnreadMessages((prev) => prev.filter((msg) => msg.id !== item.id));
    setFilteredMessages((prev) =>
      prev.map((msg) => (msg.id === item.id ? { ...msg, unread: false } : msg))
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.messageItem}
      onPress={() => handlePressMessage(item)}
    >
      <View>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.unread && (
          <View style={styles.unreadImage}>
            <View style={styles.unreadImageIn}></View>
          </View>
        )}
      </View>

      <View style={styles.messageInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={[styles.message, item.unread && styles.unreadMessage]}>
          {item.message}
        </Text>
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.time}>{item.time}</Text>
        {item.unread && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <Icon
          name="search-outline"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm..."
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {/* Danh sách tin nhắn */}
      <FlatList
        data={filteredMessages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      {/* Thanh điều hướng dưới */}
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
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  searchContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    backgroundColor: "#f7f7fc",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
  },
  searchInput: {
    height: 40,
    paddingHorizontal: 12,
  },
  list: { paddingHorizontal: 16 },
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 16,
  },
  messageInfo: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold", color: "#333" },
  message: { fontSize: 14, color: "#666", marginTop: 4 },
  unreadMessage: {
    fontWeight: "bold",
    color: "#000",
  },
  rightContainer: {
    alignItems: "flex-end",
  },
  time: { fontSize: 12, color: "#999" },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "blue",
    marginTop: 4,
  },
  unreadImage: {
    width: 20,
    height: 20,
    borderRadius: 25,
    backgroundColor: "white",
    position: "absolute",
    right: 10,
    top: "-4",
  },
  unreadImageIn: {
    width: 15,
    height: 15,
    borderRadius: 25,
    backgroundColor: "green",
    display: "flex",
    margin: 3,
    // position: "absolute",
    // right: 10,
    // top: "-4",
  },
});
