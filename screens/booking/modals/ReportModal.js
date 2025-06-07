"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Image,
  Platform,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { supabase } from "../../../lib/supabase"; // Import the supabase client
import { decode } from "base64-arraybuffer";
import { useCreateReportMutation } from "../../../api/reportApi"; // Import the API mutation hook
import AlertModal from "./AlertModal";

const MIN_IMAGES = 3;
const MAX_IMAGES = 10;

const ReportModal = ({
  visible,
  onClose,
  onSubmit,
  t, // translation function
  rentalName,
  bookingId,
  accommodationType,
  roomNo,
}) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [selectedReasonIndex, setSelectedReasonIndex] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);

  // Initialize the API mutation hook
  const [createReport, { isLoading: isApiLoading, error: apiError }] =
    useCreateReportMutation();

  // Alert modal states
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertButtons, setAlertButtons] = useState([]);
  const [alertIcon, setAlertIcon] = useState("");

  // Image picker modal state
  const [imagePickerModalVisible, setImagePickerModalVisible] = useState(false);

  // Submit confirmation modal state
  const [submitConfirmModalVisible, setSubmitConfirmModalVisible] =
    useState(false);

  // Add this near the top of the component with other state declarations
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submissionSuccessful, setSubmissionSuccessful] = useState(false);

  const reportReasons = [
    "inappropriate_content",
    "false_information",
    "spam",
    "fraud",
    "offensive_behavior",
    "other",
  ];

  // Fallback translations in case t function doesn't work properly
  const fallbackTranslations = {
    validation_error: "Validation Error",
    please_select_reason: "Please select a reason for your report",
    description_too_short: "Description must be at least 10 characters long",
    please_add_min_images: "Please add at least 3 images",
    too_many_images_error: "You can add a maximum of 10 images",
    add_images: "Add Images",
    add_image: "Add Image",
    choose_image_source: "Choose image source",
    camera: "Camera",
    gallery: "Gallery",
    cancel: "Cancel",
    ok: "OK",
    uploading_images: "Uploading images...",
    upload_failed: "Failed to upload images",
    report_submitted: "Report Submitted",
    report_submission_success: "Your report has been submitted successfully.",
    report_submission_failed: "Failed to submit report. Please try again.",
    min3_max10_images_required: "Please add between 3 and 10 images",
    image_limit_reached: "Image limit reached",
    max_images_reached: "You've reached the maximum of 10 images",
    more_needed: "more needed",
    confirm_submission: "Confirm Submission",
    submit_report_confirmation: "Are you sure you want to submit this report?",
    submit: "Submit",
    image_too_large: "Image Too Large",
    image_compression_failed: "Failed to compress image. Please try a smaller image or different format.",
    compressing_images: "Compressing images...",
    // Report reasons in Vietnamese
    inappropriate_content: "Nội dung không phù hợp",
    false_information: "Thông tin sai lệch",
    spam: "Spam",
    fraud: "Lừa đảo",
    offensive_behavior: "Hành vi xúc phạm",
    other: "Khác",
  };

  // Vietnamese translations for report reasons
  const vietnameseReasons = {
    inappropriate_content: "Nội dung không phù hợp",
    false_information: "Thông tin sai lệch", 
    spam: "Spam",
    fraud: "Lừa đảo",
    offensive_behavior: "Hành vi xúc phạm",
    other: "Khác",
  };

  // Safe translation function that falls back to our defaults
  const safeT = (key) => {
    try {
      const translated = t(key);
      // If translation returns empty or undefined, use fallback
      return translated && translated !== key
        ? translated
        : fallbackTranslations[key] || key;
    } catch (e) {
      return fallbackTranslations[key] || key;
    }
  };

  // Enhanced showAlert function with fallbacks and direct Alert usage
  const showAlert = (title, message, buttons = [], icon = "") => {

    // Set the state for the custom AlertModal
    setAlertTitle(safeT(title));
    setAlertMessage(safeT(message));

    // Transform buttons to ensure they have text
    const safeButtons = buttons.map((btn) => ({
      ...btn,
      text: safeT(btn.text || "ok"),
    }));

    setAlertButtons(safeButtons);
    setAlertIcon(icon);

    // First try to show our custom AlertModal
    setAlertModalVisible(true);

    // As a fallback, also use the native Alert API
    // This ensures at least one alert will show up
    if (Platform.OS !== "web") {
      const nativeButtons = safeButtons.map((btn) => ({
        text: btn.text,
        onPress: btn.onPress,
        style: btn.primary ? "default" : "cancel",
      }));

      setTimeout(() => {
        Alert.alert(
          safeT(title),
          safeT(message),
          nativeButtons.length > 0 ? nativeButtons : [{ text: safeT("ok") }]
        );
      }, 100);
    }
  };

  const requestPermissions = async () => {
    try {
      if (Platform.OS !== "web") {
        const { status: existingStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();
        
        if (existingStatus !== "granted") {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") {
            showAlert(
              "permission_required",
              "image_permission_message",
              [
                {
                  text: "ok",
                  onPress: () => setAlertModalVisible(false),
                  primary: true,
                },
              ],
              "error-outline"
            );
            return false;
          }
        }
      }
      return true;
    } catch (error) {
      console.error("[Permission Check] Error checking permissions:", error);
      showAlert(
        "error",
        "permission_error",
        [
          {
            text: "ok",
            onPress: () => setAlertModalVisible(false),
            primary: true,
          },
        ],
        "error-outline"
      );
      return false;
    }
  };

  const pickImage = async () => {
    console.log("[Image Picker] Starting image picker process...");
    setImagePickerModalVisible(false);
    
    try {
      console.log("[Image Picker] Checking permissions...");
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log("[Image Picker] Permission status:", status);
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to select images.',
          [{ text: 'OK' }]
        );
        return;
      }

      const imagesNeeded = MAX_IMAGES - images.length;
      console.log("[Image Picker] Images needed:", imagesNeeded);

      if (imagesNeeded <= 0) {
        Alert.alert(
          'Maximum Images',
          'You have reached the maximum number of images allowed.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Allow multiple selection on both iOS and Android with lower quality
      const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.3, // Reduced quality to make files smaller
        allowsMultipleSelection: true,
        selectionLimit: imagesNeeded,
      };

      console.log("[Image Picker] Launching with options:", options);
      const result = await ImagePicker.launchImageLibraryAsync(options);
      console.log("[Image Picker] Result:", result);

      if (!result.canceled) {
        const selectedAssets = result.assets || [];
        console.log("[Image Picker] Selected assets:", selectedAssets.length);

        if (images.length + selectedAssets.length > MAX_IMAGES) {
          Alert.alert(
            'Too Many Images',
            `You can only select up to ${MAX_IMAGES} images in total.`,
            [{ text: 'OK' }]
          );
          return;
        }

        // Filter and process selected images
        const validImages = selectedAssets.filter(asset => {
          const extension = asset.uri.toLowerCase().split('.').pop();
          // Only accept jpg and png files
          return ['jpg', 'png'].includes(extension);
        });

        if (validImages.length < selectedAssets.length) {
          Alert.alert(
            'Unsupported Image Format',
            'Some images were skipped. Only JPG and PNG formats are supported.',
            [{ text: 'OK' }]
          );
        }

        if (validImages.length > 0) {
          // Show uploading progress
          setIsSubmitting(true);
          setUploadProgress(0);

          try {
            console.log("[Image Picker] Starting immediate upload to Supabase...");
            const uploadedImages = [];

            for (let i = 0; i < validImages.length; i++) {
              const asset = validImages[i];
              console.log(`[Image Picker] Uploading image ${i + 1}/${validImages.length}`);
              
              // Update progress
              setUploadProgress(((i + 0.5) / validImages.length) * 100);

              try {
                // Upload to Supabase immediately
                const supabaseUrl = await uploadImageToSupabase(asset.uri, Date.now() + i);
                
                // Create image object with Supabase URL
                const uploadedImage = {
                  uri: supabaseUrl, // Use Supabase URL instead of local URI
                  supabaseUrl: supabaseUrl,
                  width: asset.width || 800,
                  height: asset.height || 600,
                  type: 'image',
                  uploaded: true
                };

                uploadedImages.push(uploadedImage);
                console.log(`[Image Picker] Successfully uploaded image ${i + 1}`);
                             } catch (uploadError) {
                 console.error(`[Image Picker] Failed to upload image ${i + 1}:`, uploadError);
                 let errorMessage = `Failed to upload image ${i + 1}. Please try again.`;
                 
                 if (uploadError.message && uploadError.message.includes('too large')) {
                   errorMessage = safeT("image_compression_failed");
                 } else if (uploadError.message && uploadError.message.includes('exceeded the maximum allowed size')) {
                   errorMessage = safeT("image_too_large") + " - " + safeT("image_compression_failed");
                 }
                 
                 Alert.alert(
                   safeT("error") || 'Upload Error',
                   errorMessage,
                   [{ text: safeT("ok") || 'OK' }]
                 );
                 return;
               }

              // Update progress
              setUploadProgress(((i + 1) / validImages.length) * 100);
            }

            // Add uploaded images to state
            setImages(prevImages => [...prevImages, ...uploadedImages]);
            console.log("[Image Picker] All images uploaded successfully:", uploadedImages.length);

          } catch (error) {
            console.error("[Image Picker] Upload error:", error);
            Alert.alert(
              'Upload Error',
              'Failed to upload images. Please try again.',
              [{ text: 'OK' }]
            );
          } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
          }
        } else {
          Alert.alert(
            'No Valid Images',
            'Please select JPG or PNG images only.',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error) {
      console.error("[Image Picker] Error:", error);
      Alert.alert(
        'Error',
        'Failed to select images. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const takePhoto = async () => {
    setImagePickerModalVisible(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      showAlert(
        "permission_required",
        "camera_permission_message",
        [
          {
            text: "ok",
            onPress: () => setAlertModalVisible(false),
            primary: true,
          },
        ],
        "error-outline"
      );
      return;
    }

    try {
      // Check if we've reached the maximum number of images
      if (images.length >= MAX_IMAGES) {
        showAlert(
          "image_limit_reached",
          safeT("max_images_reached"),
          [
            {
              text: "ok",
              onPress: () => setAlertModalVisible(false),
              primary: true,
            },
          ],
          "warning"
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.3, // Reduced quality to make files smaller
      });

      if (!result.canceled && result.assets) {
        if (images.length >= MAX_IMAGES) {
          showAlert(
            "image_limit_reached",
            safeT("max_images_reached"),
            [
              {
                text: "ok",
                onPress: () => setAlertModalVisible(false),
                primary: true,
              },
            ],
            "warning"
          );
          return;
        }

        // Upload the captured image immediately to Supabase
        setIsSubmitting(true);
        setUploadProgress(0);

        try {
          console.log("[Camera] Starting immediate upload to Supabase...");
          const uploadedImages = [];

          for (let i = 0; i < result.assets.length; i++) {
            const asset = result.assets[i];
            console.log(`[Camera] Uploading image ${i + 1}/${result.assets.length}`);
            
            // Update progress
            setUploadProgress(((i + 0.5) / result.assets.length) * 100);

            try {
              // Upload to Supabase immediately
              const supabaseUrl = await uploadImageToSupabase(asset.uri, Date.now() + i);
              
              // Create image object with Supabase URL
              const uploadedImage = {
                uri: supabaseUrl, // Use Supabase URL instead of local URI
                supabaseUrl: supabaseUrl,
                width: asset.width || 800,
                height: asset.height || 600,
                type: 'image',
                uploaded: true
              };

              uploadedImages.push(uploadedImage);
              console.log(`[Camera] Successfully uploaded image ${i + 1}`);
                         } catch (uploadError) {
               console.error(`[Camera] Failed to upload image ${i + 1}:`, uploadError);
               
               let errorMessage = "Failed to upload image. Please try again.";
               if (uploadError.message && uploadError.message.includes('too large')) {
                 errorMessage = safeT("image_compression_failed");
               } else if (uploadError.message && uploadError.message.includes('exceeded the maximum allowed size')) {
                 errorMessage = safeT("image_too_large") + " - " + safeT("image_compression_failed");
               }
               
               showAlert(
                 "error",
                 errorMessage,
                 [
                   {
                     text: "ok",
                     onPress: () => setAlertModalVisible(false),
                     primary: true,
                   },
                 ],
                 "error-outline"
               );
               return;
             }

            // Update progress
            setUploadProgress(((i + 1) / result.assets.length) * 100);
          }

          // Add uploaded images to state
          setImages([...images, ...uploadedImages]);
          console.log("[Camera] All images uploaded successfully:", uploadedImages.length);

          // Show a message if they've reached the maximum
          if (images.length + uploadedImages.length >= MAX_IMAGES) {
            showAlert(
              "image_limit_reached",
              safeT("max_images_reached"),
              [
                {
                  text: "ok",
                  onPress: () => setAlertModalVisible(false),
                  primary: true,
                },
              ],
              "info"
            );
          }
        } catch (error) {
          console.error("[Camera] Upload error:", error);
          showAlert(
            "error",
            "Failed to upload images. Please try again.",
            [
              {
                text: "ok",
                onPress: () => setAlertModalVisible(false),
                primary: true,
              },
            ],
            "error-outline"
          );
        } finally {
          setIsSubmitting(false);
          setUploadProgress(0);
        }
      }
    } catch (error) {
      showAlert(
        "error",
        "camera_error",
        [
          {
            text: "ok",
            onPress: () => setAlertModalVisible(false),
            primary: true,
          },
        ],
        "error-outline"
      );
    }
  };

  const removeImage = async (index) => {
    try {
      const imageToRemove = images[index];
      console.log("[Remove Image] Removing image at index:", index, imageToRemove);

      // If the image has a Supabase URL, delete it from storage
      if (imageToRemove.supabaseUrl || imageToRemove.uploaded) {
        try {
          // Extract the file name from the Supabase URL
          const imageUrl = imageToRemove.supabaseUrl || imageToRemove.uri;
          const urlParts = imageUrl.split('/');
          const fileName = urlParts[urlParts.length - 1];
          
          console.log("[Remove Image] Deleting from Supabase:", fileName);
          
          // Delete from Supabase storage
          const { error } = await supabase.storage
            .from("report-images")
            .remove([fileName]);

          if (error) {
            console.error("[Remove Image] Error deleting from Supabase:", error);
            // Don't throw error here - still remove from UI even if Supabase delete fails
          } else {
            console.log("[Remove Image] Successfully deleted from Supabase:", fileName);
          }
        } catch (supabaseError) {
          console.error("[Remove Image] Supabase deletion error:", supabaseError);
          // Continue with local removal even if Supabase delete fails
        }
      }

      // Remove from local state
      const newImages = [...images];
      newImages.splice(index, 1);
      setImages(newImages);
      
      console.log("[Remove Image] Image removed from local state");
    } catch (error) {
      console.error("[Remove Image] Error in removeImage:", error);
      // Still try to remove from local state
      const newImages = [...images];
      newImages.splice(index, 1);
      setImages(newImages);
    }
  };

  // Function to compress and resize image
  const compressImage = async (imageUri) => {
    try {
      console.log("[Compress] Starting image compression for:", imageUri);
      
      // Manipulate the image - resize and compress
      const manipulatedImage = await manipulateAsync(
        imageUri,
        [
          // Resize to maximum 800x600 while maintaining aspect ratio
          { resize: { width: 800, height: 600 } }
        ],
        {
          compress: 0.3, // Strong compression
          format: SaveFormat.JPEG, // Convert to JPEG for better compression
        }
      );

      console.log("[Compress] Image compressed successfully:", manipulatedImage.uri);
      
      // Check file size after compression
      const fileInfo = await FileSystem.getInfoAsync(manipulatedImage.uri);
      console.log("[Compress] Compressed file size:", fileInfo.size, "bytes");
      
      // If still too large (over 5MB), compress more
      if (fileInfo.size > 5 * 1024 * 1024) {
        console.log("[Compress] File still too large, compressing further...");
        const furtherCompressed = await manipulateAsync(
          manipulatedImage.uri,
          [
            { resize: { width: 600, height: 400 } }
          ],
          {
            compress: 0.1, // Even stronger compression
            format: SaveFormat.JPEG,
          }
        );
        console.log("[Compress] Further compressed:", furtherCompressed.uri);
        return furtherCompressed.uri;
      }
      
      return manipulatedImage.uri;
    } catch (error) {
      console.error("[Compress] Error compressing image:", error);
      throw error;
    }
  };

  // Function to upload a single image to Supabase
  const uploadImageToSupabase = async (imageUri, index) => {
    try {
      console.log("[Upload] Starting upload for image:", index);
      
      // First compress the image
      const compressedUri = await compressImage(imageUri);
      console.log("[Upload] Image compressed, proceeding with upload");

      // Generate a unique file name (always use .jpg since we convert to JPEG)
      const timestamp = new Date().getTime();
      const randomString = Math.random().toString(36).substring(2, 10);
      const fileName = `report-${bookingId || "unknown"}-${timestamp}-${randomString}-${index}.jpg`;
      
      console.log("[Upload] Reading compressed file:", compressedUri);

      // For iOS, we need to handle the file:// protocol
      const uri = Platform.OS === 'ios' ? compressedUri.replace('file://', '') : compressedUri;

      // Check file size before upload
      const fileInfo = await FileSystem.getInfoAsync(uri);
      console.log("[Upload] Final file size:", fileInfo.size, "bytes");
      
      // If still too large (over 10MB), throw error
      if (fileInfo.size > 10 * 1024 * 1024) {
        throw new Error("Image file is still too large after compression. Please try a different image.");
      }

      // Read the file
      const fileContent = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (!fileContent) {
        throw new Error("Failed to read compressed image file");
      }

      // Convert to ArrayBuffer
      const arrayBuffer = decode(fileContent);

      // Upload to Supabase as JPEG
      const { data, error } = await supabase.storage
        .from("report-images")
        .upload(fileName, arrayBuffer, {
          contentType: "image/jpeg",
          upsert: true
        });

      if (error) {
        console.error("[Upload] Upload error:", error);
        throw error;
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from("report-images")
        .getPublicUrl(fileName);

      console.log("[Upload] Upload successful:", publicUrlData.publicUrl);
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("[Upload] Error in uploadImageToSupabase:", error);
      throw error;
    }
  };

  // Function to upload multiple images to Supabase
  const uploadImagesToSupabase = async (imageUris) => {
    const uploadedUrls = [];

    for (let i = 0; i < imageUris.length; i++) {
      // Update progress
      setUploadProgress(((i + 0.3) / imageUris.length) * 100);

      // Upload image
      const imageUrl = await uploadImageToSupabase(imageUris[i], i);
      uploadedUrls.push(imageUrl);

      // Update progress
      setUploadProgress(((i + 1) / imageUris.length) * 100);
    }

    return uploadedUrls;
  };

  // Update the handleSubmitButtonPress function
  const handleSubmitButtonPress = () => {
    console.log("[Submit Button] Validating form...");
    
    // Validate inputs
    if (selectedReasonIndex === null) {
      console.log("[Submit Button] No reason selected");
      Alert.alert(
        "Validation Error",
        "Please select a reason for your report",
        [{ text: "OK" }]
      );
      return;
    }

    if (description.trim().length < 10) {
      console.log("[Submit Button] Description too short");
      Alert.alert(
        "Validation Error",
        "Description must be at least 10 characters long",
        [{ text: "OK" }]
      );
      return;
    }

    // Check if there are at least MIN_IMAGES
    if (images.length < MIN_IMAGES) {
      console.log("[Submit Button] Not enough images:", images.length);
      Alert.alert(
        "Validation Error",
        `Please add at least ${MIN_IMAGES} images`,
        [
          {
            text: "Add Images",
            onPress: () => showImageOptions(),
          },
          {
            text: "Cancel",
          },
        ]
      );
      return;
    }

    // Check if there are too many images
    if (images.length > MAX_IMAGES) {
      console.log("[Submit Button] Too many images:", images.length);
      Alert.alert(
        "Validation Error",
        `You can add a maximum of ${MAX_IMAGES} images`,
        [{ text: "OK" }]
      );
      return;
    }

    if (!bookingId) {
      console.log("[Submit Button] No booking ID");
      Alert.alert(
        "Error",
        "Invalid booking information",
        [{ text: "OK" }]
      );
      return;
    }

    console.log("[Submit Button] Validation passed, showing confirmation");
    setError("");
    
    // Show confirmation using Alert instead of modal
    Alert.alert(
      safeT("confirm_submission"),
      safeT("submit_report_confirmation"),
      [
        {
          text: safeT("submit"),
          onPress: () => handleSubmit(),
          style: 'default'
        },
        {
          text: safeT("cancel"),
          style: 'cancel'
        }
      ],
      { cancelable: false }
    );
  };

  // Update the handleSubmit function
  const handleSubmit = async () => {
    console.log("[Submit] Starting report submission...");
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      console.log("[Submit] Current state:", {
        reason: reportReasons[selectedReasonIndex],
        description,
        imageCount: images.length,
        bookingId
      });

      if (!bookingId) {
        throw new Error("Booking ID is required");
      }

      if (selectedReasonIndex === null) {
        throw new Error("Please select a reason for your report");
      }

      if (description.trim().length < 10) {
        throw new Error("Description must be at least 10 characters long");
      }

      if (images.length < MIN_IMAGES) {
        throw new Error(`Please add at least ${MIN_IMAGES} images`);
      }

      // Extract uploaded image URLs (images are already uploaded to Supabase)
      console.log("[Submit] Extracting image URLs...");
      const uploadedImageUrls = images.map(image => image.supabaseUrl || image.uri);
      console.log("[Submit] Using pre-uploaded images:", uploadedImageUrls);

      // Get reason key and convert to Vietnamese
      const reasonKey = reportReasons[selectedReasonIndex];
      const vietnameseReason = vietnameseReasons[reasonKey] || reasonKey;
      console.log("[Submit] Reason converted from", reasonKey, "to", vietnameseReason);

      // Prepare the report data
      const reportData = {
        bookingId: bookingId,
        content: description.trim(),
        reason: vietnameseReason, // Send Vietnamese translation instead of key
        isReviewed: false,
        images: uploadedImageUrls,
      };

      console.log("[Submit] Sending report data:", reportData);

      // Call the API to create the report
      try {
        const response = await createReport(reportData).unwrap();
        console.log("[Submit] Report created successfully:", response);

        // Show success message and close
        Alert.alert(
          safeT("report_submitted"),
          safeT("report_submission_success"),
          [
            {
              text: "OK",
              onPress: () => handleClose(true) // Truyền tham số success = true
            }
          ]
        );

        // Call the onSubmit callback if provided
        if (onSubmit) {
          onSubmit({
            ...reportData,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (apiError) {
        console.error("[Submit] API error:", apiError);
        throw new Error("Failed to submit report. Please try again.");
      }
    } catch (error) {
      console.error("[Submit] Error in handleSubmit:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to submit report. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleClose = async (isSubmissionSuccessful = false) => {
    try {
      // Only clean up images if submission was NOT successful
      if (!isSubmissionSuccessful && images.length > 0) {
        console.log("[Close] Cleaning up uploaded images (submission not successful)...");
        
        for (const image of images) {
          if (image.supabaseUrl || image.uploaded) {
            try {
              // Extract the file name from the Supabase URL
              const imageUrl = image.supabaseUrl || image.uri;
              const urlParts = imageUrl.split('/');
              const fileName = urlParts[urlParts.length - 1];
              
              console.log("[Close] Deleting unused image from Supabase:", fileName);
              
              // Delete from Supabase storage
              const { error } = await supabase.storage
                .from("report-images")
                .remove([fileName]);

              if (error) {
                console.error("[Close] Error deleting unused image:", error);
              } else {
                console.log("[Close] Successfully deleted unused image:", fileName);
              }
            } catch (cleanupError) {
              console.error("[Close] Error cleaning up image:", cleanupError);
              // Continue with cleanup even if one fails
            }
          }
        }
      } else if (isSubmissionSuccessful) {
        console.log("[Close] Submission was successful - keeping images in Supabase");
      }
    } catch (error) {
      console.error("[Close] Error in cleanup:", error);
    } finally {
      // Reset form when closing
      setReason("");
      setDescription("");
      setSelectedReasonIndex(null);
      setError("");
      setImages([]);
      setSubmissionSuccessful(false); // Reset the success flag
      onClose();
    }
  };

  const showImageOptions = () => {
    console.log("[Image Options] Showing image options...");
    
    // Use native Alert for better compatibility
    Alert.alert(
      safeT("add_image") || "Add Image",
      safeT("choose_image_source") || "Choose image source",
      [
        {
          text: safeT("camera") || "Camera",
          onPress: takePhoto
        },
        {
          text: safeT("gallery") || "Gallery", 
          onPress: pickImage
        },
        {
          text: safeT("cancel") || "Cancel",
          style: "cancel"
        }
      ],
      { cancelable: true }
    );
  };

  // Effect to handle API errors
  useEffect(() => {
    if (apiError) {
      showAlert(
        "error",
        safeT("report_submission_failed"),
        [
          {
            text: "ok",
            onPress: () => setAlertModalVisible(false),
            primary: true,
          },
        ],
        "error-outline"
      );
    }
  }, [apiError]);

  // Debug effect to log when alert modal should be visible
  useEffect(() => {
  }, [alertModalVisible]);

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{safeT("report_issue")}</Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.reportingInfoContainer}>
                <Text style={styles.reportingText}>
                  {safeT("booking_id")}:{" "}
                  <Text style={styles.reportingValue}>
                    {bookingId || "N/A"}
                  </Text>
                </Text>
                <Text style={styles.reportingText}>
                  {safeT("rental_name")}:{" "}
                  <Text style={styles.reportingValue}>
                    {rentalName || "N/A"}
                  </Text>
                </Text>
                <Text style={styles.reportingText}>
                  {safeT("accommodation_type")}:{" "}
                  <Text style={styles.reportingValue}>
                    {accommodationType || "N/A"}
                  </Text>
                </Text>
                <Text style={styles.reportingText}>
                  {safeT("roomNo")}:{" "}
                  <Text style={styles.reportingValue}>{roomNo || "N/A"}</Text>
                </Text>
              </View>

              <Text style={styles.sectionTitle}>
                {safeT("reason_for_report")}
              </Text>
              <View style={styles.reasonsContainer}>
                {reportReasons.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.reasonItem,
                      selectedReasonIndex === index &&
                        styles.selectedReasonItem,
                    ]}
                    onPress={() => setSelectedReasonIndex(index)}
                  >
                    <Text
                      style={[
                        styles.reasonText,
                        selectedReasonIndex === index &&
                          styles.selectedReasonText,
                      ]}
                    >
                      {safeT(item)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionTitle}>{safeT("description")}</Text>
              <TextInput
                style={styles.descriptionInput}
                multiline
                numberOfLines={5}
                placeholder={safeT("describe_issue_in_detail")}
                value={description}
                onChangeText={setDescription}
                textAlignVertical="top"
              />

              <Text style={styles.sectionTitle}>
                {safeT("evidence_images")}
              </Text>
              <Text style={styles.helperText}>
                {safeT("min3_max10_images_required")} ({images.length}/
                {MAX_IMAGES})
              </Text>

              <View style={styles.imagesContainer}>
                {images.map((image, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image
                      source={{ uri: image.uri }}
                      style={styles.imagePreview}
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <Icon name="close" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}

                {images.length < MAX_IMAGES && (
                  <TouchableOpacity
                    style={styles.addImageButton}
                    onPress={showImageOptions}
                  >
                    <Icon
                      name="add-photo-alternate"
                      size={24}
                      color="#4e72e3"
                    />
                    <Text style={styles.addImageText}>
                      {safeT("add_image")} (
                      {Math.max(MIN_IMAGES - images.length, 0)}{" "}
                      {safeT("more_needed")})
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              {isSubmitting && uploadProgress > 0 && (
                <View style={styles.progressContainer}>
                  <View
                    style={[styles.progressBar, { width: `${uploadProgress}%` }]}
                  />
                  <Text style={styles.progressText}>
                    {Math.round(uploadProgress)}%
                  </Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelButtonText}>{safeT("cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitButtonPress}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {safeT("submit_report")}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Alert Modal with higher z-index */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={alertModalVisible}
        onRequestClose={() => setAlertModalVisible(false)}
      >
        <View style={styles.alertModalOverlay}>
          <View style={styles.alertModalContainer}>
            {alertIcon && (
              <View style={styles.alertIconContainer}>
                <Icon name={alertIcon} size={32} color="#4e72e3" />
              </View>
            )}

            <Text style={styles.alertModalTitle}>{alertTitle}</Text>

            {alertMessage && (
              <Text style={styles.alertModalMessage}>{alertMessage}</Text>
            )}

            {isSubmitting && uploadProgress > 0 && (
              <View style={styles.progressContainer}>
                <View
                  style={[styles.progressBar, { width: `${uploadProgress}%` }]}
                />
                <Text style={styles.progressText}>
                  {Math.round(uploadProgress)}%
                </Text>
              </View>
            )}

            <View style={styles.alertButtonContainer}>
              {alertButtons.length > 0 ? (
                alertButtons.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.alertButton,
                      button.primary && styles.alertPrimaryButton,
                      button.style,
                      index < alertButtons.length - 1 &&
                        styles.alertButtonMargin,
                    ]}
                    onPress={() => {
                      setAlertModalVisible(false);
                      if (button.onPress) button.onPress();
                    }}
                  >
                    {button.icon && (
                      <Icon
                        name={button.icon}
                        size={20}
                        color={button.primary ? "#fff" : "#4e72e3"}
                        style={styles.alertButtonIcon}
                      />
                    )}
                    <Text
                      style={[
                        styles.alertButtonText,
                        button.primary && styles.alertPrimaryButtonText,
                        button.textStyle,
                      ]}
                    >
                      {button.text}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : isSubmitting ? null : (
                <TouchableOpacity
                  style={[styles.alertButton, styles.alertPrimaryButton]}
                  onPress={() => setAlertModalVisible(false)}
                >
                  <Text style={styles.alertPrimaryButtonText}>OK</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Image Picker Modal */}
      <AlertModal
        visible={imagePickerModalVisible}
        onClose={() => setImagePickerModalVisible(false)}
        title={safeT("add_image")}
        message={safeT("choose_image_source")}
        icon="photo-library"
        buttons={[
          {
            text: safeT("camera"),
            onPress: takePhoto,
            icon: "camera-alt",
          },
          {
            text: safeT("gallery"),
            onPress: pickImage,
            icon: "photo-library",
          },
          {
            text: safeT("cancel"),
            onPress: () => setImagePickerModalVisible(false),
            textStyle: { color: "#666" },
            style: { borderColor: "#e0e0e0", backgroundColor: "#f5f5f5" },
          },
        ]}
      />

      {/* Submit Confirmation Modal */}
      <AlertModal
        visible={submitConfirmModalVisible}
        onClose={() => setSubmitConfirmModalVisible(false)}
        title={safeT("confirm_submission")}
        message={safeT("submit_report_confirmation")}
        icon="help-outline"
        buttons={[
          {
            text: safeT("submit"),
            onPress: handleSubmit,
            primary: true,
            icon: "send",
          },
          {
            text: safeT("cancel"),
            onPress: () => setSubmitConfirmModalVisible(false),
            textStyle: { color: "#666" },
            style: { borderColor: "#e0e0e0", backgroundColor: "#f5f5f5" },
          },
        ]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "90%",
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 16,
    maxHeight: 500,
  },
  reportingInfoContainer: {
    marginBottom: 16,
  },
  reportingText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  reportingValue: {
    fontWeight: "bold",
    color: "#333",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
  },
  helperText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  reasonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  reasonItem: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedReasonItem: {
    backgroundColor: "#4e72e3",
    borderColor: "#4e72e3",
  },
  reasonText: {
    color: "#333",
    fontSize: 14,
  },
  selectedReasonText: {
    color: "#fff",
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#f9f9f9",
    minHeight: 100,
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    marginRight: 8,
    marginBottom: 8,
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#ff4d4f",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff",
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  addImageText: {
    color: "#4e72e3",
    fontSize: 12,
    marginTop: 4,
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 14,
    marginTop: 8,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#4e72e3",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    minWidth: 100,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  // Custom alert modal styles
  alertModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  alertModalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  alertIconContainer: {
    marginBottom: 16,
  },
  alertModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 12,
  },
  alertModalMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  alertButtonContainer: {
    width: "100%",
    marginTop: 8,
  },
  alertButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#4e72e3",
  },
  alertPrimaryButton: {
    backgroundColor: "#4e72e3",
    borderColor: "#4e72e3",
  },
  alertButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4e72e3",
  },
  alertPrimaryButtonText: {
    color: "#fff",
  },
  alertButtonMargin: {
    marginBottom: 12,
  },
  alertButtonIcon: {
    marginRight: 8,
  },
  progressContainer: {
    width: "100%",
    height: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    marginBottom: 16,
    overflow: "hidden",
    position: "relative",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4e72e3",
    borderRadius: 10,
  },
  progressText: {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    color: "#333",
    fontSize: 12,
    fontWeight: "bold",
    lineHeight: 20,
  },
});

export default ReportModal;
