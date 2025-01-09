import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const SearchField = ({
  placeholder = "Tìm kiếm...",
  onChangeText,
  value,
  backIcon = true,
  filterIcon = true,
  onPressBackIcon = () => {},
  onPressFilterIcon = () => {},
  style,
  inputStyle,
}) => {
  return (
    // <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={[styles.wrapper, style]}>
      {backIcon && (
        <TouchableOpacity
          onPress={onPressBackIcon}
          style={styles.iconBackContainer}
        >
          <View style={styles.iconBack}>
            <Icon name="arrow-back-outline" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
      )}
      <View style={styles.searchContainer}>
        <Icon
          name="search-outline"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.input, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          onChangeText={onChangeText}
          value={value}
        />
      </View>
      {filterIcon && (
        <TouchableOpacity
          onPress={onPressFilterIcon}
          //   style={styles.iconFilterContainer}
        >
          <View style={styles.iconFilter}>
            <Icon name="filter-outline" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
      )}
    </View>
    // </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    paddingVertical: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 30,
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
    color: "#4E72E3",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  iconBackContainer: {
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    backgroundColor: "#fff",
    marginRight: 8,
  },
  iconBack: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    backgroundColor: "#6F8EF1",
  },

  iconFilter: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#6F8EF1",
    marginLeft: 8,
  },
});

export default SearchField;
