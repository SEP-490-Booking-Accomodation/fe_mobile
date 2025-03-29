import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Modal,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import LocationList from "./LocationList";
import SearchField from "./SearchField";
import HeaderLNA from "./HeaderLNA";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useGetUserQuery } from "../../api/authApi";
import { useGetAllRentalQuery, useGetRentalByIdQuery } from "../../api/rentalLocationApi";

const cities = [
  "Hà Nội",
  "TP Hồ Chí Minh",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "Huế",
  "Nha Trang",
  "Đà Lạt",
  "Vũng Tàu",
  "Quy Nhơn",
  "Buôn Ma Thuột",
  "Phan Thiết",
  "Hạ Long",
  "Vinh",
  "Pleiku",
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const [location, setLocation] = useState("Đang lấy vị trí");
  const [address, setAddress] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [manualCity, setManualCity] = useState(null);
  // const [modalVisible, setModalVisible] = useState(false);
  const authData = useSelector((state) => state.auth);
  const userId = authData.userId;
  const { data: user, refetch: refetchUser } = useGetUserQuery(userId);
  const { data: rental, refetch: refetchRental } = useGetAllRentalQuery();
  const [displayUser, setDisplayUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true); // Bắt đầu trạng thái tải lại
    try {
      await refetchUser(); // Gọi lại API user
      await refetchRental(); // Gọi lại API rental
    } catch (error) {
      console.error("Lỗi tải lại dữ liệu:", error);
    }

    setRefreshing(false); // Kết thúc trạng thái tải lại
  };
  const handleLocationPress = (locationId) => {
    console.log("Navigating with locationId:", locationId); 
    navigation.navigate("DetailRentalLocation", { 
      locationId: locationId 
    });
  };
  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Quyền truy cập vị trí đã bị từ chối.");
        return;
      }

      try {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);

        let geocode = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        if (geocode.length > 0) {
          const place = geocode[0];
          setAddress(`${place.city || ""}, ${place.region || ""}`);
        }
      } catch (error) {
        setErrorMsg("Không thể lấy thông tin địa điểm.");
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    if (user && rental) {
      setLoading(false);
      setDisplayUser({
        name: user.getUser.fullName || "Guest",
        email: user.getUser.email || "guest@example.com",
        avatar:
          user.getUser.avatarUrl?.[0] ||
          `https://ui-avatars.com/api/?name=${user.getUser.fullName}&background=random`,
      });
    } else {
      setLoading(true);
    }
  }, [user, rental]);

  // const handleSelectCity = (city) => {
  //   setManualCity(city);
  //   setModalVisible(false);
  // };

  return (
    <SafeAreaView style={styles.container}>
      <>
        <HeaderLNA
          location={manualCity || address || "Chọn thành phố"}
          onNotificationPress={() => navigation.navigate("NotificationScreen")}
          onAvatarPress={() => navigation.navigate("ProfileScreen")}
          notificationCount={2}
          avatarSource={
            "https://i.pinimg.com/236x/0d/85/e4/0d85e4a8cd465ac49c265e29af5e53e8.jpg"
          }
          authData={authData}
          onLoginPress={() => navigation.navigate("Auth")}
          displayUser={displayUser}
        // onLocationPress={() => setModalVisible(true)}
        />

        <ScrollView
          // style={styles.paddingVertical}
          refreshControl={
            <RefreshControl
              colors={["#FF5733", "#33FF57", "#3357FF"]} // Danh sách màu khi xoay
              tintColor="#3357FF" // Màu spinner trên iOS
              title="Loading..." // Văn bản hiển thị trên iOS
              titleColor="#3357FF" // Màu văn bản trên iOS
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <Text style={[styles.textWelcome, styles.paddingVertical]}>
            Chúc bạn có một chuyến đi vui vẻ trong kỳ nghỉ tuyệt vời!
          </Text>
          <SearchField
            style={[styles.mh, styles.paddingVertical]}
            placeholder="Tìm kiếm điểm đến của bạn"
            backIcon={false}
            filterIcon={false}
          />
          {loading ? (
            <Text>Loading</Text>
          ) : (
          <LocationList
            rentalData={rental}
            onLocationPress={handleLocationPress}
            onViewAllPress={() => navigation.navigate("SearchResult")}
          />
          )}  
        </ScrollView>
      </>
      {/* <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn thành phố</Text>

            <ScrollView style={styles.cityListContainer}>
              {cities.map((city, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.cityOption,
                    { borderBottomWidth: index === cities.length - 1 ? 0 : 1 },
                  ]}
                  activeOpacity={0.6}
                  onPress={() => handleSelectCity(city)}
                >
                  <Text style={styles.cityText}>{city}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  paddingVertical: { paddingHorizontal: 20 },
  textWelcome: { fontSize: 20, fontWeight: "600" },
  mh: { marginVertical: 10 },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    width: "85%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
    letterSpacing: 0.5,
  },
  cityListContainer: {
    maxHeight: 300,
  },
  cityOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
    alignItems: "center",
    marginHorizontal: 5,
  },
  cityText: {
    fontSize: 17,
    fontWeight: "500",
    color: "#0066CC",
    letterSpacing: 0.3,
  },
  cancelButton: {
    marginTop: 20,
    paddingVertical: 14,
    backgroundColor: "#111827",
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cancelText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.5,
  },
});
