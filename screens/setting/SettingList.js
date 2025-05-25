import { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Text,
  View,
  Modal,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import SearchField from "../../components/SearchField";
import { useGetUserQuery } from "../../api/authApi";
import UserProfile from "./UserProfile";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

export default function SettingList() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const userId = useSelector((state) => state.auth.userId);
  const { data: user, isLoading } = useGetUserQuery(userId);

  const [displayUser, setDisplayUser] = useState(null);
  const [isLangModalVisible, setIsLangModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const languages = [
    { code: "vi", name: t("vietnamese") },
    { code: "en", name: t("english") },
    { code: "ja", name: t("japanese") },
  ];

  useEffect(() => {
    if (user) {
      setDisplayUser({
        name: user.getUser.fullName || t("guest"),
        email: user.getUser.email || "guest@example.com",
        avatar:
          user.getUser.avatarUrl?.[0] ||
          `https://ui-avatars.com/api/?name=${user.getUser.fullName}&background=random`,
      });
    }
  }, [user, t]);

  const handlePolicyPress = () => {
    navigation.navigate("Policies");
  };
  const handleHelpSupportPress = () => {
    navigation.navigate("HelpSupport");
  };

  const handleAboutUsPress = () => {
    navigation.navigate("AboutUs");
  };

  const handleCustomerCarePress = () => {
    navigation.navigate("CustomerCare");
  };


  const handleLanguageChange = async (langCode) => {
    setSelectedLanguage(langCode);
    await i18n.changeLanguage(langCode);
    setIsLangModalVisible(false);
  };

  const renderItem = (icon, title, onPress) => (
    <TouchableOpacity style={styles.itemSelect} onPress={onPress}>
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

  const renderLanguageOption = (lang) => (
    <TouchableOpacity
      key={lang.code}
      style={styles.langItem}
      onPress={() => handleLanguageChange(lang.code)}
    >
      <Ionicons
        name={selectedLanguage === lang.code ? "radio-button-on" : "radio-button-off"}
        size={24}
        color="#4E72E3"
      />
      <Text style={styles.langText}>{lang.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.textHeader}>{t("settings")}</Text>
      </View>

      <View style={styles.content}>
        <UserProfile
          user={displayUser}
          isLoading={isLoading}
          navigation={navigation}
          t={t}
        />

        <View style={styles.itemList}>
          {renderItem("earth-outline", t("change_language"), () =>
            setIsLangModalVisible(true)
          )}
          {renderItem("help-outline", t("help_support"), handleHelpSupportPress)}
          {renderItem("information-circle-outline", t("about_us"), handleAboutUsPress)}
          {renderItem("lock-closed-outline", t("privacy_policy"), handlePolicyPress)}
          {renderItem("headset-outline", t("customer_care"), handleCustomerCarePress)}
        </View>

        <Modal
          visible={isLangModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsLangModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t("select_language")}</Text>
              {languages.map(renderLanguageOption)}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsLangModalVisible(false)}
              >
                <Text style={styles.closeText}>{t("close")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { paddingHorizontal: 20 },
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  langItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  langText: {
    fontSize: 16,
    marginLeft: 10,
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    alignSelf: "center",
  },
  closeText: {
    color: "#4E72E3",
    fontSize: 16,
  },
});