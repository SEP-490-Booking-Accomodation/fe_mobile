import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const AlertModal = ({
  visible,
  onClose,
  title,
  message,
  buttons = [],
  icon,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {icon && (
              <View style={styles.iconContainer}>
                <Icon name={icon} size={32} color="#4e72e3" />
              </View>
            )}

            <Text style={styles.modalTitle}>{title}</Text>

            {message && <Text style={styles.modalMessage}>{message}</Text>}

            <View style={styles.buttonContainer}>
              {buttons.length > 0 ? (
                buttons.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      button.primary && styles.primaryButton,
                      button.style,
                      index < buttons.length - 1 && styles.buttonMargin,
                    ]}
                    onPress={button.onPress}
                  >
                    {button.icon && (
                      <Icon
                        name={button.icon}
                        size={20}
                        color={button.primary ? "#fff" : "#4e72e3"}
                        style={styles.buttonIcon}
                      />
                    )}
                    <Text
                      style={[
                        styles.buttonText,
                        button.primary && styles.primaryButtonText,
                        button.textStyle,
                      ]}
                    >
                      {button.text}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={onClose}
                >
                  <Text style={styles.primaryButtonText}>OK</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
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
    padding: 24,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 8,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#4e72e3",
  },
  primaryButton: {
    backgroundColor: "#4e72e3",
    borderColor: "#4e72e3",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4e72e3",
  },
  primaryButtonText: {
    color: "#fff",
  },
  buttonMargin: {
    marginBottom: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
});

export default AlertModal;
