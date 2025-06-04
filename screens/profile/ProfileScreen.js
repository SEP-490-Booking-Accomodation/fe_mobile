import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useGetCustomerDetailByIdQuery } from "../../api/profileApi";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useAsyncStorage } from "../../context/AsyncStorageContext";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const userId = useSelector((state) => state.auth?.userId);
  const { data, isLoading, error, refetch } = useGetCustomerDetailByIdQuery(userId);
  const defaultAvatar = require("../../assets/images/man.jpg");
  const dispatch = useDispatch();
  const { removeAllIdChatPlaform } = useAsyncStorage();
  const navigation = useNavigation();

  // Refetch data khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const logoutModalRender = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showLogoutModal}
      onRequestClose={() => setShowLogoutModal(false)}
    >
      <TouchableWithoutFeedback onPress={() => setShowLogoutModal(false)}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t('logout')}</Text>
              <Text style={styles.modalMessage}>
                {t('logout_confirmation')}
              </Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowLogoutModal(false)}
                >
                  <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.logoutButton]}
                  onPress={handleLogout}
                >
                  <Text style={styles.logoutButtonText}>{t('logout')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.arrowBack}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="left" size={24} color="#4E72E3" />
      </TouchableOpacity>
      <Text style={styles.textHeader}>{t('profile')}</Text>
    </View>
  );

  const renderItem = (icon, title, isDanger, onNavigate) => (
    <TouchableOpacity style={styles.itemSelect} onPress={onNavigate}>
      <Ionicons
        name={icon}
        size={24}
        style={{ marginRight: 20, fontWeight: isDanger ? "bold" : "normal" }}
        color={isDanger ? "#FF4B26" : "black"}
      />
      <Text
        style={{
          fontSize: 14,
          color: isDanger ? "#FF4B26" : "#000",
          fontWeight: isDanger ? "bold" : "normal",
        }}
      >
        {title}
      </Text>
      <Ionicons
        style={{ marginLeft: "auto", fontWeight: isDanger ? "bold" : "normal" }}
        name="chevron-forward"
        size={15}
        color={isDanger ? "#FF4B26" : "#4E72E3"}
      />
    </TouchableOpacity>
  );

  const handleNavigateEditInfo = () => {
    navigation.navigate("EditInfo", { data, refetchProfile: refetch });
  };

  const handleNavigateChangePassword = () => {
    navigation.navigate("ChangePassword", { data });
  };

  const handleNavigateFavouriteList = () => {
    navigation.navigate("FavouriteList");
  };

  const handleNavigateHistory = () => {
    navigation.navigate("HistoryScreen");
  };

  const handleNavigateWalletScreen = () => {
    navigation.navigate("Wallet");
  };

  const handleNavigateRatingList = () => {
    navigation.navigate("RatingList");
  };

  const handleNavigateLogout = () => {
    setShowLogoutModal(true);
  };

  const handleLogout = async () => {
    setShowLogoutModal(false);
    dispatch(logout());
    await removeAllIdChatPlaform();
    navigation.reset({
      index: 0,
      routes: [{ name: "MainTabs" }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}
      <ScrollView style={styles.container}>
        <View style={styles.cardProfile}>
          <LinearGradient
            colors={["#0E1D36FF", "#1A4150FF"]}
            style={styles.card}
          >
            <Image
              source={
                data?.userId?.avatarUrl
                  ? { uri: data?.userId?.avatarUrl[0] } 
                  : defaultAvatar
              }
              style={styles.avatar}
            />

            <Text style={styles.name}>{data?.userId?.fullName}</Text>
            <Text style={styles.email}>{data?.userId?.email}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={handleNavigateEditInfo}
            >
              <Text style={styles.buttonText}>{t('edit')}</Text>
              <Ionicons name="pencil-outline" size={16} color="white" />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.informationSection}>
          <Text style={styles.sectionHeader}>{t('my_info')}</Text>
          <View style={styles.itemList}>
            {renderItem(
              "key-outline",
              t('change_password'),
              false,
              handleNavigateChangePassword
            )}
            {renderItem(
              "heart-outline",
              t('favorite_list'),
              false,
              handleNavigateFavouriteList
            )}
            {renderItem(
              "star-outline",
              t('my_ratings'),
              false,
              handleNavigateRatingList
            )}
            {renderItem("power", t('logout'), true, handleNavigateLogout)}
          </View>
        </View>
      </ScrollView>
      {logoutModalRender()}
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
    paddingVertical: 10,
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
    fontWeight: "600",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardProfile: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    color: "#4B5563",
    marginBottom: 24,
  },
  modalButtonContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#6B7280",
  },
  logoutButton: {
    backgroundColor: "#FF4B26",
  },
  cancelButtonText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});