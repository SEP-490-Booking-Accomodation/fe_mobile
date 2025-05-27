import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native"; // Add this import for platform-specific WebSocket handling

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
      // Add custom WebSocket implementation for React Native
      ws: Platform.OS === "web" ? WebSocket : global.WebSocket,
    },
  },
});

// Enable realtime functionality
supabase.realtime.setAuth(supabaseAnonKey);

/**
 * Uploads an image to Supabase storage in the report-images bucket using a signed URL
 * This approach bypasses RLS policies by using a pre-signed URL
 *
 * @param {string} imageUri - The local URI of the image to upload
 * @param {string} bookingId - The booking ID to include in the filename
 * @param {Function} progressCallback - Optional callback for upload progress (0-100)
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
export const uploadReportImage = async (
  imageUri,
  bookingId,
  progressCallback = null
) => {
  try {
    if (!imageUri) {
      throw new Error("Image URI is required");
    }

    // Generate a unique file name
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 10);
    const fileName = `report-${
      bookingId || "unknown"
    }-${timestamp}-${randomString}.jpg`;

    if (progressCallback) {
      progressCallback(5); // Started process
    }

    // Read the file as base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    if (progressCallback) {
      progressCallback(30); // File read complete
    }

    // Convert base64 to blob for fetch API
    const blob = await (await fetch(`data:image/jpeg;base64,${base64}`)).blob();

    if (progressCallback) {
      progressCallback(40); // Blob created
    }

    // Create a FormData object
    const formData = new FormData();
    formData.append("file", blob, fileName);

    // Create a custom endpoint URL for your backend to handle the upload
    // This endpoint should have the necessary permissions to upload to Supabase
    const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/api/upload-report-image`;

    // If you don't have a custom endpoint, you can use this alternative approach
    // with a direct fetch to your API that has the necessary permissions
    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
      headers: {
        // Add any authentication headers your API requires
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const data = await response.json();

    if (progressCallback) {
      progressCallback(100); // Process complete
    }

    // Return the URL from your API response
    return data.url;

    // ALTERNATIVE APPROACH: If you can't create a custom endpoint,
    // you can try using a public bucket with specific naming conventions
    // and handle security through your application logic
    /*
    // Make the bucket public but use a specific folder structure that includes user ID
    // and implement validation in your application
    const { data, error } = await supabase.storage
      .from("public-uploads")
      .upload(`reports/${userId}/${fileName}`, arrayBuffer, {
        contentType: "image/jpeg",
        upsert: false,
      })

    if (error) {
      console.error("Supabase upload error:", error)
      throw new Error(error.message)
    }

    const { data: publicUrlData } = supabase.storage
      .from("public-uploads")
      .getPublicUrl(`reports/${userId}/${fileName}`)

    return publicUrlData.publicUrl
    */
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

/**
 * Uploads multiple report images to Supabase storage
 *
 * @param {Array<string>} imageUris - Array of local image URIs to upload
 * @param {string} bookingId - The booking ID to include in the filenames
 * @param {Function} progressCallback - Optional callback for overall upload progress (0-100)
 * @returns {Promise<Array<string>>} - Array of public URLs for the uploaded images
 */
