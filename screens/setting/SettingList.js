import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView, Text, View, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector, useDispatch } from "react-redux";
import SearchField from "../../components/SearchField";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "../../redux/authSlice";
import { useGetUserQuery } from "../../api/authApi";

export default function SettingList({ navigation }) {
  const dispatch = useDispatch();
  const storedToken = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);
  const { data: user, isLoading } = useGetUserQuery(userId);
  console.log(user);

  const [displayUser, setDisplayUser] = useState(null);

  useEffect(() => {
    if (user) {
      setDisplayUser({
        name: user.getUser.fullName || "Guest",
        email: user.getUser.email || "guest@example.com",
        userId: user.getUser._id || "000000",
        token: storedToken || "No Token",
        avatar: user.getUser.avatarUrl?.[0] || "https://via.placeholder.com/50",
      });
    }
  }, [user, storedToken]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("authData");
    dispatch(logout());
    navigation.replace("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textHeader}>Cài đặt</Text>
      </View>

      <View style={styles.content}>
        <SearchField style={styles.searchBox} placeholder="Tìm kiếm cài đặt" />

        <View style={styles.userInfo}>
          <View style={styles.userContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : displayUser ? (
              <>
                <Image
                  source={{ uri: displayUser.avatar }}
                  style={styles.avatar}
                />
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.username}>{displayUser.name}</Text>

                  <Text style={styles.email}>{displayUser.email}</Text>
                  <Text style={styles.info}>User ID: {displayUser.userId}</Text>
                  <Text style={styles.info}>Token: {displayUser.token}</Text>
                </View>
              </>
            ) : null}
          </View>
          {storedToken ? (
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>Đăng xuất</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.loginText}>Đăng nhập</Text>
            </TouchableOpacity>
          )}
        </View>

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
  content: { paddingHorizontal: 24 },
  searchBox: { marginVertical: 24 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  textHeader: { fontSize: 20, fontWeight: "bold" },
  userInfo: {
    backgroundColor: "#f0f4ff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  userContainer: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  username: { fontSize: 16, fontWeight: "bold" },
  email: { fontSize: 14, color: "#6b7280" },
  loginButton: {
    backgroundColor: "#1A2741",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  loginText: { color: "#fff", fontWeight: "bold" },
  logoutButton: {
    backgroundColor: "#E63946",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  logoutText: { color: "#fff", fontWeight: "bold" },
  itemSelect: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d390",
  },
});
