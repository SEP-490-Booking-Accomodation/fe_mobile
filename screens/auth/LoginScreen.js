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
  const [getUserById] = useLazyGetUserQuery();
  const [login] = useLoginMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [getRoleById] = useLazyGetRoleByIdQuery();
  const [useGetCustomerByUserIdLazy] = useLazyGetCustomerByUserIdQuery();
  const { addIdChatPlatform } = useAsyncStorage();

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      const response = await login({ email, password }).unwrap();
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
      // console.log("Role Data:", roleData);

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
          email: email,
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

      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: "MainTabs" }],
      // });
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
                  <CustomInput
                    label={t("email")}
                    placeholder={t("enter_email")}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                  <CustomInput
                    label={t("password")}
                    placeholder={t("enter_password")}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
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
                    disabled={!email || !password}
                    onPress={handleLogin}
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
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginTop: -8,
    marginBottom: 32,
  },
  forgotPasswordText: {
    color: "#4E72E3",
    marginTop: 20,
    fontSize: 14,
    fontWeight: "500",
  },
  signupContainer: {
    marginTop: 24,
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
