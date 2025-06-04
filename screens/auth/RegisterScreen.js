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
  Alert,
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [register] = useRegisterMutation();

  // Error states
  const [fullNameError, setFullNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [dobError, setDobError] = useState("");

  // Validation functions (same as web)
  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  
  const validatePhone = (phone) => /^\d{10}$/.test(phone);
  
  const validateDateOfBirth = (dob) => {
    if (!dob) return false;
    
    const birthDate = new Date(dob);
    const today = new Date();
    const currentYear = today.getFullYear();
    const birthYear = birthDate.getFullYear();
    
    if (birthDate > today) return false;
    
    if (currentYear - birthYear > 100) return false;
    
    const age = currentYear - birthYear;
    const hasHadBirthdayThisYear = today >= new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
    
    return age > 18 || (age === 18 && hasHadBirthdayThisYear);
  };
  
  const validatePassword = (password) => {
    if (password.length < 8) return false;
    
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    return hasUppercase && hasLowercase && hasNumber && hasSpecial;
  };

  const isFormValid = () => {
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phone);
    const isDoBValid = validateDateOfBirth(dob);
    const isPasswordValid = validatePassword(password);
    const isPasswordMatch = password === confirmPassword && confirmPassword !== "";
    const isFullNameValid = fullName.trim() !== "";
    
    return isEmailValid && isPhoneValid && isDoBValid && isPasswordValid && 
           isPasswordMatch && isFullNameValid && acceptTerms;
  };

  // Real-time validation handlers
  const handleFullNameChange = (text) => {
    setFullName(text);
    if (text && text.trim() === "") {
      setFullNameError(t("full_name_required"));
    } else {
      setFullNameError("");
    }
  };

  const handlePhoneChange = (text) => {
    setPhone(text);
    if (text && !validatePhone(text)) {
      setPhoneError(t("phone_must_be_10_digits"));
    } else {
      setPhoneError("");
    }
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if (text && !validateEmail(text)) {
      setEmailError(t("invalid_email"));
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (text && !validatePassword(text)) {
      setPasswordError(t("password_requirements"));
    } else {
      setPasswordError("");
    }
    
    // Also check confirm password if it's filled
    if (confirmPassword && text !== confirmPassword) {
      setConfirmPasswordError(t("password_mismatch"));
    } else if (confirmPassword) {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    if (text && password !== text) {
      setConfirmPasswordError(t("password_mismatch"));
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleDateChange = (selectedDate) => {
    if (selectedDate) {
      setDob(selectedDate);
      if (!validateDateOfBirth(selectedDate)) {
        setDobError(t("age_requirement_18_100"));
      } else {
        setDobError("");
      }
    }
  };

  const handleRegister = async () => {
    // Final validation before submission
    if (!fullName.trim()) {
      Alert.alert(t("validation_error"), t("full_name_required"));
      return;
    }
    if (!validatePhone(phone)) {
      Alert.alert(t("validation_error"), t("phone_must_be_10_digits"));
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert(t("validation_error"), t("invalid_email"));
      return;
    }
    if (!validateDateOfBirth(dob)) {
      Alert.alert(t("validation_error"), t("age_requirement_18_100"));
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert(t("validation_error"), t("password_requirements"));
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(t("validation_error"), t("password_mismatch"));
      return;
    }
    if (!acceptTerms) {
      Alert.alert(t("validation_error"), t("accept_terms_required"));
      return;
    }

    setLoading(true);

    try {
      const data = {
        fullName,
        phone,
        email: email.toLowerCase().trim(),
        password,
        doB: dob,
        avatarUrl: [],
        roleID: "67f87ca8c19b91da666bbdc9",
      };
      const response = await register({ data: data }).unwrap();
      Alert.alert(t("success"), t("register_success"));
      navigation.goBack();
    } catch (error) {
      Alert.alert(t("error"), error?.data?.message || t("register_failed"));
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
    if (Platform.OS === "ios") {
      setIsModalVisible(true);
    } else {
      setShowDatePicker(true);
    }
  };

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      handleDateChange(selectedDate);
    }
  };

  const confirmDate = () => {
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
                <View style={styles.inputContainer}>
                  <CustomInput
                    label={t("full_name")}
                    placeholder={t("enter_full_name")}
                    value={fullName}
                    onChangeText={handleFullNameChange}
                    autoCapitalize="words"
                    inputContainerStyle={[
                      styles.input,
                      fullNameError ? styles.inputError : null
                    ]}
                  />
                  {fullNameError ? (
                    <Text style={styles.errorText}>{fullNameError}</Text>
                  ) : null}
                </View>

                <View style={styles.inputContainer}>
                  <CustomInput
                    label={t("phone")}
                    placeholder={t("enter_phone")}
                    value={phone}
                    onChangeText={handlePhoneChange}
                    keyboardType="phone-pad"
                    inputContainerStyle={[
                      styles.input,
                      phoneError ? styles.inputError : null
                    ]}
                  />
                  {phoneError ? (
                    <Text style={styles.errorText}>{phoneError}</Text>
                  ) : null}
                </View>

                <View style={styles.inputContainer}>
                  <CustomInput
                    label={t("email")}
                    placeholder={t("enter_email")}
                    value={email}
                    onChangeText={handleEmailChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    inputContainerStyle={[
                      styles.input,
                      emailError ? styles.inputError : null
                    ]}
                  />
                  {emailError ? (
                    <Text style={styles.errorText}>{emailError}</Text>
                  ) : null}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{t("dob")}</Text>
                  <TouchableOpacity
                    style={[
                      styles.input, 
                      styles.dateInput,
                      dobError ? styles.inputError : null
                    ]}
                    onPress={showDatepicker}
                  >
                    <Text
                      style={dob ? styles.dateText : styles.placeholderText}
                    >
                      {dob ? formatDate(dob) : t("select_dob")}
                    </Text>
                  </TouchableOpacity>
                  {dobError ? (
                    <Text style={styles.errorText}>{dobError}</Text>
                  ) : null}
                </View>

                <View style={styles.inputContainer}>
                  <CustomInput
                    label={t("password")}
                    placeholder={t("enter_password")}
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry
                    inputContainerStyle={[
                      styles.input,
                      passwordError ? styles.inputError : null
                    ]}
                    passwordIconColor="#6B7280"
                  />
                  {passwordError ? (
                    <Text style={styles.errorText}>{passwordError}</Text>
                  ) : null}
                </View>

                <View style={styles.inputContainer}>
                  <CustomInput
                    label={t("confirm_password")}
                    placeholder={t("re_enter_password")}
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    secureTextEntry
                    inputContainerStyle={[
                      styles.input,
                      confirmPasswordError ? styles.inputError : null
                    ]}
                    passwordIconColor="#6B7280"
                  />
                  {confirmPasswordError ? (
                    <Text style={styles.errorText}>{confirmPasswordError}</Text>
                  ) : null}
                </View>

                <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => setAcceptTerms(!acceptTerms)}
                  >
                    <View style={[
                      styles.checkboxBox,
                      acceptTerms ? styles.checkboxChecked : null
                    ]}>
                      {acceptTerms && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                    <Text style={styles.checkboxText}>
                      {t("accept_terms_and_privacy")}
                    </Text>
                  </TouchableOpacity>
                </View>

                <CustomButton
                  title={t("register_button")}
                  backgroundColor="#1A2741"
                  disabledBackgroundColor="rgba(26, 39, 65, 0.5)"
                  titleColor="#FFFFFF"
                  disabledTitleColor="#FFFFFF"
                  loading={loading}
                  disabled={!isFormValid()}
                  style={[
                    styles.loginButton,
                    !isFormValid() ? styles.disabledButton : null
                  ]}
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

      {/* DatePicker for Android */}
      {Platform.OS === "android" && showDatePicker && (
        <DateTimePicker
          value={dob}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}

      {/* DatePicker Modal for iOS */}
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
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  inputError: {
    borderColor: "#EF4444",
    borderWidth: 1,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
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
  checkboxContainer: {
    marginBottom: 24,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 4,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#4E72E3",
    borderColor: "#4E72E3",
  },
  checkboxText: {
    fontSize: 14,
    color: "#1F2937",
    flex: 1,
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  loginButton: {
    marginBottom: 24,
  },
  disabledButton: {
    opacity: 0.6,
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
