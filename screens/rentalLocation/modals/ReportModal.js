"use client";

import { useState } from "react";
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
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import AlertModal from "./AlertModal";

const ReportModal = ({
  visible,
  onClose,
  onSubmit,
  t, // translation function
  rentalName,
}) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [selectedReasonIndex, setSelectedReasonIndex] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);

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

  const showAlert = (title, message, buttons = [], icon = "") => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertButtons(buttons);
    setAlertIcon(icon);
    setAlertModalVisible(true);
  };

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showAlert(
          t("permission_required"),
          t("image_permission_message"),
          [
            {
              text: t("ok"),
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
        if (result.assets.length < imagesNeeded) {
          // Show warning that they need to select exactly the required number of images
          showAlert(
            t("not_enough_images"),
            t("please_select_exactly", { count: imagesNeeded }),
            [
              {
                text: t("try_again"),
                onPress: () => pickImage(),
                primary: true,
              },
              {
                text: t("cancel"),
                onPress: () => setAlertModalVisible(false),
              },
            ],
            "warning"
          );
          return;
        }

        setImages([...images, ...result.assets]);

        // If we now have 3 images, show a success message
        if (images.length + result.assets.length === 3) {
          showAlert(
            t("images_complete"),
            t("all_required_images_added"),
            [
              {
                text: t("ok"),
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
        t("error"),
        t("image_pick_error"),
        [
          {
            text: t("ok"),
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
        t("permission_required"),
        t("camera_permission_message"),
        [
          {
            text: t("ok"),
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
        // Check if adding this image would exceed the limit
        if (images.length >= 3) {
          showAlert(
            t("too_many_images"),
            t("max_three_images"),
            [
              {
                text: t("ok"),
                onPress: () => setAlertModalVisible(false),
                primary: true,
              },
            ],
            "warning"
          );
          return;
        }

        setImages([...images, ...result.assets]);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      showAlert(
        t("error"),
        t("camera_error"),
        [
          {
            text: t("ok"),
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

  // This function validates the form and shows the confirmation modal
  const handleSubmitButtonPress = () => {
    console.log("Submit button pressed");
    console.log("Selected reason index:", selectedReasonIndex);
    console.log("Description length:", description.trim().length);

    // Validate inputs
    if (selectedReasonIndex === null) {
      console.log("Validation failed: No reason selected");
      setError(t("please_select_reason"));
      return;
    }

    if (description.trim().length < 10) {
      console.log("Validation failed: Description too short");
      setError(t("description_too_short"));
      return;
    }

    if (images.length < 3) {
      console.log("Validation failed: Not enough images");
      setError(t("please_add_three_images"));
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

    try {
      // Here you would normally make an API call to submit the report
      // For now, we'll just simulate a delay
      console.log("Simulating API call...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const reportData = {
        reason: reportReasons[selectedReasonIndex],
        description: description,
        images: images.map((img) => img.uri),
        timestamp: new Date().toISOString(),
      };

      console.log("Report data prepared:", reportData);

      if (onSubmit) {
        console.log("Calling onSubmit callback");
        onSubmit(reportData);
      } else {
        console.log("onSubmit callback is not defined");
      }

      // Reset form and close modal
      setReason("");
      setDescription("");
      setSelectedReasonIndex(null);
      setImages([]);
      onClose();
      console.log("Form reset and modal closed");
    } catch (error) {
      console.error("Report submission error:", error);
      setError(t("report_submission_failed"));
    } finally {
      setIsSubmitting(false);
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
        t("image_limit_reached"),
        t("max_three_images"),
        [
          {
            text: t("ok"),
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
              <Text style={styles.modalTitle}>{t("report_issue")}</Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Text style={styles.reportingText}>
                {t("report_rental_name")}:{" "}
                <Text style={styles.rentalName}>{rentalName}</Text>
              </Text>

              <Text style={styles.sectionTitle}>{t("reason_for_report")}</Text>
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
                      {t(item)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionTitle}>{t("description")}</Text>
              <TextInput
                style={styles.descriptionInput}
                multiline
                numberOfLines={5}
                placeholder={t("describe_issue_in_detail")}
                value={description}
                onChangeText={setDescription}
                textAlignVertical="top"
              />

              <Text style={styles.sectionTitle}>{t("evidence_images")}</Text>
              <Text style={styles.helperText}>
                {t("three_images_required")} ({images.length}/3)
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
                      {t("add_image")} ({3 - images.length} {t("more_needed")})
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
                disabled={isSubmitting}
              >
                <Text style={styles.cancelButtonText}>{t("cancel")}</Text>
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
                    {t("submit_report")}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Alert Modal */}
      <AlertModal
        visible={alertModalVisible}
        onClose={() => setAlertModalVisible(false)}
        title={alertTitle}
        message={alertMessage}
        buttons={alertButtons}
        icon={alertIcon}
      />

      {/* Image Picker Modal */}
      <AlertModal
        visible={imagePickerModalVisible}
        onClose={() => setImagePickerModalVisible(false)}
        title={t("add_image")}
        message={t("choose_image_source")}
        icon="photo-library"
        buttons={[
          {
            text: t("camera"),
            onPress: takePhoto,
            icon: "camera-alt",
          },
          {
            text: t("gallery"),
            onPress: pickImage,
            icon: "photo-library",
          },
          {
            text: t("cancel"),
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
        title={t("confirm_submission")}
        message={t("submit_report_confirmation")}
        icon="help-outline"
        buttons={[
          {
            text: t("submit"),
            onPress: handleSubmit,
            primary: true,
            icon: "send",
          },
          {
            text: t("cancel"),
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
  reportingText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  rentalName: {
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
});

export default ReportModal;
