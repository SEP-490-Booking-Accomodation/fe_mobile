import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from "expo-linear-gradient";


export default function ProfileScreen(navigation) {
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.arrowBack}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={24} color="#4E72E3" />
      </TouchableOpacity>
      <Text style={styles.textHeader}>Hồ sơ </Text>
    </View>
  );

    const renderItem = (icon, title, isDanger, onPress) => (
      <TouchableOpacity style={styles.itemSelect} onPress={onPress}>
        <Ionicons
          name={icon}
          size={24}        
          style={{ marginRight: 20 , fontWeight: isDanger ? "bold" : "normal" }}
          color={isDanger ? "#FF4B26" : "black"}
        />
        <Text style={{ fontSize: 14, color: isDanger ? "#FF4B26" : "#000", fontWeight: isDanger ? "bold" : "normal" }}>{title}</Text>
        <Ionicons
          style={{ marginLeft: "auto" , fontWeight: isDanger ? "bold" : "normal" }}
          name="chevron-forward"
          size={15}
          color={isDanger ? "#FF4B26" : "#4E72E3"}
        />
      </TouchableOpacity>
    );
  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      <ScrollView style={styles.container}>
        <View style={styles.cardProfile}>
          <LinearGradient
            colors={["#0E1D36FF", "#1A4150FF"]} // Adjust gradient colors
            style={styles.card}
          >
            <Image
              source={{ uri: "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }} // Replace with your avatar URL
              style={styles.avatar}
            />
            <Text style={styles.name}>Zane Phạm</Text>
            <Text style={styles.email}>zanepham@gmail.com</Text>
            <TouchableOpacity style={styles.button} onPress={navigator.navigate("EditInfo")}>
              <Text style={styles.buttonText}>Chỉnh sửa </Text>
              <Ionicons name="pencil-outline" size={16} color="white" />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.informationSection}>
            <Text style={styles.sectionHeader}>Thông tin của tôi</Text>
            <View style={styles.itemList}>
                      {renderItem("key-outline", "Đổi mật khẩu")}
                      {renderItem("heart-outline", "Danh sách yêu thích")}
                      {renderItem("wallet-outline", "Ví của tôi")}
                      {renderItem("newspaper-outline", "Lịch sử")}
                      {renderItem("star-outline", "Đánh giá của tôi")}
                      {renderItem("power", "Đăng xuất", true)}
                    </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  arrowBack: {
    marginRight: 10,
    color: "#4E72E3",
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
  itemList: {
    paddingVertical: 10
  },
  itemSelect: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    paddingHorizontal: 0,

  },
  textHeader: {
    fontSize: 20,
    fontWeight:  600,
  },
  sectionHeader:{
    fontSize: 18,
    fontWeight: "bold",

  },
  cardProfile: {
     justifyContent: "center",
     alignItems: "center",
     marginBottom: 24
  },
  card: {
    width: "100%",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  email: {
    fontSize: 14,
    color: "#CFCFCF",
    marginBottom: 16,
  },
  button: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 30,
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",

  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
