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
import { useTranslation } from "react-i18next";
import CustomButton from "../../components/buttons/Button";
import { Ionicons } from "@expo/vector-icons"; 

const UserProfile = ({ user, isLoading, navigation }) => {
  const { t } = useTranslation();
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

  const handleProfileNavigation = () => {
    navigation.navigate('Home', { screen: 'ProfileScreen' });
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#1A2741" />;
  }

  return (
    <View style={styles.userInfo}>
      {currentUser ? (
        <TouchableOpacity 
          style={styles.userContainer}
          onPress={handleProfileNavigation}
          activeOpacity={0.7}
        >
          <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.username}>{currentUser.name}</Text>
            <Text style={styles.email}>{currentUser.email}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#4E72E3" />
        </TouchableOpacity>
      ) : null}

      {storedToken && currentUser ? (
        <CustomButton
          onPress={handleLogout}
          title={t("logout")}
          style={styles.logoutButton}
          backgroundColor="#4E72E3"
          titleColor="#FFFFFF"
        />
      ) : (
        <CustomButton
          onPress={() => navigation.navigate("Auth")}
          title={t("login")}
          style={styles.loginButton}
          backgroundColor="#1A2741"
          textColor="#fff"
        />
      )}
    </View>
  );
};

const styles = {
  userInfo: {
    marginBottom: 20,
  },
  avatar: { 
    width: 50, 
    height: 50, 
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  username: { 
    fontSize: 18, 
    fontWeight: "bold",
    color: "#1A2741",
    marginBottom: 4,
  },
  email: { 
    fontSize: 14, 
    color: "#6b7280",
    letterSpacing: 0.2,
  },
  loginButton: {
    marginTop: 10,
  },
  logoutButton: {
    marginTop: 10,
  },
  userContainer: {
    backgroundColor: "#f0f4ff",
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#4E72E3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#e6eeff",
  },
};

export default UserProfile;