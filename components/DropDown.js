import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const Dropdown = ({
  data = [],
  onSelect = () => {},
  placeholder = "Select an option",
  selectedValue = null,
  style,
  dropdownStyle,
  optionStyle,
}) => {
  const [visible, setVisible] = useState(false);

  const toggleDropdown = () => {
    setVisible((prev) => !prev);
  };

  const handleSelect = (item) => {
    onSelect(item);
    setVisible(false);
  };
  const hideDropdown = () => {
    setVisible(false);
    Keyboard.dismiss(); // Ẩn bàn phím nếu có
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.dropdown} onPress={toggleDropdown}>
        <Text style={styles.selectedText}>{selectedValue || placeholder}</Text>
        <Icon name="chevron-down-outline" size={20} color="#4E72E3" />
      </TouchableOpacity>

      {visible && (
        // <TouchableWithoutFeedback onPress={() => setVisible(false)}>
        <TouchableWithoutFeedback onPress={hideDropdown}>
          <View style={StyleSheet.absoluteFillObject}>
            <View style={[styles.dropdownContainer, dropdownStyle]}>
              <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.option, optionStyle]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={styles.optionText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  selectedText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownContainer: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 5, // Shadow cho Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4, // Shadow cho iOS
    zIndex: 1000, // Hiển thị phía trên các thành phần khác
    top: 48, // Hiển thị ngay bên dưới dropdown
    width: "100%", // Độ rộng khớp với thành phần dropdown
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
});

export default Dropdown;
