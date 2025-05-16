import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import CustomButton from "../buttons/Button";
import Icon from "react-native-vector-icons/Feather";

const HelpModal = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Hướng dẫn sử dụng vé phòng</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="x" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.description}>
              Đây là vé phòng dùng để hiển thị những thông tin cần thiết khi đến
              địa điểm thuê phòng con nhỏng.
            </Text>

            <Text style={styles.sectionTitle}>
              Khi nào thì mật khẩu sẽ được hiển thị?
            </Text>
            <Text style={styles.text}>
              Khi bạn bắt đầu check-in trên hệ thống app của bạn. Bạn sẽ vào mục
              vé này, khi đó nút "Hiển mật khẩu" sẽ có thể tương tác để hiển thị
              mật khẩu cho bạn.
            </Text>

            <Text style={styles.sectionTitle}>
              Gặp vấn đề trong quá trình sử dụng vé?
            </Text>
            <Text style={styles.text}>
              Hãy liên hệ với <Text style={styles.boldText}>chúng tôi</Text>{" "}
              ngay lập tức.
            </Text>
          </View>

          <View style={styles.modalFooter}>
            <CustomButton
              title="Đóng"
              onPress={onClose}
              backgroundColor="#1E293B"
              variant="filled"
              size="medium"
              style={styles.closeButtonStyle}
            />
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
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "100%",
    maxWidth: 500,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    padding: 20,
  },
  description: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 20,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 16,
    color: "#1F2937",
  },
  text: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  boldText: {
    fontWeight: "bold",
    color: "#4E72E3",
  },
  modalFooter: {
    padding: 20,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  closeButtonStyle: {
    minWidth: 160,
  },
});

export default HelpModal;
