import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { useAsyncStorage } from "../context/AsyncStorageContext";

// Load environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || supabaseUrl === "YOUR_SUPABASE_URL") {
  console.error("⚠️ Supabase URL is not set! Please update your environment variables.");
}
if (!supabaseAnonKey || supabaseAnonKey === "YOUR_SUPABASE_ANON_KEY") {
  console.error("⚠️ Supabase Anon Key is not set! Please update your environment variables.");
}

// Initialize Supabase client
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
});

// Enable realtime functionality
supabase.realtime.setAuth(supabaseAnonKey);

/**
 * Ensures a user exists in the database.
 *
 * @param {string} userId The ID of the user to ensure
 * @param {string} username The username of the user to ensure
 */
export const ensureUserInDatabase = async (userId, username, context) => {
  if (!userId || !username) {
    console.error("Cannot ensure user in database: missing userId or username");
    return null;
  }

  try {
    console.log(`Checking if user ${userId} exists in database...`);

    // Use context functions passed from the component
    const { removeAllIdChatPlaform, addIdChatPlatform, loadIdChatPlatform } = context;

    // Check if user exists in Supabase
    const { data: existingUser, error: fetchError } = await supabase
      .from("profiles")
      .select("id, iduserplatform, username, is_online, last_seen")
      .eq("iduserplatform", userId)
      .single();

    if (existingUser) {
      console.log("User exists, updating online status...");
      
      // Remove all existing platform IDs and add the new one
      
      await addIdChatPlatform({
        _id: existingUser.id,
        iduserplatform: existingUser.iduserplatform,
        username: existingUser.username
      });
      var user = await loadIdChatPlatform();
      console.log("User data loaded from AsyncStorage:", user);
      
      

      // Update online status
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ is_online: true })
        .eq("iduserplatform", userId);

      if (updateError) {
        console.error("Error updating user online status:", updateError.message);
      }

      return existingUser;
    }

    // If user doesn't exist, create new profile
    if (fetchError && fetchError.code === "PGRST116") {
      console.log("User not found, creating new profile...");

      const { data: newUser, error: insertError } = await supabase
        .from("profiles")
        .insert([
          {
            iduserplatform: userId,
            username: username,
            is_online: true,
            last_seen: new Date().toISOString(),
            role: false,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Error creating user profile:", insertError.message);
        return null;
      }

      // Clear existing and add the new platform ID
      await removeAllIdChatPlaform();
      await addIdChatPlatform({
        _id: newUser.id,
        iduserplatform: newUser.iduserplatform,
        username: newUser.username
      });

      console.log("New user profile created:", newUser);
      return newUser;
    }

    if (fetchError) {
      console.error("Error checking user existence:", fetchError.message);
      return null;
    }

    return null;
  } catch (e) {
    console.error("Exception ensuring user in database:", e.message);
    return null;
  }
};


export const ensureUserInDatabaseWithoutAsyncStorage = async (userId, username) => {
  if (!userId || !username) {
    console.error("Cannot ensure user in database: missing userId or username");
    return null;
  }
  
  try {
    console.log(`Checking if user ${userId} exists in database...`);
    
    // Check if user exists in Supabase
    const { data: existingUser, error: fetchError } = await supabase
      .from("profiles")
      .select("id, iduserplatform, username, is_online, last_seen")
      .eq("iduserplatform", userId)
      .single();
 
    if (existingUser) {
      console.log("User exists, updating online status...");
      
      // Update online status
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ is_online: true })
        .eq("iduserplatform", userId);
        
      if (updateError) {
        console.error("Error updating user online status:", updateError.message);
      }
      
      return existingUser;
    }
    
    // If user doesn't exist, create new profile
    if (fetchError && fetchError.code === "PGRST116") {
      console.log("User not found, creating new profile...");
      
      const { data: newUser, error: insertError } = await supabase
        .from("profiles")
        .insert([
          {
            iduserplatform: userId,
            username: username,
            is_online: true,
            last_seen: new Date().toISOString(),
            role: false,
          },
        ])
        .select()
        .single();
        
      if (insertError) {
        console.error("Error creating user profile:", insertError.message);
        return null;
      }
      
      console.log("New user profile created:", newUser);
      return newUser;
    }
    
    if (fetchError) {
      console.error("Error checking user existence:", fetchError.message);
      return null;
    }
    
    return null;
  } catch (e) {
    console.error("Exception ensuring user in database:", e.message);
    return null;
  }
 };

