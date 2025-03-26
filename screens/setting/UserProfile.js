import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logout } from "../../redux/authSlice";
import { useEffect, useState } from "react";

const UserProfile = ({ user, isLoading, navigation }) => {
  const dispatch = useDispatch();
  const storedToken = useSelector((state) => state.auth.token);
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const handleLogout = async () => {
    dispatch(logout());
    setCurrentUser(null);
    // navigation.replace("SettingList");
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#1A2741" />;
  }

  return (
    <View style={styles.userInfo}>
      {currentUser ? (
        <View style={styles.userContainer}>
          <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.username}>{currentUser.name}</Text>
            <Text style={styles.email}>{currentUser.email}</Text>
          </View>
        </View>
      ) : null}
      {storedToken && currentUser ? (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Auth")}
        >
          <Text style={styles.loginText}>Đăng nhập</Text>
        </TouchableOpacity>
      )}
      {/* <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = {
  userInfo: {
    // padding: 20,
    borderRadius: 12,
    // alignItems: "center",
    marginBottom: 20,
  },
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
  userContainer: {
    backgroundColor: "#f0f4ff",
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
    flexDirection: "row",
  },
};

export default UserProfile;
