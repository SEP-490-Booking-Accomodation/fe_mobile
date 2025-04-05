import { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
  AppState,
  Image,
  SafeAreaView,
} from "react-native";
import { supabase } from "../../lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import OnlineStatus from "../../components/chat/OnlineStatus";
import MessageStatus from "../../components/chat/MessageStatus";
import { useAsyncStorage } from "../../context/AsyncStorageContext";
export default function ChatScreen({ route, navigation}) {
  const { chatId, chatName } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userProfiles, setUserProfiles] = useState({});
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const flatListRef = useRef(null);
  const appState = useRef(AppState.currentState);
  const realtimeSubscription = useRef(null);
  const {loadIdChatPlatform} = useAsyncStorage();
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);  


  
  // At the start of your component
  useEffect(() => {
    const fetchUserId = async () => {
      var user = await loadIdChatPlatform();
      
      if (user !== null && user.length > 0) {
        const storedUser = user[0];
        console.log("Loaded user from AsyncStorage:", storedUser);
        
        if (storedUser._id) setUserId(storedUser._id);
        if (storedUser.username) setUserName(storedUser.username);
      } else {
        console.log("No user data found in AsyncStorage");
      }
    };
    
    fetchUserId();
    console.log("ChatScreen mounted. ChatId:", chatId, "UserId:", userId);
  }, []);
  