export const newChat = async ({ownerId,  ownerPlatformId, locationId}) => {
  try {
    const {loadIdChatPlatform} = useAsyncStorage();
    const currentUser = loadIdChatPlatform();
    const currentUserId = currentUser[0]?._id;
    const currentUsername = currentUser[0]?.username;
    if (!currentUserId || !rental || !locationId || !ownerId || !ownerPlatformId) {
      // Check if all required information is available
      console.error("Missing required information to start chat")
      alert("Could not start chat. Missing user or rental information.")
      return
    }

    // Don't allow chatting with yourself
    if (currentUserId === ownerId) {
      alert("You cannot start a chat with yourself.")
      return
    }

    console.log(`Starting chat with owner: ${ownerId} for rental: ${locationId}`)

    // First, check if a direct chat already exists between these users
    const { data: existingChats, error: checkError } = await supabase
      .from("chat_participants")
      .select(`
        chat_id,
        chats:chat_id (
          id,
          name,
          chat_participants (user_id)
        )
      `)
      .eq("user_id", currentUserId)

    if (checkError) {
      console.error("Error checking existing chats:", checkError.message)
      throw checkError
    }

    // Find chats where both users are participants and it's just the two of them
    let existingDirectChat = null

    if (existingChats && existingChats.length > 0) {
      for (const chat of existingChats) {
        // Get all participants for this chat
        const { data: participants, error: participantsError } = await supabase
          .from("chat_participants")
          .select("user_id")
          .eq("chat_id", chat.chat_id)

        if (participantsError) {
          console.error("Error fetching participants:", participantsError.message)
          continue
        }

        // Check if this is a direct chat between the two users
        if (
          participants.length === 2 &&
          participants.some((p) => p.user_id === rental.owner_id) &&
          participants.some((p) => p.user_id === currentUserId)
        ) {
          existingDirectChat = chat.chats
          break
        }
      }
    }

    // If direct chat already exists, navigate to it
    if (existingDirectChat) {
      console.log("Direct chat already exists, navigating to it")
      navigation.navigate("Chat", {
        chatId: existingDirectChat.id,
        chatName: rental.owner_name || "Rental Owner",
        userId: currentUserId,
        username: currentUsername,
      })
      return
    }

    // Create a new chat with the rental owner's name
    const chatName = `Chat with ${rental.owner_name || "Rental Owner"}`

    const { data: chatData, error: chatError } = await supabase
      .from("chats")
      .insert([{ name: chatName }])
      .select()

    if (chatError) {
      console.error("Error creating chat:", chatError.message)
      throw chatError
    }

    if (!chatData || chatData.length === 0) {
      throw new Error("No chat data returned after creation")
    }

    const newChatId = chatData[0].id
    console.log("Chat created:", newChatId)

    // Add both users as participants
    const { error: participantError } = await supabase.from("chat_participants").insert([
      { chat_id: newChatId, user_id: currentUserId },
      { chat_id: newChatId, user_id: rental.owner_id },
    ])

    if (participantError) {
      console.error("Error adding participants:", participantError.message)
      throw participantError
    }

    console.log("Added both users as participants")

    // Navigate to the new chat
    navigation.navigate("Chat", {
      chatId: newChatId,
      chatName: rental.owner_name || "Rental Owner",
      userId: currentUserId,
      username: currentUsername,
    })
  } catch (error) {
    console.error("Exception starting chat with owner:", error.message)
    alert("Failed to start conversation with the owner. Please try again later.")
  }

};

