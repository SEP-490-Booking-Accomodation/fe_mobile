import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";

const chatData = [
  { id: "1", text: "Hey!", sender: "other", type: "text" },
  { id: "2", text: "How are you?", sender: "other", type: "text" },
  { id: "3", text: "I'm good, thanks!", sender: "me", type: "text" },
];

export default function ChatScreen({ route }) {
  const navigation = useNavigation();
  const [messages, setMessages] = useState(chatData);
  const [input, setInput] = useState("");
  const { name } = route.params;

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImageMessage = {
        id: Date.now().toString(),
        text: result.assets[0].uri,
        sender: "me",
        type: "image",
      };
      setMessages([...messages, newImageMessage]);
    }
  };

  const handleSendText = () => {
    if (input.trim()) {
      const newTextMessage = {
        id: Date.now().toString(),
        text: input,
        sender: "me",
        type: "text",
      };
      setMessages([...messages, newTextMessage]);
      setInput("");
    }
  };

  const renderItem = ({ item }) => {
    if (item.type === "text") {
      return (
        <View
          style={[
            styles.messageBubble,
            item.sender === "me" ? styles.myMessage : styles.otherMessage,
          ]}
        >
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      );
    } else if (item.type === "image") {
      return (
        <View
          style={[
            styles.messageBubble,
            item.sender === "me" ? styles.myMessage : styles.otherMessage,
          ]}
        >
          <Image source={{ uri: item.text }} style={styles.imageMessage} />
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Image
            source={{ uri: "https://i.pravatar.cc/300?img=1" }} // Ảnh giả, có thể thay bằng ảnh thật
            style={styles.avatar}
          />
          <Text style={styles.headerText}>{name}</Text>
        </View>

        {/* Danh sách tin nhắn */}
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatList}
        />

        {/* Ô nhập tin nhắn */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            <Ionicons name="image" size={24} color="white" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendText}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  // Header mới
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginLeft: 8,
  },

  chatList: { padding: 16 },

  messageBubble: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    maxWidth: "70%",
  },
  myMessage: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  otherMessage: {
    backgroundColor: "#E5E5EA",
    alignSelf: "flex-start",
  },
  messageText: { fontSize: 16, color: "#333" },
  imageMessage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#1D4ED8",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  sendButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "bold" },
  imageButton: {
    marginRight: 8,
    backgroundColor: "#1D4ED8",
    padding: 10,
    borderRadius: 8,
  },
  imageButtonText: { color: "#FFFFFF", fontSize: 16 },
});
