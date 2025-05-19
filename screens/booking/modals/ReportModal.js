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
import { supabase } from "../../../lib/supabase"; // Import the supabase client
import { decode } from "base64-arraybuffer";
import { useCreateReportMutation } from "../../../api/reportApi"; // Import the API mutation hook
import AlertModal from "./AlertModal";

const ReportModal = ({
  visible,
  onClose,
  onSubmit,
  t, // translation function
  rentalName,
  bookingId,
  accommodationType,
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
    please_add_three_images: "Please add exactly 3 images",
    add_images: "Add Images",
    cancel: "Cancel",
    ok: "OK",
    uploading_images: "Uploading images...",
    upload_failed: "Failed to upload images",
    report_submitted: "Report Submitted",
    report_submission_success: "Your report has been submitted successfully.",
    report_submission_failed: "Failed to submit report. Please try again.",
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
      console.log("Translation error:", e);
      return fallbackTranslations[key] || key;
    }
  };

  // Enhanced showAlert function with fallbacks and direct Alert usage
  const showAlert = (title, message, buttons = [], icon = "") => {
    console.log("Showing alert:", title, message);

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
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
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
      return true;
    }
    return true;
  };

  const pickImage = async () => {
    setImagePickerModalVisible(false);
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const imagesNeeded = 3 - images.length;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: imagesNeeded,
      });

      if (!result.canceled && result.assets) {
        if (images.length + result.assets.length > 3) {
          showAlert(
            "too_many_images",
            "max_three_images",
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

        // Store the selected images locally
        const localImages = await Promise.all(
          result.assets.map(async (asset) => {
            // Get file info
            const fileInfo = await FileSystem.getInfoAsync(asset.uri);
            return {
              ...asset,
              fileInfo,
              localUri: asset.uri,
            };
          })
        );

        setImages([...images, ...localImages]);

        if (images.length + result.assets.length === 3) {
          showAlert(
            "images_complete",
            "all_required_images_added",
            [
              {
                text: "ok",
                onPress: () => setAlertModalVisible(false),
                primary: true,
              },
            ],
            "check-circle"
          );
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      showAlert(
        "error",
        "image_pick_error",
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
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        if (images.length >= 3) {
          showAlert(
            "too_many_images",
            "max_three_images",
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

        // Store the captured image locally
        const localImages = await Promise.all(
          result.assets.map(async (asset) => {
            // Get file info
            const fileInfo = await FileSystem.getInfoAsync(asset.uri);
            return {
              ...asset,
              fileInfo,
              localUri: asset.uri,
            };
          })
        );

        setImages([...images, ...localImages]);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
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

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // Function to upload a single image to Supabase
  const uploadImageToSupabase = async (imageUri, index) => {
    try {
      // Generate a unique file name
      const timestamp = new Date().getTime();
      const randomString = Math.random().toString(36).substring(2, 10);
      const fileName = `report-${
        bookingId || "unknown"
      }-${timestamp}-${randomString}-${index}.jpg`;

      // Read the file as base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to ArrayBuffer (required by Supabase)
      const arrayBuffer = decode(base64);

      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from("report-images")
        .upload(fileName, arrayBuffer, {
          contentType: "image/jpeg",
        });

      if (error) {
        console.error("Supabase upload error:", error);
        throw error;
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from("report-images")
        .getPublicUrl(fileName);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Upload error:", error);
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

  // This function validates the form and shows the confirmation modal
  const handleSubmitButtonPress = () => {
    console.log("Submit button pressed");
    console.log("Selected reason index:", selectedReasonIndex);
    console.log("Description length:", description.trim().length);

    // Validate inputs
    if (selectedReasonIndex === null) {
      console.log("Validation failed: No reason selected");

      // Use native Alert as a direct fallback
      Alert.alert(
        "Validation Error",
        "Please select a reason for your report",
        [{ text: "OK" }]
      );

      // Also try the custom alert
      showAlert(
        "validation_error",
        "please_select_reason",
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

    if (description.trim().length < 10) {
      console.log("Validation failed: Description too short");

      // Use native Alert as a direct fallback
      Alert.alert(
        "Validation Error",
        "Description must be at least 10 characters long",
        [{ text: "OK" }]
      );

      // Also try the custom alert
      showAlert(
        "validation_error",
        "description_too_short",
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

    if (images.length < 3) {
      console.log("Validation failed: Not enough images");

      // Use native Alert as a direct fallback
      Alert.alert("Validation Error", "Please add exactly 3 images", [
        {
          text: "Add Images",
          onPress: () => showImageOptions(),
        },
        {
          text: "Cancel",
        },
      ]);

      // Also try the custom alert
      showAlert(
        "validation_error",
        "please_add_three_images",
        [
          {
            text: "add_images",
            onPress: () => {
              setAlertModalVisible(false);
              showImageOptions();
            },
            primary: true,
          },
          {
            text: "cancel",
            onPress: () => setAlertModalVisible(false),
          },
        ],
        "error-outline"
      );
      return;
    }

    console.log("Validation passed, showing confirmation modal");
    setError("");
    // Show confirmation modal
    setSubmitConfirmModalVisible(true);
  };

  // This function actually submits the report after confirmation
  const handleSubmit = async () => {
    console.log("Report submission confirmed");
    setSubmitConfirmModalVisible(false);
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Show uploading alert
      showAlert("uploading", safeT("uploading_images"), [], "cloud-upload");

      // Extract image URIs
      const imageUris = images.map((img) => img.localUri || img.uri);

      // Upload images to Supabase
      let uploadedImageUrls = [];
      try {
        uploadedImageUrls = await uploadImagesToSupabase(imageUris);
      } catch (uploadError) {
        console.error("Error uploading images:", uploadError);

        // If upload fails, show error and return
        showAlert(
          "error",
          safeT("upload_failed"),
          [
            {
              text: "ok",
              onPress: () => setAlertModalVisible(false),
              primary: true,
            },
          ],
          "error-outline"
        );
        setIsSubmitting(false);
        setUploadProgress(0);
        return;
      }

      // Close the uploading alert
      setAlertModalVisible(false);

      // Prepare the report data according to the API requirements
      const reportData = {
        bookingId: bookingId,
        content: description,
        reason: reportReasons[selectedReasonIndex],
        isReviewed: false,
        images: uploadedImageUrls,
      };

      console.log("Report data prepared:", reportData);

      // Call the API to create the report
      const response = await createReport(reportData).unwrap();
      console.log("API response:", response);

      // Show success message
      showAlert(
        "report_submitted",
        safeT("report_submission_success"),
        [
          {
            text: "ok",
            onPress: () => {
              setAlertModalVisible(false);
              // Close the modal after successful submission
              handleClose();
            },
            primary: true,
          },
        ],
        "check-circle"
      );

      // Call the onSubmit callback if provided
      if (onSubmit) {
        onSubmit({
          ...reportData,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Report submission error:", error);

      // Use native Alert as a direct fallback
      Alert.alert("Error", "Failed to submit report. Please try again.", [
        { text: "OK" },
      ]);

      // Also try the custom alert
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
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setReason("");
    setDescription("");
    setSelectedReasonIndex(null);
    setError("");
    setImages([]);
    onClose();
  };

  const showImageOptions = () => {
    if (images.length >= 3) {
      showAlert(
        "image_limit_reached",
        "max_three_images",
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

    const imagesNeeded = 3 - images.length;
    setImagePickerModalVisible(true);
    console.log(`${imagesNeeded} more images needed`);
  };

  // Effect to handle API errors
  useEffect(() => {
    if (apiError) {
      console.error("API Error:", apiError);
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
    console.log("Alert modal visible state changed:", alertModalVisible);
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
                {safeT("three_images_required")} ({images.length}/3)
              </Text>

              <View style={styles.imagesContainer}>
                {images.map((image, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image
                      source={{ uri: image.localUri || image.uri }}
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

                {images.length < 3 && (
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
                      {safeT("add_image")} ({3 - images.length}{" "}
                      {safeT("more_needed")})
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
                disabled={isSubmitting || isApiLoading}
              >
                <Text style={styles.cancelButtonText}>{safeT("cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitButtonPress}
                disabled={isSubmitting || isApiLoading}
              >
                {isSubmitting || isApiLoading ? (
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
