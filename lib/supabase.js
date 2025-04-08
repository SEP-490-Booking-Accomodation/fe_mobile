import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { useAsyncStorage } from "../context/AsyncStorageContext";

// Load environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || supabaseUrl === "YOUR_SUPABASE_URL") {
  console.error(
    "⚠️ Supabase URL is not set! Please update your environment variables."
  );
}
if (!supabaseAnonKey || supabaseAnonKey === "YOUR_SUPABASE_ANON_KEY") {
  console.error(
    "⚠️ Supabase Anon Key is not set! Please update your environment variables."
  );
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
    const { removeAllIdChatPlaform, addIdChatPlatform, loadIdChatPlatform } =
      context;

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
        username: existingUser.username,
      });
      var user = await loadIdChatPlatform();
      console.log("User data loaded from AsyncStorage:", user);

      // Update online status
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ is_online: true })
        .eq("iduserplatform", userId);

      if (updateError) {
        console.error(
          "Error updating user online status:",
          updateError.message
        );
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
        username: newUser.username,
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

export const ensureUserInDatabaseWithoutAsyncStorage = async (
  userId,
  username
) => {
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
        console.error(
          "Error updating user online status:",
          updateError.message
        );
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

export const registerUserInSupabase = async (
  userIdPlatform,
  username,
  role
) => {
  if (!userIdPlatform || !username) {
    console.error("Cannot register user: missing userId or username");
    return null;
  }

  try {
    console.log(`Registering user ${userIdPlatform}...`);

    // First, try to update an existing user
    const { data: updatedUser, error: updateError } = await supabase
      .from("profiles")
      .update({
        is_online: true,
        last_seen: new Date().toISOString(),
        // Only update username if it's different (optional)
        ...(username && { username }),
      })
      .eq("iduserplatform", userIdPlatform)
      .select("id, iduserplatform, username, is_online, last_seen, role")
      .single();

    // If the update succeeded, return the updated user
    if (!updateError && updatedUser) {
      console.log("User updated successfully:", updatedUser);
      return updatedUser;
    }

    // If user doesn't exist, create a new profile with upsert to handle potential race conditions
    console.log(
      "User not found or couldn't be updated, creating new profile..."
    );
    const { data: newUser, error: insertError } = await supabase
      .from("profiles")
      .upsert(
        [
          {
            iduserplatform: userIdPlatform,
            username: username,
            is_online: true,
            last_seen: new Date().toISOString(),
            role: role || "user", // Default role if none provided
          },
        ],
        {
          onConflict: "iduserplatform", // Specify the conflict column
          ignoreDuplicates: false, // Update if duplicate found
        }
      )
      .select("id, iduserplatform, username, is_online, last_seen, role")
      .single();

    if (insertError) {
      console.error("Error registering user:", insertError.message);
      return null;
    }

    if (!newUser) {
      console.error("No user data returned after insertion");

      // Fallback: try to fetch the user one more time
      const { data: fetchedUser } = await supabase
        .from("profiles")
        .select("id, iduserplatform, username, is_online, last_seen, role")
        .eq("iduserplatform", userIdPlatform)
        .single();

      if (fetchedUser) {
        console.log("User fetched as fallback:", fetchedUser);
        return fetchedUser;
      }

      return null;
    }

    console.log("User registered successfully:", newUser);
    return newUser;
  } catch (e) {
    console.error("Exception registering user:", e.message);
    return null;
  }
};
export const getUserByUserPlatformId = async (userIdPlatform) => {
  if (!userIdPlatform) {
    console.error("Cannot fetch user: missing userId");
    return null;
  }

  try {
    console.log(`Fetching user with ID ${userIdPlatform}...`);

    const { data: user, error } = await supabase
      .from("profiles")
      .select("id, iduserplatform")
      .eq("iduserplatform", userIdPlatform)
      .single();

    if (user) {
      console.log("User fetched successfully:", user);
      // Update online status
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ is_online: true })
        .eq("iduserplatform", userIdPlatform);
      if (updateError) {
        console.error(
          "Error updating user online status:",
          updateError.message
        );
      }
    } else {
      console.log("User not found");
      alert("User not found");
      return;
    }
    // Check for errors

    if (error) {
      console.error("Error fetching user:", error.message);
      return null;
    }

    return user;
  } catch (e) {
    console.error("Exception fetching user:", e.message);
    return null;
  }
};

// Add a flag to track if a chat creation is in progress
let isCreatingChat = false;

