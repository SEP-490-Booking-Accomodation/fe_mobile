import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Modal,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/buttons/Button";
import CustomInput from "../../components/TextInput";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRegisterMutation } from "../../api/authApi";
import { useTranslation } from "react-i18next";

const { height } = Dimensions.get("window");

const RegisterScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [register] = useRegisterMutation();

  const handleRegister = async () => {
    if (!fullName || !phone || !email || !password || !confirmPassword) {
      alert(t("fill_all_fields"));
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      alert(t("invalid_phone"));
      return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      alert(t("invalid_email"));
      return;
    }
    if (password.length < 8) {
      alert(t("password_length"));
      return;
    }

    const ageDiff = new Date().getFullYear() - dob.getFullYear();
    if (
      ageDiff < 16 ||
      (ageDiff === 16 &&
        new Date() < new Date(dob.setFullYear(dob.getFullYear() + 16)))
    ) {
      alert(t("age_requirement"));
      return;
    }

    if (dob > new Date()) {
      alert(t("invalid_dob"));
      return;
    }

    if (password !== confirmPassword) {
      alert(t("password_mismatch"));
      return;
    }

    setLoading(true);

    try {
      const data = {
        fullName,
        phone,
        email,
        password,
        doB: dob,
        avatarUrl: null,
        roleID: "67f87ca8c19b91da666bbdc9",
      };
      const response = await register({ data: data }).unwrap();
      alert(t("register_success"));
    } catch (error) {
      alert(t("register_failed"));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return t("date_format", { day, month, year });
  };

  const showDatepicker = () => {
    setIsModalVisible(true);
  };

  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  const confirmDate = () => {
    console.log("confirm");
    setIsModalVisible(false);
  };

  return (
    <ImageBackground
      source={require("../../assets/images/bg_login.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
        >
          <ScrollView
            style={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.header}>
              <Text style={styles.title}>{t("register_title")}</Text>
              <Text style={styles.subtitle}>{t("register_subtitle")}</Text>
            </View>
            <View style={styles.card}>
              <View style={styles.formContainer}>
                <CustomInput
                  label={t("full_name")}
                  placeholder={t("enter_full_name")}
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={styles.input}
                />
                <CustomInput
                  label={t("phone")}
                  placeholder={t("enter_phone")}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={styles.input}
                />
                <CustomInput
                  label={t("email")}
                  placeholder={t("enter_email")}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={styles.input}
                />
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{t("dob")}</Text>
                  <TouchableOpacity
                    style={[styles.input, styles.dateInput]}
                    onPress={showDatepicker}
                  >
                    <Text
                      style={dob ? styles.dateText : styles.placeholderText}
                    >
                      {dob ? formatDate(dob) : t("select_dob")}
                    </Text>
                  </TouchableOpacity>
                </View>
                <CustomInput
                  label={t("password")}
                  placeholder={t("enter_password")}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={styles.input}
                  passwordIconColor="#6B7280"
                />
                <CustomInput
                  label={t("confirm_password")}
                  placeholder={t("re_enter_password")}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={styles.input}
                  passwordIconColor="#6B7280"
                />
                <CustomButton
                  title={t("register_button")}
                  backgroundColor="#1A2741"
                  disabledBackgroundColor="rgba(26, 39, 65, 0.5)"
                  titleColor="#FFFFFF"
                  disabledTitleColor="#FFFFFF"
                  loading={loading}
                  disabled={
                    !fullName ||
                    !phone ||
                    !email ||
                    !password ||
                    !confirmPassword
                  }
                  style={styles.loginButton}
                  onPress={handleRegister}
                />
                <View style={styles.signupContainer}>
                  <Text style={styles.signupText}>{t("have_account")} </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Login")}
                  >
                    <Text style={styles.signupButtonText}>{t("login")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <DateTimePicker
              value={dob}
              mode="date"
              display="spinner"
              onChange={onDateChange}
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
            />
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={confirmDate}
            >
              <Text style={styles.confirmButtonText}>{t("confirm")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  safeArea: {
    flex: 1,
    marginTop: 50,
  },
  keyboardAvoid: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,

    // justifyContent: "space-between",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 70,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#EFF6FF",
    lineHeight: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingTop: 32,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 50 : 24,
  },
  dot: {
    width: 48,
    height: 6,
    borderRadius: 4,
    backgroundColor: "#EBEBEB",
    alignSelf: "center",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  loginButton: {
    marginBottom: 24,
  },
  signupContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  signupText: {
    color: "#94A3B8",
    fontSize: 14,
  },
  signupButtonText: {
    color: "#4E72E3",
    fontSize: 14,
    fontWeight: "500",
  },

  dateInput: {
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  inputLabel: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
  dateText: {
    fontSize: 16,
    color: "#1F2937",
  },
  placeholderText: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#666",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  confirmButton: {
    marginTop: 10,
    backgroundColor: "#999",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RegisterScreen;
