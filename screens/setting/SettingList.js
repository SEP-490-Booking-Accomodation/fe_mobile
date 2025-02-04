import { StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView, Text, View } from "react-native";
import SearchField from "../home/SearchField";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function SettingList({ navigation, route }) {
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.textHeader}>Cài đặt</Text>
    </View>
  );

  const renderItem = (icon, title) => (
    <TouchableOpacity style={styles.itemSelect}>
            <Ionicons
              name={icon}
              size={24}
              style={{ marginRight: 20 }}
              color="black"
            />
            <Text style={{ fontSize: 14 }}>{title}</Text>
            <Ionicons
              style={{ marginLeft: "auto" }}
              name="chevron-forward"
              size={15}
              color="#4E72E3"
            />
          </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <View style={styles.content}>
        <SearchField
          style={styles.searchBox}
          backIcon={false}
          filterIcon={false}
          placeholder="Tìm kiếm cài đặt"
        />

        <View style={styles.itemList}>
          {renderItem("flag-outline", "Đổi ngôn ngữ")}
          {renderItem("help-outline", "Trợ giúp và hỗ trợ")}
          {renderItem("information-circle-outline", "Về chúng tôi")}
          {renderItem("lock-closed-outline", "Chính sách bảo mật")}
          {renderItem("headset-outline", "Chăm sóc khách hàng")}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  itemList: {
    
  },
  itemSelect: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d390",
  },
  content: {
    paddingHorizontal: 24,
  },
  searchBox: {
    marginVertical: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.32,
    elevation: 5,
  },
  textHeader: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
