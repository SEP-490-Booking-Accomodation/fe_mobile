import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const MoreOptionsModal = ({
  visible,
  onClose,
  onShare,
  onReport, // We'll keep this prop to avoid breaking existing code, but won't use it
  t, // translation function
}) => {
  const handleShare = () => {
    if (onShare) onShare();
    onClose();
  };

  // We're removing the handleReport function and the report option from the UI

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t("more_options")}</Text>

            <TouchableOpacity style={styles.modalOption} onPress={handleShare}>
              <Icon name="share" size={20} color="#333" />
              <Text style={styles.modalOptionText}>{t("share")}</Text>
            </TouchableOpacity>

            {/* Report option removed */}

            <TouchableOpacity
              style={[styles.modalOption, styles.cancelOption]}
              onPress={onClose}
            >
              <Text style={styles.cancelText}>{t("cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
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
    width: "80%",
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContent: {
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#333",
  },
  cancelOption: {
    justifyContent: "center",
    borderBottomWidth: 0,
    marginTop: 8,
  },
  cancelText: {
    fontSize: 16,
    color: "#4E72E3",
    fontWeight: "600",
    textAlign: "center",
  },
});

export default MoreOptionsModal;
