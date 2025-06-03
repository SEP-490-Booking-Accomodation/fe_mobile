import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import CustomButton from "../../components/buttons/Button";
import CustomInput from "../../components/TextInput";
import {
  useLazyGetCustomerByUserIdQuery,
  useLazyGetUserQuery,
  useLoginMutation,
} from "../../api/authApi";
import { loginSuccess, logout } from "../../redux/authSlice";
import { useLazyGetRoleByIdQuery } from "../../api/roleApi";
import { useAsyncStorage } from "../../context/AsyncStorageContext";
import { useTranslation } from "react-i18next";

const LoginScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [getUserById] = useLazyGetUserQuery();
  const [login] = useLoginMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [getRoleById] = useLazyGetRoleByIdQuery();
  const [useGetCustomerByUserIdLazy] = useLazyGetCustomerByUserIdQuery();
  const { addIdChatPlatform } = useAsyncStorage();

  // Validation functions
  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  const isFormValid = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordFilled = password.trim().length > 0;
    
    return isEmailValid && isPasswordFilled;
  };

  // Real-time validation
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
    if (text && text.trim().length === 0) {
      setPasswordError(t("password_required"));
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = async () => {
    // Final validation before submission
    if (!validateEmail(email)) {
      Alert.alert(t("validation_error"), t("invalid_email"));
      return;
    }
    
    if (!password.trim()) {
      Alert.alert(t("validation_error"), t("password_required"));
      return;
    }

    setIsLoading(true);

    try {
      const response = await login({ 
        email: email.toLowerCase().trim(), 
        password 
      }).unwrap();
      
      dispatch(loginSuccess({ token: response.accessToken }));

      const resGetUser = await getUserById(response._id).unwrap();
      const userData = resGetUser.getUser;

      if (!userData?.isActive) {
        Alert.alert(
          t("account_locked_title"),
          t("account_locked_message")
        );
        setIsLoading(false);
        return;
      }

      const roleData = await getRoleById(userData.roleID).unwrap();

      const resCustomer = await useGetCustomerByUserIdLazy(
        userData._id
      ).unwrap();
      const customerId = resCustomer.id;

      if (roleData.roleName !== "Customer") {
        Alert.alert(
          t("login_error"),
          t("not_customer")
        );
        setIsLoading(false);
        return;
      }

      if (userData.isVerifiedEmail === false) {
        navigation.navigate("OTPVerification", {
          id: response._id,
          email: email.toLowerCase().trim(),
          token: response.accessToken,
          userData: userData,
          refreshToken: response.refreshToken,
          customerId: customerId,
        });
        return;
      }

      dispatch(
        loginSuccess({
          userId: response._id,
          token: response.accessToken,
          userData: userData,
          isAuth: true,
          refreshToken: response.refreshToken,
          customerId: customerId,
        })
      );
      navigation.goBack();

    } catch (error) {
      Alert.alert(
        t("login_failed"),
        error?.data?.message || t("check_credentials")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/bg_login.png")}
      style={styles.backgroundImage}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoid}
          >
            <View style={styles.contentContainer}>
              <View style={styles.header}>
                <Text style={styles.title}>{t("login_title")}</Text>
                <Text style={styles.subtitle}>{t("login_subtitle")}</Text>
              </View>
              <View style={styles.card}>
                <View style={styles.formContainer}>
                  <View style={styles.inputContainer}>
                    <CustomInput
                      label={t("email")}
                      placeholder={t("enter_email")}
                      value={email}
                      onChangeText={handleEmailChange}
                      autoCapitalize="none"
                      keyboardType="email-address"
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
                    />
                    {passwordError ? (
                      <Text style={styles.errorText}>{passwordError}</Text>
                    ) : null}
                  </View>

                  <TouchableOpacity
                    style={styles.forgotPasswordButton}
                    onPress={() => navigation.navigate("ForgotPassword")}
                  >
                    <Text style={styles.forgotPasswordText}>
                      {t("forgot_password?")}
                    </Text>
                  </TouchableOpacity>

                  <CustomButton
                    title={t("login_button")}
                    backgroundColor="#1A2741"
                    disabledBackgroundColor="rgba(26, 39, 65, 0.5)"
                    titleColor="#FFFFFF"
                    disabledTitleColor="#FFFFFF"
                    loading={isLoading}
                    disabled={!isFormValid()}
                    onPress={handleLogin}
                    style={[
                      styles.submitButton,
                      !isFormValid() ? styles.disabledButton : null
                    ]}
                  />

                  <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>{t("no_account")} </Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Register")}
                    >
                      <Text style={styles.signupButtonText}>{t("sign_up")}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
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
  },
  keyboardAvoid: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 150,
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
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
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
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginTop: 8,
    marginBottom: 32,
  },
  forgotPasswordText: {
    color: "#4E72E3",
    fontSize: 14,
    fontWeight: "500",
  },
  submitButton: {
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
});

export default LoginScreen;