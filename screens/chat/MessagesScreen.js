import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import { supabase } from "../../lib/supabase";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useAsyncStorage } from "../../context/AsyncStorageContext";

export default function MessagesScreen({ navigation }) {
  // State management
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastMessages, setLastMessages] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [userProfiles, setUserProfiles] = useState({});
  const [searchText, setSearchText] = useState("");
  const [filteredChats, setFilteredChats] = useState([]);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  
  // Hooks
  const { loadIdChatPlatform } = useAsyncStorage();

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      const user = await loadIdChatPlatform();
      
      if (user !== null && user.length > 0) {
        const storedUser = user[0];
        
        if (storedUser._id) setUserId(storedUser._id);
        if (storedUser.username) setUsername(storedUser.username);
      }
      
      setUserLoaded(true);
    };
    
    loadUserData();
  }, []);

  // Setup realtime subscriptions and fetch initial data
  useEffect(() => {
    if (userId) {
      // Update user status to online
      updateUserOnlineStatus(true);

      // Subscribe to changes in the chats table
      const subscription = supabase
        .channel("public:chats")
        .on("postgres_changes", { event: "*", schema: "public", table: "chats" }, () => {
          fetchChats();
        })
        .subscribe();

      // Subscribe to changes in the messages table
      const messagesSubscription = supabase
        .channel("public:messages")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, () => {
          fetchLastMessages();
          fetchUnreadCounts();
        })
        .subscribe();

      // Fetch initial data
      fetchChats();

      return () => {
        // Update user status to offline when component unmounts
        updateUserOnlineStatus(false);
        supabase.removeChannel(subscription);
        supabase.removeChannel(messagesSubscription);
      };
    }
  }, [userId]);

  // Filter chats when search text changes
  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredChats(chats);
    } else {
      const filtered = chats.filter((chat) => {
        // Check if chat name contains search text
        if (chat.name.toLowerCase().includes(searchText.toLowerCase())) {
          return true;
        }

        // Check if any participant's username contains search text
        if (
          chat.participants &&
          chat.participants.some((p) => p.username && p.username.toLowerCase().includes(searchText.toLowerCase()))
        ) {
          return true;
        }

        // Check if last message contains search text
        const lastMessage = lastMessages[chat.id];
        if (
          lastMessage &&
          lastMessage.content &&
          lastMessage.content.toLowerCase().includes(searchText.toLowerCase())
        ) {
          return true;
        }

        return false;
      });
      setFilteredChats(filtered);
    }
  }, [searchText, chats, lastMessages]);

  // Update user online status
  async function updateUserOnlineStatus(isOnline) {
    try {
      const userIdPlatform = await loadIdChatPlatform();
      await supabase
        .from("profiles")
        .update({
          is_online: isOnline,
          ...(isOnline ? {} : { last_seen: new Date().toISOString() }),
        })
        .eq("iduserplatform", userIdPlatform.iduserplatform);
    } catch (e) {
      console.error("Exception updating online status:", e.message);
    }
  }
  
  // Fetch all chats for the current user
  async function fetchChats() {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setRefreshing(true);

      // First, get all chat IDs where the user is a participant
      const { data: participantData, error: participantError } = await supabase
        .from("chat_participants")
        .select("chat_id")
        .eq("user_id", userId);

      if (participantError) throw participantError;

      if (!participantData || participantData.length === 0) {
        setChats([]);
        setFilteredChats([]);
        return;
      }

      // Extract chat IDs
      const chatIds = participantData.map((p) => p.chat_id);

      // Then get the actual chat data
      const { data: chatData, error: chatError } = await supabase
        .from("chats")
        .select(`
          id,
          name,
          created_at,
          chat_participants(user_id, profiles:user_id(id, username, is_online, last_seen))
        `)
        .in("id", chatIds)
        .order("created_at", { ascending: false });

      if (chatError) throw chatError;

      // Process chat data to include participants
      const processedChats = chatData.map((chat) => {
        const otherParticipants = chat.chat_participants
          .filter((p) => p.user_id !== userId)
          .map((p) => p.profiles);

        return {
          ...chat,
          participants: otherParticipants,
        };
      });

      setChats(processedChats || []);
      setFilteredChats(processedChats || []);

      // Update user profiles
      const profilesMap = {};
      processedChats.forEach((chat) => {
        chat.participants.forEach((p) => {
          if (p) {
            profilesMap[p.id] = {
              id: p.id,
              username: p.username,
              isOnline: p.is_online,
              lastSeen: p.last_seen,
            };
          }
        });
      });
      setUserProfiles((prev) => ({ ...prev, ...profilesMap }));

      // Fetch last messages and unread counts
      fetchLastMessages(chatIds);
      fetchUnreadCounts(chatIds);
    } catch (error) {
      console.error("Exception fetching chats:", error.message);
      Alert.alert("Error", "Failed to load chats. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // Fetch last message for each chat
  async function fetchLastMessages(chatIds = null) {
    if (!userId) return;

    if (!chatIds) {
      chatIds = chats.map((chat) => chat.id);
    }

    if (chatIds.length === 0) return;

    try {
      // For each chat, get the most recent message
      const promises = chatIds.map(async (chatId) => {
        const { data, error } = await supabase
          .from("messages")
          .select("id, content, created_at, user_id, status")
          .eq("chat_id", chatId)
          .order("created_at", { ascending: false })
          .limit(1);

        if (error) return null;

        return { chatId, message: data && data.length > 0 ? data[0] : null };
      });

      const results = await Promise.all(promises);

      // Convert array of results to an object keyed by chatId
      const messagesMap = {};
      results.forEach((result) => {
        if (result && result.message) {
          messagesMap[result.chatId] = result.message;
        }
      });

      setLastMessages(messagesMap);
    } catch (e) {
      console.error("Exception fetching last messages:", e.message);
    }
  }

  // Fetch unread message counts
  async function fetchUnreadCounts(chatIds = null) {
    if (!userId) return;

    if (!chatIds) {
      chatIds = chats.map((chat) => chat.id);
    }

    if (chatIds.length === 0) return;

    try {
      // For each chat, count unread messages
      const promises = chatIds.map(async (chatId) => {
        const { data, error } = await supabase
          .from("messages")
          .select("id", { count: "exact" })
          .eq("chat_id", chatId)
          .neq("user_id", userId)
          .neq("status", "read");

        if (error) return { chatId, count: 0 };

        return { chatId, count: data ? data.length : 0 };
      });

      const results = await Promise.all(promises);

      // Convert array of results to an object keyed by chatId
      const countsMap = {};
      results.forEach((result) => {
        countsMap[result.chatId] = result.count;
      });

      setUnreadCounts(countsMap);
    } catch (e) {
      console.error("Exception fetching unread counts:", e.message);
    }
  }

  // Navigate to chat screen
  function handlePressChat(chat) {
    // Get the other participant for 1-on-1 chats
    const otherParticipant = chat.participants && chat.participants.length === 1 ? chat.participants[0] : null;

    // Display name - use other participant's name for 1-on-1 chats
    const displayName = otherParticipant ? otherParticipant.username : chat.name;

    navigation.navigate("Chat", {
      chatId: chat.id,
      chatName: displayName,
    });
  }

  // Format time for display
  function formatTime(timestamp) {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();

    // Check if it's today
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    // Check if it's yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    // Otherwise return the date
    return date.toLocaleDateString();
  }

  // Render a chat item
  function renderChatItem({ item }) {
    const lastMessage = lastMessages[item.id];
    const unreadCount = unreadCounts[item.id] || 0;

    // Get the other participant for 1-on-1 chats
    const otherParticipant = item.participants && item.participants.length === 1 ? item.participants[0] : null;

    // Display name - use other participant's name for 1-on-1 chats
    const displayName = otherParticipant ? otherParticipant.username : item.name;

    // Get online status
    const isOnline = otherParticipant ? otherParticipant.is_online : false;

    return (
      <TouchableOpacity 
        style={styles.chatItem} 
        onPress={() => handlePressChat(item)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
          </View>
          {isOnline && <View style={styles.onlineIndicator} />}
        </View>

        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName} numberOfLines={1}>{displayName}</Text>
            <Text style={styles.chatTime}>
              {lastMessage ? formatTime(lastMessage.created_at) : formatTime(item.created_at)}
            </Text>
          </View>
          
          <View style={styles.chatPreview}>
            <Text 
              style={[styles.chatMessage, unreadCount > 0 && styles.unreadMessage]} 
              numberOfLines={1}
            >
              {lastMessage ? lastMessage.content : "No messages yet"}
            </Text>
            
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Render the header
  function renderHeader() {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#4E72E3" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Conversations</Text>
        <View style={styles.headerRight} />
      </View>
    );
  }

  // Render search bar
  function renderSearchBar() {
    return (
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search conversations..." 
          value={searchText} 
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {renderHeader()}
        {renderSearchBar()}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.loadingText}>Loading conversations...</Text>
          </View>
        ) : filteredChats.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubble-ellipses-outline" size={64} color="#DDD" />
            <Text style={styles.emptyStateText}>No conversations yet</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchText ? "No results found" : "Start a new conversation"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredChats}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.id.toString()}
            refreshing={refreshing}
            onRefresh={() => fetchChats()}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  headerRight: {
    width: 40,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F7",
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 36,
    fontSize: 16,
    color: "#333",
  },
  list: {
    paddingHorizontal: 16,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  onlineIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#4CAF50",
    position: "absolute",
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: "white",
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    flex: 1,
    marginRight: 8,
  },
  chatTime: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  chatPreview: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatMessage: {
    fontSize: 14,
    color: "#6B7280",
    flex: 1,
    marginRight: 8,
  },
  unreadMessage: {
    fontWeight: "600",
    color: "#1F2937",
  },
  unreadBadge: {
    backgroundColor: "#4A90E2",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  unreadText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#6B7280",
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4B5563",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
});