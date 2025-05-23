import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  View
} from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import LocationList from "./LocationList";
import SearchField from "./SearchField";
import HeaderLNA from "./HeaderLNA";
import { useSelector } from "react-redux";
import { useGetUserQuery } from "../../api/authApi";
import { useGetAllRentalQuery } from "../../api/rentalLocationApi";
import { ensureUserInDatabase } from "../../lib/supabase";
import { useAsyncStorage } from "../../context/AsyncStorageContext";
import { useTranslation } from "react-i18next";

export default function HomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [location, setLocation] = useState("Đang lấy vị trí");
  const [address, setAddress] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [manualCity, setManualCity] = useState(null);
  const authData = useSelector((state) => state.auth);
  const customerId = useSelector((state) => state.auth.customerId);
  const userId = authData.userId;
  const { data: user, refetch: refetchUser } = useGetUserQuery(userId);
  const { data: rental, refetch: refetchRental } = useGetAllRentalQuery();
  const [displayUser, setDisplayUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  // Get the context at the component level (outside of any function)
  const asyncStorageContext = useAsyncStorage();
  const { removeAllIdChatPlaform, addIdChatPlatform } = useAsyncStorage();
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchUser();
      await refetchRental();
    } catch (error) {
      console.error("Lỗi tải lại dữ liệu:", error);
    }

    setRefreshing(false);
  };

  const handleLocationPress = (locationId) => {
    console.log("Navigating with locationId:", locationId);

    // Find the rental data by locationId
    const selectedRental = rental?.data?.find(
      (item) => item._id === locationId
    );

    if (selectedRental) {
      navigation.navigate("DetailRentalLocation", {
        rentalData: selectedRental,
        previousScreen: "Home",
      });
    } else {
      console.error("Không tìm thấy dữ liệu cho locationId:", locationId);
    }
  };

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg(t("permission_denied"));
        return;
      }
      try {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);

        const geocode = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        if (geocode.length > 0) {
          const place = geocode[0];
          setAddress(`${place.city || ""}, ${place.region || ""}`);
        }
      } catch (error) {
        setErrorMsg(t("location_info_error"));
      }
    };

    const checkUser = async () => {
      // Use the context that was obtained at the component level
      await ensureUserInDatabase(
        user.getUser.id.toString(),
        user.getUser.fullName,
        asyncStorageContext
      );
    };

    checkUser();
    getLocation();
  }, []);

  useEffect(() => {
    if (rental) {
      setLoading(false);
      if (user && user.getUser) {
        setDisplayUser({
          name: user.getUser.fullName || "Guest",
          email: user.getUser.email || "guest@example.com",
          avatar:
            user.getUser.avatarUrl?.[0] ||
            `https://ui-avatars.com/api/?name=${user.getUser.fullName}&background=random`,
        });
      } else {
        setDisplayUser({
          name: "Guest",
          email: "guest@example.com",
          avatar: "https://ui-avatars.com/api/?name=Guest&background=random",
        });
      }
    } else {
      setLoading(true);
    }
  }, [user, rental]);

  return (
    <SafeAreaView style={styles.container}>
      <>
        <HeaderLNA
          location={manualCity || address || t("select_city")}
          onNotificationPress={() => navigation.navigate("NotificationScreen")}
          onAvatarPress={() => navigation.navigate("ProfileScreen")}
          notificationCount={2}
          avatarSource={
            "https://i.pinimg.com/236x/0d/85/e4/0d85e4a8cd465ac49c265e29af5e53e8.jpg"
          }
          authData={authData}
          onLoginPress={() => navigation.navigate("Auth")}
          displayUser={displayUser}
        />

        <ScrollView
          refreshControl={
            <RefreshControl
              colors={["#FF5733", "#33FF57", "#3357FF"]}
              tintColor="#3357FF"
              title="Loading..."
              titleColor="#3357FF"
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <Text style={[styles.textWelcome, styles.paddingVertical]}>
            {t("welcome_message")}
          </Text>
          <SearchField
            style={[styles.mh, styles.paddingVertical]}
            placeholder={t("search_placeholder")}
            backIcon={false}
            filterIcon={false}
          />
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3357FF" />
            </View>
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
  loadingContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingVertical: 100, 
},
});
