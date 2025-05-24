import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const PolicyItem = ({ iconName, title, time, message, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Icon name={iconName} size={24} color="#4E72E3" />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <Text style={styles.message} numberOfLines={2} ellipsizeMode="tail">
          {message}
        </Text>
      </View>
      <AntDesign name="right" size={20} color="#4E72E3"/>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F0F4FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  message: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
});

export default PolicyItem;