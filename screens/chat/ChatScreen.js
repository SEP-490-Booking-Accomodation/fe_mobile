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
  AppState,
  SafeAreaView,
} from "react-native";
import { supabase } from "../../lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import OnlineStatus from "../../components/chat/OnlineStatus";
import MessageStatus from "../../components/chat/MessageStatus";
import { useAsyncStorage } from "../../context/AsyncStorageContext";
import { useTranslation } from "react-i18next";

export default function ChatScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { chatId, chatName } = route.params;
  // State management
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userProfiles, setUserProfiles] = useState({});
  const [participants, setParticipants] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);

  // Refs
  const flatListRef = useRef(null);
  const appState = useRef(AppState.currentState);
  const realtimeSubscription = useRef(null);

  // Hooks
  const { loadIdChatPlatform } = useAsyncStorage();

  // Load user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const user = await loadIdChatPlatform();

      if (user !== null && user.length > 0) {
        const storedUser = user[0];
        if (storedUser._id) setUserId(storedUser._id);
        if (storedUser.username) setUserName(storedUser.username);
      }
    };

    fetchUserData();
  }, []);

  // Configure navigation options
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation, participants, userId]);

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
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
  }, [userId, chatId]);

  // Mark messages as read when entering the chat
  useEffect(() => {
    if (userId && !loading) {
      markChatMessagesAsRead(chatId, userId);
    }
  }, [userId, loading, chatId]);

  // Initialize chat data and realtime subscription
  useEffect(() => {
    if (userId) {
      setLoading(true);

      // First fetch data only
      fetchMessages()
        .then(() => fetchParticipants())
        .then(() => {
          // Only setup realtime after data is loaded
          setupRealtimeSubscription();
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error initializing chat:", error);
          setLoading(false);
          Alert.alert(t("error"), t("failed_to_load_chat"));
        });
    }

    return () => {
      if (realtimeSubscription.current) {
        realtimeSubscription.current.unsubscribe();
      }
    };
  }, [chatId, userId]);

  // Setup realtime subscription for new messages
  function setupRealtimeSubscription() {
    try {
      // Clean up any existing subscription
      if (realtimeSubscription.current) {
        realtimeSubscription.current.unsubscribe();
      }

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
            // Add the new message to the state
            setMessages((prevMessages) => {
              // Check if we already have this message to avoid duplicates
              if (prevMessages.some((msg) => msg.id === payload.new.id)) {
                return prevMessages;
              }

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
            // Update the message in state
            setMessages((prevMessages) =>
              prevMessages.map((msg) =>
                msg.id === payload.new.id ? { ...msg, ...payload.new } : msg
              )
            );
          }
        )
        .subscribe();
    } catch (error) {
      console.error("Error setting up realtime subscription:", error);
    }
  }

  // Fetch chat participants
  async function fetchParticipants() {
    try {
      const { data, error } = await supabase
        .from("chat_participants")
        .select(
          `
          user_id,
          profiles:user_id(id, username, is_online, last_seen)
        `
        )
        .eq("chat_id", chatId);

      if (error) throw error;

      if (Array.isArray(data)) {
        const participantList = data.map((p) => ({
          id: p.user_id,
          username: p.profiles?.username || t("unknown_user"),
          isOnline: p.profiles?.is_online || false,
          lastSeen: p.profiles?.last_seen || null,
        }));

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

        setUserProfiles((prev) => ({ ...prev, ...profilesMap }));
        return participantList;
      } else {
        setParticipants([]);
        return [];
      }
    } catch (e) {
      console.error("Exception fetching participants:", e.message);
      setParticipants([]);
      return [];
    }
  }

  // Fetch user profile
  async function fetchUserProfile(profileId) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, is_online, last_seen")
        .eq("id", profileId)
        .single();

      if (error) return;

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

  // Fetch messages
  async function fetchMessages() {
    try {
      setIsRefreshing(false);

      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          id,
          content,
          created_at,
          user_id,
          status,
          read_by
        `
        )
        .eq("chat_id", chatId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Check that data is actually an array before setting state
      if (Array.isArray(data)) {
        setMessages(data);

        // Fetch profiles for all users in the messages
        const userIds = [...new Set(data.map((msg) => msg.user_id))];
        await Promise.all(userIds.map(fetchUserProfile));
      } else {
        setMessages([]);
      }

      // Mark messages as read separate from the main loading flow
      if (userId) {
        markChatMessagesAsRead(chatId, userId).catch((err) =>
          console.error("Error marking messages as read:", err)
        );
      }

      return true;
    } catch (error) {
      console.error("Exception fetching messages:", error.message);
      Alert.alert(t("error"), t("failed_to_load_messages"));
      setMessages([]);
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }

  // Update message status
  async function updateMessageStatus(messageId, status, userId) {
    if (!messageId || !status || !userId) return;

    try {
      // First get the current message to handle read_by array
      const { data: message, error: fetchError } = await supabase
        .from("messages")
        .select("read_by, status")
        .eq("id", messageId)
        .single();

      if (fetchError) return;

      const updateData = { status };

      // If status is 'read' and we have a userId, add to read_by array if not already there
      if (status === "read") {
        let readBy = [];
        try {
          readBy = message.read_by
            ? JSON.parse(JSON.stringify(message.read_by))
            : [];
        } catch (e) {
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
        await supabase.from("messages").update(updateData).eq("id", messageId);
      }
    } catch (e) {
      console.error("Exception updating message status:", e.message);
    }
  }

  // Mark all messages as read
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

      if (error) return;

      // Update each message
      for (const message of data) {
        await updateMessageStatus(message.id, "read", userId);
      }
    } catch (e) {
      console.error("Exception marking chat messages as read:", e.message);
    }
  }

  // Send a new message
  async function sendMessage() {
    if (!newMessage.trim() || !userId) return;

    try {
      setSending(true);

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
        // Remove the temporary message and show error
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== tempMessage.id)
        );

        throw error;
      }

      // Replace the temporary message with the real one from the server
      if (data && data.length > 0) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => (msg.id === tempMessage.id ? data[0] : msg))
        );
      }
    } catch (error) {
      console.error("Exception sending message:", error.message);
      Alert.alert(t("error"), t("failed_to_send_message") + error.message);
    } finally {
      setSending(false);
    }
  }

  // Render a message
  function renderMessage({ item }) {
    const isCurrentUser = item.user_id === userId;
    const profile = userProfiles[item.user_id];
    const username = profile ? profile.username : t("unknown_user");

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
        ]}
      >
        {!isCurrentUser && <Text style={styles.messageSender}>{username}</Text>}
        <View style={styles.messageContentRow}>
          <View
            style={[
              styles.messageBubble,
              isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
              item.isTemp && styles.tempMessageBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                isCurrentUser ? styles.currentUserText : styles.otherUserText,
              ]}
            >
              {item.content}
            </Text>
          </View>
        </View>
        <View style={styles.messageFooter}>
          <Text style={styles.messageTime}>
            {new Date(item.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          {isCurrentUser && <MessageStatus status={item.status} />}
        </View>
      </View>
    );
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("MessagesScreen")}
          >
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

          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="#4A90E2" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.loadingText}>{t("loading_messages")}</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMessage}
            contentContainerStyle={styles.chatList}
            onRefresh={fetchMessages}
            refreshing={isRefreshing}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: false })
            }
          />
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder={t("type_a_message")}
            multiline
            editable={!sending}
            placeholderTextColor="#999"
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              !newMessage.trim() || sending ? styles.sendButtonDisabled : null,
            ]}
            onPress={sendMessage}
            disabled={!newMessage.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="send" size={20} color="white" />
            )}
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
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  backButton: {
    padding: 8,
  },
  headerProfile: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
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
  headerButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  chatList: {
    padding: 16,
    paddingBottom: 24,
  },
  messageContainer: {
    marginBottom: 16,
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
    borderRadius: 18,
    padding: 12,
    maxWidth: "100%",
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
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  currentUserText: {
    color: "#333",
  },
  otherUserText: {
    color: "#333",
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 4,
    paddingRight: 4,
  },
  messageTime: {
    fontSize: 11,
    color: "#999",
    marginRight: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: "#F8F9FA",
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#4A90E2",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#A0C2E7",
  },
});