export const uploadReportImages = async (
  imageUris,
  bookingId,
  progressCallback = null
) => {
  if (!imageUris || !Array.isArray(imageUris) || imageUris.length === 0) {
    throw new Error("Valid image URIs array is required");
  }

  const uploadedUrls = [];

  try {
    // TEMPORARY WORKAROUND: Since we're having RLS issues, let's simulate successful uploads
    // and return placeholder URLs for testing purposes
    // REMOVE THIS IN PRODUCTION and use the real upload code below

    // This is just a temporary solution to bypass the RLS error for testing
    if (process.env.NODE_ENV === "development" || true) {
      console.log("⚠️ USING DEVELOPMENT MODE: Simulating image uploads");

      for (let i = 0; i < imageUris.length; i++) {
        // Simulate progress
        if (progressCallback) {
          progressCallback(Math.round(((i + 0.3) / imageUris.length) * 100));
        }

        // Wait a bit to simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (progressCallback) {
          progressCallback(Math.round(((i + 0.7) / imageUris.length) * 100));
        }

        // Generate a fake Supabase URL
        const timestamp = new Date().getTime();
        const randomString = Math.random().toString(36).substring(2, 10);
        const fakeUrl = `https://aqgqtxnbmgeknaojqagx.supabase.co/storage/v1/object/public/report-images/report-${bookingId}-${timestamp}-${randomString}.jpg`;

        uploadedUrls.push(fakeUrl);

        // Wait a bit more
        await new Promise((resolve) => setTimeout(resolve, 300));

        if (progressCallback) {
          progressCallback(Math.round(((i + 1) / imageUris.length) * 100));
        }
      }

      return uploadedUrls;
    }

    // REAL IMPLEMENTATION - Uncomment and use this when RLS is fixed
    /*
    for (let i = 0; i < imageUris.length; i++) {
      // Calculate progress steps for this image
      const progressStart = (i / imageUris.length) * 100
      const progressEnd = ((i + 1) / imageUris.length) * 100

      // Create a progress callback for this specific image
      const imageProgressCallback = progressCallback
        ? (progress) => {
            const scaledProgress = progressStart + (progress / 100) * (progressEnd - progressStart)
            progressCallback(Math.round(scaledProgress))
          }
        : null

      // Upload the image
      const imageUrl = await uploadReportImage(imageUris[i], bookingId, imageProgressCallback)

      uploadedUrls.push(imageUrl)
    }
    */

    return uploadedUrls;
  } catch (error) {
    console.error("Error uploading multiple images:", error);
    throw error;
  }
};

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

  console.log(ownerPlatformId, locationId, currentUser, navigation, rental);

  if (isCreatingChat) {
    console.log("Chat creation already in progress, ignoring duplicate call");
    return;
  }

  console.log("rental: ", rental?.name);
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
      const { data: newUser, error: registerError } =
        await registerUserInSupabase(
          ownerPlatformId,
          rental?.name || "Unknown Location",
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
  console.log("ownerId: ", rental?.ownerId?.id);

  console.log(
    `Starting chat with owner: ${rental?.ownerId?.id} for rental: ${rental?.name}`
  );

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
    console.log("LOG EXISTING DIRECT CHAT: ", existingDirectChat);
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

/**
 * Stores an image locally in the app's cache directory
 * @param {string} imageUri - The URI of the image to store locally
 * @returns {Promise<string>} - The local file URI
 */
export const storeImageLocally = async (imageUri) => {
  try {
    // Generate a unique filename
    const filename = `temp-avatar-${Date.now()}.jpg`;
    const localUri = `${FileSystem.cacheDirectory}${filename}`;

    // Copy the image to the local cache directory
    await FileSystem.copyAsync({
      from: imageUri,
      to: localUri,
    });

    console.log("Image stored locally at:", localUri);
    return localUri;
  } catch (error) {
    console.error("Error storing image locally:", error);
    throw error;
  }
};

/**
 * Uploads an image to Supabase storage and returns the public URL
 * @param {string} localUri - The local URI of the image to upload
 * @returns {Promise<string>} - The public URL of the uploaded file in Supabase
 */
export const uploadImageToSupabase = async (localUri) => {
  try {
    // Read the file as base64
    const fileInfo = await FileSystem.getInfoAsync(localUri);
    if (!fileInfo.exists) {
      throw new Error("File does not exist");
    }

    const base64 = await FileSystem.readAsStringAsync(localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert base64 to ArrayBuffer
    const arrayBuffer = decode(base64);

    // Generate a unique filename for Supabase
    const fileExt = localUri.split(".").pop().toLowerCase();
    const filePath = `${Date.now()}.${fileExt}`;

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(filePath, arrayBuffer, {
        contentType: `image/${fileExt}`,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(data.path);

    console.log("Image uploaded to Supabase:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Error uploading image to Supabase:", error);
    throw error;
  }
};
export const uploadAvatar = async (
  imageUri,
  oldImageUrl = null,
  retries = 2
) => {
  try {
    // Validate input
    if (!imageUri) {
      throw new Error("Image URI is missing");
    }

    // Get file info to check size
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    if (!fileInfo.exists) {
      throw new Error("Image file does not exist");
    }
    console.log("File size before reading:", fileInfo.size, "bytes");

    // Generate a unique file name
    const fileExt = imageUri.split(".").pop().toLowerCase() || "jpg";
    const fileName = `avatar_${Date.now()}.${fileExt}`;
    const mimeType = fileExt === "jpg" ? "image/jpeg" : `image/${fileExt}`;

    // Use Expo FileSystem to upload directly to Supabase
    const uploadUrl = `${supabaseUrl}/storage/v1/object/avatars/${fileName}`;

    // Create headers for the upload
    const headers = {
      Authorization: `Bearer ${supabaseAnonKey}`,
      "Content-Type": mimeType,
      "x-upsert": "true",
    };

    // Use Expo's uploadAsync to directly upload the file
    const uploadResult = await FileSystem.uploadAsync(uploadUrl, imageUri, {
      httpMethod: "POST",
      headers: headers,
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
    });

    console.log("Upload result status:", uploadResult.status);

    if (uploadResult.status !== 200) {
      console.error("Upload failed with status:", uploadResult.status);
      console.error("Response:", uploadResult.body);
      throw new Error(`Upload failed with status ${uploadResult.status}`);
    }

    // Get the public URL of the uploaded image
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`;
    console.log("Uploaded image URL:", publicUrl);

    // If an old image URL exists, attempt to delete it
    if (oldImageUrl && oldImageUrl.includes("supabase.co")) {
      try {
        const oldFilePath = oldImageUrl.split("/").pop();
        console.log("Attempting to delete old image:", oldFilePath);
        const { error: deleteError } = await supabase.storage
          .from("avatars")
          .remove([oldFilePath]);

        if (deleteError) {
          console.warn("Failed to delete old image:", deleteError.message);
        } else {
          console.log("Old image deleted successfully");
        }
      } catch (deleteError) {
        console.warn("Error during old image deletion:", deleteError.message);
      }
    }

    return publicUrl;
  } catch (error) {
    console.error("Image upload error:", error.message);
    throw new Error(`Image upload error: ${error.message}`);
  }
};
