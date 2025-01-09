// SelectCustomer.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const SelectCustomer = ({ maxGuests, onSelect, isVisible, onClose }) => {
  const [adultCount, setAdultCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);

  // Reset counts when modal is reopened
  useEffect(() => {
    if (isVisible) {
      setAdultCount(1);
      setChildrenCount(0);
      setInfantCount(0);
    }
  }, [isVisible]);

  // Hàm xử lý tăng giảm số lượng
  const handleChangeCount = (type, action) => {
    const totalGuests = adultCount + childrenCount + infantCount;
    if (action === "increase" && totalGuests < maxGuests) {
      if (type === "adult") setAdultCount(adultCount + 1);
      if (type === "children") setChildrenCount(childrenCount + 1);
      if (type === "infant") setInfantCount(infantCount + 1);
    } else if (action === "decrease") {
      if (type === "adult" && adultCount > 1) setAdultCount(adultCount - 1); // Ensure at least 1 adult
      if (type === "children" && childrenCount > 0)
        setChildrenCount(childrenCount - 1);
      if (type === "infant" && infantCount > 0) setInfantCount(infantCount - 1);
    } else if (action === "increase" && totalGuests >= maxGuests) {
      Alert.alert("Giới hạn khách", `Tối đa chỉ ${maxGuests} người được phép.`);
    }
  };

  // Gửi dữ liệu khi người dùng xác nhận
  const handleSelect = () => {
    onSelect({ adultCount, childrenCount, infantCount });
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      onRequestClose={onClose}
      animationType="fade"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Số lượng khách hàng</Text>
          <Text style={styles.itemSubTitle}>Tối đa {maxGuests} người</Text>

          {/* Người lớn */}
          <View style={styles.itemContainer}>
            <View>
              <Text style={styles.itemLabel}>Người lớn</Text>
              <Text style={styles.itemSubLabel}>Từ 18 tuổi trở lên</Text>
            </View>
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleChangeCount("adult", "decrease")}
              >
                <Icon name="remove-outline" size={20} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.countText}>{adultCount}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleChangeCount("adult", "increase")}
              >
                <Icon name="add-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Trẻ em */}
          <View style={styles.itemContainer}>
            <View>
              <Text style={styles.itemLabel}>Trẻ em</Text>
              <Text style={styles.itemSubLabel}>Từ 2 đến 17 tuổi</Text>
            </View>
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleChangeCount("children", "decrease")}
              >
                <Icon name="remove-outline" size={20} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.countText}>{childrenCount}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleChangeCount("children", "increase")}
              >
                <Icon name="add-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Trẻ sơ sinh */}
          <View style={styles.itemContainer}>
            <View>
              <Text style={styles.itemLabel}>Trẻ sơ sinh</Text>
              <Text style={styles.itemSubLabel}>Dưới 2 tuổi</Text>
            </View>
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleChangeCount("infant", "decrease")}
              >
                <Icon name="remove-outline" size={20} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.countText}>{infantCount}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleChangeCount("infant", "increase")}
              >
                <Icon name="add-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Nút xác nhận */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSelect}>
            <Text style={styles.submitButtonText}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  itemSubTitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  itemSubLabel: {
    fontSize: 14,
    color: "#666",
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "30%",
  },
  button: {
    backgroundColor: "#4E72E3",
    padding: 8,
    borderRadius: 4,
  },
  countText: {
    fontSize: 18,
    marginHorizontal: 10,
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: "#4E72E3",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SelectCustomer;
