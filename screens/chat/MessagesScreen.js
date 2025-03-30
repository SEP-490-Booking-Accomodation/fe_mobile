
import { useState, useEffect } from "react"
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native"
import { supabase } from "../../lib/supabase"
import { Ionicons } from "@expo/vector-icons"

export default function ChatListScreen({ navigation, userId, username }) {
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [newChatName, setNewChatName] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [lastMessages, setLastMessages] = useState({})
  const [unreadCounts, setUnreadCounts] = useState({})
  const [userProfiles, setUserProfiles] = useState({})
  const [searchText, setSearchText] = useState("")
  const [filteredChats, setFilteredChats] = useState([])

  useEffect(() => {
    if (userId) {
      // Update user status to online
      updateUserOnlineStatus(true)

      // Subscribe to changes in the chats table
      const subscription = supabase
          .channel("public:chats")
          .on("postgres_changes", { event: "*", schema: "public", table: "chats" }, () => {
            console.log("Chat changes detected, refreshing...")
            fetchChats()
          })
          .subscribe()

      // Subscribe to changes in the messages table
      const messagesSubscription = supabase
          .channel("public:messages")
          .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
            console.log("New message detected, refreshing chat list...")
            fetchLastMessages()
            fetchUnreadCounts()
          })
          .subscribe()

      // Fetch initial data
      fetchChats()

      return () => {
        // Update user status to offline when component unmounts
        updateUserOnlineStatus(false)
        subscription.unsubscribe()
        messagesSubscription.unsubscribe()
      }
    }
  }, [userId])

  // Filter chats when search text changes
  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredChats(chats)
    } else {
      const filtered = chats.filter((chat) => {
        // Check if chat name contains search text
        if (chat.name.toLowerCase().includes(searchText.toLowerCase())) {
          return true
        }

        // Check if any participant's username contains search text
        if (
            chat.participants &&
            chat.participants.some((p) => p.username && p.username.toLowerCase().includes(searchText.toLowerCase()))
        ) {
          return true
        }

        // Check if last message contains search text
        const lastMessage = lastMessages[chat.id]
        if (
            lastMessage &&
            lastMessage.content &&
            lastMessage.content.toLowerCase().includes(searchText.toLowerCase())
        ) {
          return true
        }

        return false
      })
      setFilteredChats(filtered)
    }
  }, [searchText, chats, lastMessages])

  async function updateUserOnlineStatus(isOnline) {
    try {
      const { error } = await supabase
          .from("profiles")
          .update({
            is_online: isOnline,
            ...(isOnline ? {} : { last_seen: new Date().toISOString() }),
          })
          .eq("id", userId)

      if (error) {
        console.error("Error updating online status:", error.message)
      }
    } catch (e) {
      console.error("Exception updating online status:", e.message)
    }
  }

  async function fetchChats() {
    if (!userId) {
      console.log("No user ID available, skipping fetch chats")
      setLoading(false)
      return
    }

    try {
      console.log("Fetching chats for user:", userId)
      setRefreshing(true)

      // First, get all chat IDs where the user is a participant
      const { data: participantData, error: participantError } = await supabase
          .from("chat_participants")
          .select("chat_id")
          .eq("user_id", userId)

      if (participantError) {
        console.error("Error fetching chat participants:", participantError.message)
        throw participantError
      }

      if (!participantData || participantData.length === 0) {
        console.log("No chats found for user")
        setChats([])
        setFilteredChats([])
        return
      }

      // Extract chat IDs
      const chatIds = participantData.map((p) => p.chat_id)
      console.log("Found chat IDs:", chatIds)

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
          .order("created_at", { ascending: false })

      if (chatError) {
        console.error("Error fetching chats:", chatError.message)
        throw chatError
      }

      console.log("Fetched chats:", chatData ? chatData.length : 0)

      // Process chat data to include participants
      const processedChats = chatData.map((chat) => {
        const otherParticipants = chat.chat_participants.filter((p) => p.user_id !== userId).map((p) => p.profiles)

        return {
          ...chat,
          participants: otherParticipants,
        }
      })

      setChats(processedChats || [])
      setFilteredChats(processedChats || [])

      // Update user profiles
      const profilesMap = {}
      processedChats.forEach((chat) => {
        chat.participants.forEach((p) => {
          if (p) {
            profilesMap[p.id] = {
              id: p.id,
              username: p.username,
              isOnline: p.is_online,
              lastSeen: p.last_seen,
            }
          }
        })
      })
      setUserProfiles((prev) => ({ ...prev, ...profilesMap }))

      // Fetch last messages and unread counts
      fetchLastMessages(chatIds)
      fetchUnreadCounts(chatIds)
    } catch (error) {
      console.error("Exception fetching chats:", error.message)
      Alert.alert("Error", "Failed to load chats: " + error.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  async function fetchLastMessages(chatIds = null) {
    if (!userId) return

    if (!chatIds) {
      chatIds = chats.map((chat) => chat.id)
    }

    if (chatIds.length === 0) return

    try {
      // For each chat, get the most recent message
      const promises = chatIds.map(async (chatId) => {
        const { data, error } = await supabase
            .from("messages")
            .select("id, content, created_at, user_id, status, type")
            .eq("chat_id", chatId)
            .order("created_at", { ascending: false })
            .limit(1)

        if (error) {
          console.error(`Error fetching last message for chat ${chatId}:`, error.message)
          return null
        }

        return { chatId, message: data && data.length > 0 ? data[0] : null }
      })

      const results = await Promise.all(promises)

      // Convert array of results to an object keyed by chatId
      const messagesMap = {}
      results.forEach((result) => {
        if (result && result.message) {
          messagesMap[result.chatId] = result.message
        }
      })

      setLastMessages(messagesMap)
    } catch (e) {
      console.error("Exception fetching last messages:", e.message)
    }
  }

  async function fetchUnreadCounts(chatIds = null) {
    if (!userId) return

    if (!chatIds) {
      chatIds = chats.map((chat) => chat.id)
    }

    if (chatIds.length === 0) return

    try {
      // For each chat, count unread messages
      const promises = chatIds.map(async (chatId) => {
        const { data, error } = await supabase
            .from("messages")
            .select("id", { count: "exact" })
            .eq("chat_id", chatId)
            .neq("user_id", userId)
            .neq("status", "read")

        if (error) {
          console.error(`Error fetching unread count for chat ${chatId}:`, error.message)
          return { chatId, count: 0 }
        }

        return { chatId, count: data ? data.length : 0 }
      })

      const results = await Promise.all(promises)

      // Convert array of results to an object keyed by chatId
      const countsMap = {}
      results.forEach((result) => {
        countsMap[result.chatId] = result.count
      })

      setUnreadCounts(countsMap)
    } catch (e) {
      console.error("Exception fetching unread counts:", e.message)
    }
  }

  // async function createNewChat() {
  //   if (!newChatName.trim()) {
  //     Alert.alert("Error", "Please enter a chat name")
  //     return
  //   }
  //
  //   try {
  //     setCreating(true)
  //     console.log("Creating new chat:", newChatName)
  //
  //     // Insert new chat
  //     const { data: chatData, error: chatError } = await supabase
  //         .from("chats")
  //         .insert([{ name: newChatName }])
  //         .select()
  //
  //     if (chatError) {
  //       console.error("Error creating chat:", chatError.message)
  //       throw chatError
  //     }
  //
  //     if (!chatData || chatData.length === 0) {
  //       throw new Error("No chat data returned after creation")
  //     }
  //
  //     console.log("Chat created:", chatData[0].id)
  //
  //     // Add current user as participant
  //     const { error: participantError } = await supabase
  //         .from("chat_participants")
  //         .insert([{ chat_id: chatData[0].id, user_id: userId }])
  //
  //     if (participantError) {
  //       console.error("Error adding participant:", participantError.message)
  //       throw participantError
  //     }
  //
  //     console.log("Added user as participant")
  //     setModalVisible(false)
  //     setNewChatName("")
  //
  //     // Fetch chats again to update the list
  //     await fetchChats()
  //
  //     // Navigate to the new chat
  //     navigation.navigate("Chat", {
  //       chatId: chatData[0].id,
  //       chatName: chatData[0].name,
  //     })
  //   } catch (error) {
  //     console.error("Exception creating chat:", error.message)
  //     Alert.alert("Error", "Failed to create chat: " + error.message)
  //   } finally {
  //     setCreating(false)
  //   }
  // }

  function handlePressChat(chat) {
    // Get the other participant for 1-on-1 chats
    const otherParticipant = chat.participants && chat.participants.length === 1 ? chat.participants[0] : null

    // Display name - use other participant's name for 1-on-1 chats
    const displayName = otherParticipant ? otherParticipant.username : chat.name

    navigation.navigate("Chat", {
      chatId: chat.id,
      chatName: displayName,
    })
  }

  function renderChatItem({ item }) {
    const lastMessage = lastMessages[item.id]
    const unreadCount = unreadCounts[item.id] || 0

    // Get the other participant for 1-on-1 chats
    const otherParticipant = item.participants && item.participants.length === 1 ? item.participants[0] : null

    // Display name - use other participant's name for 1-on-1 chats
    const displayName = otherParticipant ? otherParticipant.username : item.name

    // Get online status
    const isOnline = otherParticipant ? otherParticipant.is_online : false

    // Format time
    const formatTime = (timestamp) => {
      if (!timestamp) return ""

      const date = new Date(timestamp)
      const now = new Date()

      // Check if it's today
      if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }

      // Check if it's yesterday
      const yesterday = new Date(now)
      yesterday.setDate(now.getDate() - 1)
      if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday"
      }

      // Otherwise return the date
      return date.toLocaleDateString()
    }

    // Format message preview based on type
    const getMessagePreview = (message) => {
      if (!message) return "No messages yet"

      if (message.type === "image") {
        return "📷 Image"
      }

      return message.content
    }

    return (
        <TouchableOpacity style={styles.messageItem} onPress={() => handlePressChat(item)}>
          <View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
            </View>
            {isOnline && (
                <View style={styles.onlineIndicator}>
                  <View style={styles.onlineIndicatorDot}></View>
                </View>
            )}
          </View>

          <View style={styles.messageInfo}>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={[styles.message, unreadCount > 0 && styles.unreadMessage]} numberOfLines={1}>
              {getMessagePreview(lastMessage)}
            </Text>
          </View>

          <View style={styles.rightContainer}>
            <Text style={styles.time}>
              {lastMessage ? formatTime(lastMessage.created_at) : formatTime(item.created_at)}
            </Text>
            {unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{unreadCount}</Text>
                </View>
            )}
          </View>
        </TouchableOpacity>
    )
  }

  return (
      <View style={styles.container}>
        {/* Search bar
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput style={styles.searchInput} placeholder="Search..." value={searchText} onChangeText={setSearchText} />
        </View> */}

        {/* Header with new chat button */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Conversations</Text>
          {/* <TouchableOpacity style={styles.newChatButton} onPress={() => setModalVisible(true)}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity> */}
        </View>

        {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4A90E2" />
              <Text style={styles.loadingText}>Loading chats...</Text>
            </View>
        ) : filteredChats.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>Chưa có cuộc hội thoại nào</Text>
              {/* <Text style={styles.emptyStateSubtext}>Tap the + button to start a new chat</Text> */}
            </View>
        ) : (
            <FlatList
                data={filteredChats}
                renderItem={renderChatItem}
                keyExtractor={(item) => item.id.toString()}
                refreshing={refreshing}
                onRefresh={() => fetchChats()}
                contentContainerStyle={styles.list}
            />
        )}

        {/* New Chat Modal */}
        {/* <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>New Conversation</Text>
              <TextInput
                  style={styles.modalInput}
                  placeholder="Enter chat name"
                  value={newChatName}
                  onChangeText={setNewChatName}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setModalVisible(false)}
                    disabled={creating}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.modalButton, styles.createButton]}
                    onPress={createNewChat}
                    disabled={creating}
                >
                  {creating ? (
                      <ActivityIndicator size="small" color="white" />
                  ) : (
                      <Text style={styles.createButtonText}>Create</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal> */}
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
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
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    height: 40,
    paddingHorizontal: 12,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "white",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  newChatButton: {
    backgroundColor: "#4A90E2",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    paddingHorizontal: 16,
  },
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
    backgroundColor: "#4A90E2",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatarText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  onlineIndicator: {
    width: 20,
    height: 20,
    borderRadius: 25,
    backgroundColor: "white",
    position: "absolute",
    right: 10,
    bottom: 0,
  },
  onlineIndicatorDot: {
    width: 15,
    height: 15,
    borderRadius: 25,
    backgroundColor: "#4CAF50",
    margin: 3,
  },
  messageInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  message: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  unreadMessage: {
    fontWeight: "bold",
    color: "#000",
  },
  rightContainer: {
    alignItems: "flex-end",
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
  unreadBadge: {
    backgroundColor: "#4A90E2",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    paddingHorizontal: 5,
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
    marginTop: 10,
    color: "#666",
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
    color: "#666",
    marginBottom: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  cancelButtonText: {
    color: "#666",
  },
  createButton: {
    backgroundColor: "#4A90E2",
  },
  createButtonText: {
    color: "white",
    fontWeight: "bold",
  },
})

