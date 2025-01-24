import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Button,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import BottomTabs from "../../components/BottomTabs";
import HeaderLNA from "../../components/HeaderLNA";
import * as Location from "expo-location";
import { CheckLocation } from "./CheckLocation";
import LocationList from "./LocationList";
import { Scroll } from "lucide-react-native";
import SearchField from "./SearchField";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

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
          setAddress(
            `${place.name || ""}, ${place.city || ""}, ${place.region || ""}`
          );
        }
      } catch (error) {
        setErrorMsg("Không thể lấy thông tin địa điểm.");
      }
    };

    getLocation();
  }, []);

  const refreshLocation = async () => {
    try {
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);

      let geocode = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (geocode.length > 0) {
        const place = geocode[0];
        setAddress(
          `${place.name || ""}, ${place.city || ""}, ${place.region || ""}`
        );
      }
    } catch (error) {
      setErrorMsg("Không thể làm mới vị trí.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderLNA
        location={address}
        notificationCount={2}
        avatarSource={
          "https://i.pinimg.com/236x/0d/85/e4/0d85e4a8cd465ac49c265e29af5e53e8.jpg"
        }
      />
      <ScrollView style={styles.paddingVertical}>
        <Text style={styles.textWelcome}>
          Chúc bạn có một chuyến đi vui vẻ trong kỳ nghỉ tuyệt vời!{" "}
        </Text>
        <SearchField
          style={styles.mh}
          placeholder="Tìm kiếm điểm đến của bạn"
          backIcon={false}
        />
        <LocationList />
      </ScrollView>
      {/* <CheckLocation
        location={location}
        address={address}
        errorMsg={errorMsg}
        onRefresh={refreshLocation}
      /> */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <BottomTabs navigation={navigation} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  paddingVertical: { paddingHorizontal: 20 },
  button: {
    backgroundColor: "#1D4ED8",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  marginTop: {
    marginTop: 16,
  },
  textWelcome: {
    fontSize: 20,
    paddingHorizontal: 0,
    fontWeight: 600,
  },
  mh: { marginVertical: 10 },
});