// Add at the top of your component body
console.log("Rendering ChatScreen with state:", {
  loading,
  messagesLoaded: messages.length > 0,
  participantsLoaded: participants.length > 0,
  userId,
  chatId
});
  // Set up navigation options
  useEffect(() => {
    if (participants.length > 0 && participants.length === 2 && userId) {
      // Find the other participant (not current user)
      const otherParticipant = participants.find((p) => p.id !== userId);

      if (otherParticipant) {
        navigation.setOptions({
          headerShown: false,
        });
      }
    } else {
      navigation.setOptions({
        headerShown: false,
      });
    }
  }, [navigation, participants, userId]);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground - refreshing messages");
        fetchMessages();

        // Mark messages as read when returning to the app
        if (userId) {
          markChatMessagesAsRead(chatId, userId);
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [userId]);

  // Mark messages as read when entering the chat
  useEffect(() => {
    if (userId && !loading) {
      markChatMessagesAsRead(chatId, userId);
    }
  }, [userId, loading, chatId]);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      
      // First fetch data only
      fetchMessages()
        .then(() => fetchParticipants())
        .then(() => {
          // Only setup realtime after data is loaded
          setupRealtimeSubscription();
          setLoading(false); // Move this here to ensure it's set after everything completes
        })
        .catch((error) => {
          console.error("Error initializing chat:", error);
          setLoading(false);
          Alert.alert("Error", "Failed to load chat data. Please try again.");
        });
    }
  
    return () => {
      if (realtimeSubscription.current) {
        console.log("Unsubscribing from realtime updates");
        realtimeSubscription.current.unsubscribe();
      }
    };
  }, [chatId, userId]);
  function setupRealtimeSubscription() {
    try {
      // Clean up any existing subscription
      if (realtimeSubscription.current) {
        realtimeSubscription.current.unsubscribe();
      }

      console.log(`Setting up realtime subscription for chat: ${chatId}`);

      // Create a new subscription
      const channel = supabase.channel(`chat:${chatId}`, {
        config: {
          broadcast: { self: false },
          presence: { key: "userId" },
        },
      });

      // Subscribe to INSERT events on the messages table
      realtimeSubscription.current = channel
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `chat_id=eq.${chatId}`,
          },
          (payload) => {
            console.log("New message received via realtime:", payload.new.id);

            // Add the new message to the state
            setMessages((prevMessages) => {
              // Check if we already have this message to avoid duplicates
              if (prevMessages.some((msg) => msg.id === payload.new.id)) {
                console.log("Message already exists, skipping");
                return prevMessages;
              }

              console.log("Adding new message to state");
              const updatedMessages = [...prevMessages, payload.new];

              // Scroll to bottom on next render
              setTimeout(() => {
                if (flatListRef.current) {
                  flatListRef.current.scrollToEnd({ animated: true });
                }
              }, 100);

              // Mark message as delivered if it's not from current user
              if (userId && payload.new.user_id !== userId) {
                updateMessageStatus(payload.new.id, "delivered", userId);

                // If the app is active, also mark as read
                if (appState.current === "active") {
                  updateMessageStatus(payload.new.id, "read", userId);
                }
              }

              return updatedMessages;
            });

            // Fetch user profile if we don't have it
            if (payload.new.user_id && !userProfiles[payload.new.user_id]) {
              fetchUserProfile(payload.new.user_id);
            }
          }
        )
        // Subscribe to UPDATE events for message status changes
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "messages",
            filter: `chat_id=eq.${chatId}`,
          },
          (payload) => {
            console.log("Message updated via realtime:", payload.new.id);

            // Update the message in state
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.id === payload.new.id ? { ...msg, ...payload.new } : msg
              )
            );
          }
        )
        .subscribe((status) => {
          console.log(`Realtime subscription status: ${status}`);
          if (status === "SUBSCRIBED") {
            console.log("Successfully subscribed to realtime updates");
          } else if (status === "CHANNEL_ERROR") {
            console.error("Error subscribing to realtime updates");
          }
        });
    } catch (error) {
      console.error("Error setting up realtime subscription:", error);
    }
  }

  async function fetchParticipants() {
    try {
      console.log("Fetching participants for chat:", chatId);
  
      const { data, error } = await supabase
        .from("chat_participants") 
        .select(`
          user_id,
          profiles:user_id(id, username, is_online, last_seen)
        `)
        .eq("chat_id", chatId);
  
      if (error) {
        console.error("Error fetching participants:", error.message);
        throw error;
      }
  
      if (Array.isArray(data)) {
        const participantList = data.map((p) => ({
          id: p.user_id,
          username: p.profiles?.username || "Unknown User",
          isOnline: p.profiles?.is_online || false,
          lastSeen: p.profiles?.last_seen || null,
        }));
  
        console.log("Fetched participants:", participantList.length);
        setParticipants(participantList);
  
        // Also update userProfiles with this data
        const profilesMap = {};
        participantList.forEach((p) => {
          profilesMap[p.id] = {
            id: p.id,
            username: p.username,
            isOnline: p.isOnline,
            lastSeen: p.lastSeen,
          };
        });
        
        // Use functional update to ensure we don't lose existing profiles
        setUserProfiles(prev => ({ ...prev, ...profilesMap }));
        return participantList;
      } else {
        console.error("Invalid participants data format:", data);
        setParticipants([]);
        return [];
      }
    } catch (e) {
      console.error("Exception fetching participants:", e.message);
      setParticipants([]);
      return [];
    }
  }

  async function fetchUserProfile(profileId) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, is_online, last_seen")
        .eq("id", profileId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error.message);
        return;
      }

      if (data) {
        setUserProfiles((prev) => ({
          ...prev,
          [profileId]: {
            ...data,
            isOnline: data.is_online,
            lastSeen: data.last_seen,
          },
        }));
      }
    } catch (e) {
      console.error("Exception fetching profile:", e.message);
    }
  }

  async function fetchMessages() {
    try {
      setIsRefreshing(false);
      console.log("Fetching messages for chat:", chatId);
  
      // Remove the timeout race - it may be causing issues
      const { data, error } = await supabase
        .from("messages")
        .select(`
          id,
          content,
          created_at,
          user_id,
          status,
          read_by,
        `)
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });
  
      if (error) {
        console.error("Error fetching messages:", error.message);
        throw error;
      }
  
      console.log("Fetched messages:", data ? data.length : 0);
  
      // Check that data is actually an array before setting state
      if (Array.isArray(data)) {
        setMessages(data);
  
        // Fetch profiles for all users in the messages
        const userIds = [...new Set(data.map((msg) => msg.user_id))];
        await Promise.all(userIds.map(fetchUserProfile));
      } else {
        console.error("Invalid messages data format:", data);
        setMessages([]);
      }
  
      // Mark messages as read separate from the main loading flow
      if (userId) {
        markChatMessagesAsRead(chatId, userId).catch(err => 
          console.error("Error marking messages as read:", err)
        );
      }
  
      return true;
    } catch (error) {
      console.error("Exception fetching messages:", error.message);
      Alert.alert("Error", "Failed to load messages. Please try again.");
      setMessages([]); 
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }

  async function updateMessageStatus(messageId, status, userId) {
    if (!messageId || !status || !userId) return;

    try {
      // First get the current message to handle read_by array
      const { data: message, error: fetchError } = await supabase
        .from("messages")
        .select("read_by, status")
        .eq("id", messageId)
        .single();

      if (fetchError) {
        console.error("Error fetching message:", fetchError.message);
        return;
      }

      const updateData = { status };

      // If status is 'read' and we have a userId, add to read_by array if not already there
      if (status === "read") {
        let readBy = [];
        try {
          readBy = message.read_by
            ? JSON.parse(JSON.stringify(message.read_by))
            : [];
        } catch (e) {
          console.error("Error parsing read_by:", e.message);
          readBy = [];
        }

        if (!readBy.includes(userId)) {
          readBy.push(userId);
          updateData.read_by = readBy;
        }
      }

      // Only update if status is changing to a "higher" status
      // Order: sent < delivered < read
      const statusOrder = { sent: 1, delivered: 2, read: 3 };
      if (statusOrder[status] > statusOrder[message.status]) {
        const { error } = await supabase
          .from("messages")
          .update(updateData)
          .eq("id", messageId);

        if (error) {
          console.error("Error updating message status:", error.message);
        }
      }
    } catch (e) {
      console.error("Exception updating message status:", e.message);
    }
  }

  async function markChatMessagesAsRead(chatId, userId) {
    if (!chatId || !userId) return;

    try {
      // Get all messages in the chat that aren't from the current user
      const { data, error } = await supabase
        .from("messages")
        .select("id")
        .eq("chat_id", chatId)
        .neq("user_id", userId)
        .neq("status", "read");

      if (error) {
        console.error(
          "Error fetching messages to mark as read:",
          error.message
        );
        return;
      }

      // Update each message
      for (const message of data) {
        await updateMessageStatus(message.id, "read", userId);
      }
    } catch (e) {
      console.error("Exception marking chat messages as read:", e.message);
    }
  }

  async function sendMessage() {
    if (!newMessage.trim() || !userId) return;

    try {
      setSending(true);
      console.log("Sending message to chat:", chatId);

      // Create a temporary message object to show immediately
      const tempMessage = {
        id: "temp-" + Date.now(),
        content: newMessage,
        created_at: new Date().toISOString(),
        user_id: userId,
        status: "sent",
        isTemp: true,
      };

      // Add to messages immediately for instant feedback
      setMessages((prevMessages) => [...prevMessages, tempMessage]);

      // Clear input field right away
      const messageToSend = newMessage;
      setNewMessage("");

      // Scroll to bottom
      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, 50);

      // Send to server
      const { data, error } = await supabase
        .from("messages")
        .insert([
          {
            chat_id: chatId,
            content: messageToSend,
            user_id: userId,
            status: "sent",
          },
        ])
        .select();

      if (error) {
        console.error("Error sending message:", error.message);

        // Remove the temporary message and show error
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== tempMessage.id)
        );

        throw error;
      }

      console.log("Message sent successfully:", data);

      // Replace the temporary message with the real one from the server
      if (data && data.length > 0) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => (msg.id === tempMessage.id ? data[0] : msg))
        );
      }
    } catch (error) {
      console.error("Exception sending message:", error.message);
      Alert.alert("Error", "Failed to send message: " + error.message);
    } finally {
      setSending(false);
    }
  }




  function renderMessage({ item }) {
    const isCurrentUser = item.user_id === userId;
    const profile = userProfiles[item.user_id];
    const username = profile ? profile.username : "Unknown User";

    

    return null;
  }
  console.log("Message",messages);async function fetchMessages() {
    console.log('fetchMessages called');
    try {
      // ...
    } catch (error) {
      console.error('Error fetching messages:', error.message);
    } finally {
      console.log('fetchMessages finished');
    }
  }
  // Get the other participant for 1-on-1 chats
  const otherParticipant =
    participants.length === 2 && userId
      ? participants.find((p) => p.id !== userId)
      : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>

          <View style={styles.headerProfile}>
            {otherParticipant ? (
              <>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {otherParticipant.username.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.headerTextContainer}>
                  <Text style={styles.headerText}>
                    {otherParticipant.username}
                  </Text>
                  <OnlineStatus
                    isOnline={otherParticipant.isOnline}
                    lastSeen={otherParticipant.lastSeen}
                    showText={true}
                  />
                </View>
              </>
            ) : (
              <Text style={styles.headerText}>{chatName}</Text>
            )}
          </View>

          <TouchableOpacity onPress={() => setInviteModalVisible(true)}>
            <Ionicons name="person-add" size={24} color="#4A90E2" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.loadingText}>Loading messages...</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.chatList}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            onLayout={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            refreshing={isRefreshing}
            onRefresh={fetchMessages}
          />
        )}

        <View style={styles.inputContainer}>
          {/* <TouchableOpacity
            style={styles.imageButton}
            onPress={pickImage}
            disabled={uploadingImage}
          >
            {uploadingImage ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="image" size={24} color="white" />
            )}
          </TouchableOpacity> */}

          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            multiline
            editable={!sending}
          />

          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
            disabled={!newMessage.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.sendButtonText}>Send</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Invite Users Modal */}
        {/* <Modal
          animationType="slide"
          transparent={true}
          visible={inviteModalVisible}
          onRequestClose={() => setInviteModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Invite Users</Text>
                <TouchableOpacity
                  onPress={() => setInviteModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search users by username..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={searchUsers}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={searchUsers}
                  disabled={searching || !searchQuery.trim()}
                >
                  {searching ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Ionicons name="search" size={20} color="white" />
                  )}
                </TouchableOpacity>
              </View>

              

              <View style={styles.participantsContainer}>
                <Text style={styles.sectionTitle}>
                  Current Participants ({participants.length})
                </Text>
                <FlatList
                  data={participants}
                  renderItem={({ item }) => (
                    <View style={styles.participantItem}>
                      <View style={styles.userAvatar}>
                        <Text style={styles.userAvatarText}>
                          {item.username.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <Text style={styles.username}>{item.username}</Text>
                      {item.id === userId && (
                        <Text style={styles.youLabel}>(You)</Text>
                      )}
                      <OnlineStatus
                        isOnline={item.isOnline}
                        lastSeen={item.lastSeen}
                        showText={true}
                      />
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                  style={styles.participantsList}
                />
              </View>
            </View>
          </View>
        </Modal> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  headerProfile: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  avatarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerTextContainer: {
    flexDirection: "column",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  chatList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 15,
    maxWidth: "80%",
  },
  currentUserMessage: {
    alignSelf: "flex-end",
  },
  otherUserMessage: {
    alignSelf: "flex-start",
  },
  messageSender: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
    marginLeft: 10,
  },
  messageContentRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  messageBubble: {
    borderRadius: 20,
    padding: 12,
  },
  currentUserBubble: {
    backgroundColor: "#DCF8C6",
  },
  otherUserBubble: {
    backgroundColor: "#E5E5EA",
  },
  tempMessageBubble: {
    opacity: 0.7,
  },
  imageBubble: {
    padding: 4,
    overflow: "hidden",
  },
  messageText: {
    fontSize: 16,
  },
  currentUserText: {
    color: "#333",
  },
  otherUserText: {
    color: "#333",
  },
  imageMessage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 2,
  },
  messageTime: {
    fontSize: 10,
    color: "#999",
    marginRight: 4,
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
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  imageButton: {
    marginRight: 8,
    backgroundColor: "#1D4ED8",
    padding: 10,
    borderRadius: 8,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    height: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 5,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
  },
  resultsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#666",
  },
  resultsList: {
    flex: 1,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  userAvatarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  username: {
    flex: 1,
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    padding: 20,
  },
  participantsContainer: {
    flex: 1,
  },
  participantsList: {
    flex: 1,
  },
  participantItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  youLabel: {
    fontSize: 14,
    color: "#999",
    marginLeft: 5,
    marginRight: 10,
  },
});

