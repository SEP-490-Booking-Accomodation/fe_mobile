import { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import SearchField from "../../components/SearchField";
import { useGetUserQuery } from "../../api/authApi";
import UserProfile from "./UserProfile";

export default function SettingList({ navigation }) {
  const userId = useSelector((state) => state.auth.userId);
  const { data: user, isLoading } = useGetUserQuery(userId);

  const [displayUser, setDisplayUser] = useState(null);

  useEffect(() => {
    if (user) {
      setDisplayUser({
        name: user.getUser.fullName || "Guest",
        email: user.getUser.email || "guest@example.com",
        avatar:
          user.getUser.avatarUrl?.[0] ||
          `https://ui-avatars.com/api/?name=${user.getUser.fullName}&background=random`,
      });
    }
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textHeader}>Cài đặt</Text>
      </View>

      <View style={styles.content}>
        {/* <SearchField
          style={styles.searchBox}
          placeholder="Tìm kiếm cài đặt"
          backIcon={false}
          filterIcon={false}
        /> */}

        {/* Component hiển thị thông tin user */}
        <UserProfile
          user={displayUser}
          isLoading={isLoading}
          navigation={navigation}
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

const renderItem = (icon, title) => (
  <TouchableOpacity style={styles.itemSelect}>
    <Ionicons name={icon} size={24} style={{ marginRight: 20 }} color="black" />
    <Text style={{ fontSize: 14 }}>{title}</Text>
    <Ionicons
      style={{ marginLeft: "auto" }}
      name="chevron-forward"
      size={15}
      color="#4E72E3"
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { paddingHorizontal: 20 },
  searchBox: { marginVertical: 2 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  textHeader: { fontSize: 20, fontWeight: "bold" },
  itemSelect: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d390",
  },
});
