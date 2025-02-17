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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import CustomButton from "../../components/buttons/Button";
import CustomInput from "../../components/TextInput";
import { useLoginMutation } from "../../api/authApi";
import { loginSuccess } from "../../redux/authSlice";

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authData = await AsyncStorage.getItem("authData");
        if (authData) {
          const { userId, token } = JSON.parse(authData);
          dispatch(loginSuccess({ userId, token }));
          navigation.replace("MainTabs");
        }
      } catch (error) {
        console.log("Lỗi khi lấy dữ liệu đăng nhập:", error);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await login({ email, password }).unwrap();

      console.log("Full login response:", response); // Kiểm tra toàn bộ response

      // Nếu API trả về trực tiếp mà không có .data
      const { _id, accessToken } = response;

      if (!_id || !accessToken) {
        throw new Error("Dữ liệu trả về không hợp lệ");
      }

      dispatch(loginSuccess({ userId: _id, token: accessToken }));
      await AsyncStorage.setItem(
        "authData",
        JSON.stringify({ userId: _id, token: accessToken })
      );

      navigation.replace("MainTabs");
    } catch (error) {
      console.log("Login error:", error);
      Alert.alert(
        "Đăng nhập thất bại",
        error?.data?.message || "Vui lòng kiểm tra lại thông tin đăng nhập"
      );
    }
  };
  // const handleLogin = async () => {
  //   // console.log("API URL:", process.env.EXPO_PUBLIC_API_URL);

  //   console.log("Đang gọi API login...");
  //   try {
  //     const response = await login({ email, password }).unwrap();
  //     console.log("Login response:", response);

  //     dispatch(
  //       loginSuccess({ userId: response.userId, token: response.token })
  //     );

  //     navigation.replace("MainTabs");
  //   } catch (error) {
  //     console.log("Login error:", error);
  //     Alert.alert(
  //       "Đăng nhập thất bại",
  //       error?.data?.message || "Có lỗi xảy ra"
  //     );
  //   }
  // };

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
          <View style={styles.contentContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Đăng nhập</Text>
              <Text style={styles.subtitle}>
                Bắt đầu hành trình của bạn: Đăng nhập để khám phá
              </Text>
            </View>
            <View style={styles.card}>
              <View style={styles.formContainer}>
                <CustomInput
                  label="Email hoặc Số điện thoại"
                  placeholder="Nhập email hoặc số điện thoại"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                <CustomInput
                  label="Mật khẩu"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
                <TouchableOpacity
                  style={styles.forgotPasswordButton}
                  onPress={() => navigation.navigate("ForgotPassword")}
                >
                  <Text style={styles.forgotPasswordText}>Quên Mật khẩu?</Text>
                </TouchableOpacity>
                <CustomButton
                  title="Đăng nhập"
                  backgroundColor="#1A2741"
                  disabledBackgroundColor="rgba(26, 39, 65, 0.5)"
                  titleColor="#FFFFFF"
                  disabledTitleColor="#FFFFFF"
                  loading={isLoading}
                  disabled={!email || !password}
                  onPress={handleLogin}
                />
                <View style={styles.signupContainer}>
                  <Text style={styles.signupText}>Chưa có tài khoản? </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Register")}
                  >
                    <Text style={styles.signupButtonText}>Đăng ký ngay</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
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
    fontSize: 14,
    fontWeight: "500",
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
