import AsyncStorage from "@react-native-async-storage/async-storage"
import { createClient } from "@supabase/supabase-js"

// Replace with your Supabase URL and anon key
const supabaseUrl = process.env.SUPABASE_API_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Check if URL and key are provided
if (!supabaseUrl || supabaseUrl === "YOUR_SUPABASE_URL") {
    console.error("⚠️ Supabase URL is not set! Please update lib/supabase.js with your Supabase URL")
}

if (!supabaseAnonKey || supabaseAnonKey === "YOUR_SUPABASE_ANON_KEY") {
    console.error("⚠️ Supabase Anon Key is not set! Please update lib/supabase.js with your Supabase Anon Key")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
    realtime: {
        params: {
            eventsPerSecond: 40,
        },
    },
})

// Enable enhanced realtime functionality
supabase.realtime.setAuth(supabaseAnonKey)

// User status management
export const updateUserStatus = async (userId, isOnline) => {
    if (!userId) return

    try {
        console.log(`Updating user ${userId} status to ${isOnline ? "online" : "offline"}`)

        // Only update is_online, let the trigger handle last_seen
        const { error } = await supabase.from("profiles").update({ is_online: isOnline }).eq("id", userId)

        if (error) {
            console.error("Error updating user status:", error.message)
        }
    } catch (e) {
        console.error("Exception updating user status:", e.message)
    }
}

export const ensureUserInDatabase = async (userId, username) => {
    if (!userId || !username) {
      console.error("Cannot ensure user in database: missing userId or username")
      return null
    }
  
    try {
      console.log(`Checking if user ${userId} exists in database...`)
  
      // First check if user exists
      const { data: existingUser, error: fetchError } = await supabase
        .from("profiles")
        .select("id, username, is_online, last_seen")
        .eq("id", userId)
        .single()
  
      // If user exists, update online status and return
      if (existingUser) {
        console.log("User exists, updating online status")
  
        // Update online status
        const { error: updateError } = await supabase.from("profiles").update({ is_online: true }).eq("id", userId)
  
        if (updateError) {
          console.error("Error updating user online status:", updateError.message)
        }
  
        return existingUser
      }
  
      // If user doesn't exist, create new profile
      if (fetchError && fetchError.code === "PGRST116") {
        // PGRST116 is "not found" error
        console.log("User not found, creating new profile")
  
        const { data: newUser, error: insertError } = await supabase
          .from("profiles")
          .insert([
            {
              id: userId,
              username: username,
              is_online: true,
              last_seen: new Date().toISOString(),
            },
          ])
          .select()
          .single()
  
        if (insertError) {
          console.error("Error creating user profile:", insertError.message)
          return null
        }
  
        console.log("New user profile created:", newUser)
        return newUser
      }
  
      // Handle other errors
      if (fetchError) {
        console.error("Error checking user existence:", fetchError.message)
        return null
      }
  
      return null
    } catch (e) {
      console.error("Exception ensuring user in database:", e.message)
      return null
    }
  }
  

// Message status management
export const updateMessageStatus = async (messageId, status, userId) => {
    if (!messageId || !status || !userId) return

    try {
        // First get the current message to handle read_by array
        const { data: message, error: fetchError } = await supabase
            .from("messages")
            .select("read_by, status")
            .eq("id", messageId)
            .single()

        if (fetchError) {
            console.error("Error fetching message:", fetchError.message)
            return
        }

        const updateData = { status }

        // If status is 'read' and we have a userId, add to read_by array if not already there
        if (status === "read") {
            let readBy = []
            try {
                readBy = message.read_by ? JSON.parse(JSON.stringify(message.read_by)) : []
            } catch (e) {
                console.error("Error parsing read_by:", e.message)
                readBy = []
            }

            if (!readBy.includes(userId)) {
                readBy.push(userId)
                updateData.read_by = readBy
            }
        }

        // Only update if status is changing to a "higher" status
        // Order: sent < delivered < read
        const statusOrder = { sent: 1, delivered: 2, read: 3 }
        if (statusOrder[status] > statusOrder[message.status]) {
            const { error } = await supabase.from("messages").update(updateData).eq("id", messageId)

            if (error) {
                console.error("Error updating message status:", error.message)
            }
        }
    } catch (e) {
        console.error("Exception updating message status:", e.message)
    }
}

// Update all unread messages in a chat to 'read'
export const markChatMessagesAsRead = async (chatId, userId) => {
    if (!chatId || !userId) return

    try {
        // Get all messages in the chat that aren't from the current user
        const { data: messages, error: fetchError } = await supabase
            .from("messages")
            .select("id, read_by")
            .eq("chat_id", chatId)
            .neq("user_id", userId)

        if (fetchError) {
            console.error("Error fetching messages to mark as read:", fetchError.message)
            return
        }

        // Update each message
        for (const message of messages) {
            await updateMessageStatus(message.id, "read", userId)
        }
    } catch (e) {
        console.error("Exception marking chat messages as read:", e.message)
    }
}

// Test function to verify Supabase connection
export const testSupabaseConnection = async () => {
    try {
        console.log("Testing Supabase connection...")
        const { data, error } = await supabase.from("chats").select("count").limit(1)

        if (error) {
            console.error("Supabase connection test failed:", error.message)
            return false
        }

        console.log("Supabase connection successful!")
        return true
    } catch (e) {
        console.error("Supabase connection test exception:", e.message)
        return false
    }
}

// Run test on import
console.log(
    "Supabase client initialized with URL:",
    supabaseUrl !== "YOUR_SUPABASE_URL" ? "URL provided" : "URL MISSING",
)