export const newChat = async ({
  ownerPlatformId,
  locationId,
  currentUser,
  navigation,
  rental,
}) => {
  // Prevent multiple simultaneous executions
  if (isCreatingChat) {
    console.log("Chat creation already in progress, ignoring duplicate call");
    return;
  }

  isCreatingChat = true;

  try {
    const currentUserId = currentUser?._id;
    const currentUsername = currentUser?.username;

    if (!currentUserId || !locationId || !ownerPlatformId) {
      console.error("Missing required information to start chat");
      return;
    }

    // Add await here to properly wait for this result
    const ownerId = await getUserByUserPlatformId(ownerPlatformId);

    if (!ownerId) {
      console.info("Owner not found");
      console.log("Trying to register user in Supabase...");
      const { data: newUser, error: registerError } =
        await registerUserInSupabase(
          ownerPlatformId,
          rental?.ownerId?.userId?.fullName,
          true
        );

      if (registerError) {
        console.error("Error registering user:", registerError.message);
        alert("Could not register user. Please try again later.");
        return;
      } else {
        console.log("User registered successfully:", newUser);
        // Don't call newChat recursively - instead, continue with the newly registered user
        const registeredOwnerId = newUser; // Adjust this based on your actual return structure
        processChatCreation(
          currentUserId,
          registeredOwnerId,
          currentUsername,
          locationId,
          navigation,
          rental
        );
      }
    } else {
      await processChatCreation(
        currentUserId,
        ownerId,
        currentUsername,
        locationId,
        navigation,
        rental
      );
    }
  } catch (error) {
    console.error("Exception starting chat with owner:", error.message);
    alert(
      "Failed to start conversation with the owner. Please try again later."
    );
  } finally {
    // Always reset the flag when done
    isCreatingChat = false;
  }
};

// Extract the chat creation logic to a separate function
async function processChatCreation(
  currentUserId,
  ownerId,
  currentUsername,
  locationId,
  navigation,
  rental
) {
  if (currentUserId === ownerId) {
    alert("You cannot start a chat with yourself.");
    return;
  }

  console.log(`Starting chat with owner: ${ownerId} for rental: ${locationId}`);

  const { data: existingChats, error: checkError } = await supabase
    .from("chat_participants")
    .select(
      `
      chat_id,
      chats:chat_id (
        id,
        name,
        chat_participants (user_id)
      )
    `
    )
    .eq("user_id", currentUserId);

  if (checkError) {
    console.error("Error checking existing chats:", checkError.message);
    throw checkError;
  }

  let existingDirectChat = null;

  if (existingChats && existingChats.length > 0) {
    for (const chat of existingChats) {
      const { data: participants, error: participantsError } = await supabase
        .from("chat_participants")
        .select("user_id")
        .eq("chat_id", chat.chat_id);

      if (participantsError) {
        console.error(
          "Error fetching participants:",
          participantsError.message
        );
        continue;
      }

      if (
        participants.length === 2 &&
        participants.some((p) => p.user_id === ownerId.id) &&
        participants.some((p) => p.user_id === currentUserId)
      ) {
        existingDirectChat = chat;
        break;
      }
    }
  }

  if (existingDirectChat) {
    console.log("Direct chat already exists, navigating to it");
    // In your newChat function inside DetailRentalLocationScreen
    // Replace the current navigation.navigate call with:
    console.log("LOG EXISTING DIRECT CHAT: ",existingDirectChat);
    navigation.navigate("Messages", {
      screen: "Chat",
      params: {
        chatId: existingDirectChat.chat_id,
        chatName: existingDirectChat.name || "Rental Owner",
        userId: currentUserId,
        username: currentUsername,
      },
    });
    return;
  }

  const chatName = `Chat with ${
    rental?.ownerId?.userId?.fullName || "Rental Owner"
  }`;

  const { data: chatData, error: chatError } = await supabase
    .from("chats")
    .insert([{ name: chatName }])
    .select();

  if (chatError) {
    console.error("Error creating chat:", chatError.message);
    throw chatError;
  }

  const newChatId = chatData[0].id;
  console.log("Chat created:", newChatId);

  const { error: participantError } = await supabase
    .from("chat_participants")
    .insert([
      { chat_id: newChatId, user_id: currentUserId },
      { chat_id: newChatId, user_id: ownerId.id },
    ]);

  if (participantError) {
    console.error("Error adding participants:", participantError.message);
    throw participantError;
  }

  console.log("Added both users as participants");

  navigation.navigate("Messages", {
    screen: "Chat",
    params: {
      chatId: newChatId,
      chatName: rental.owner_name || "Rental Owner",
      userId: currentUserId,
      username: currentUsername,
    },
  });
}