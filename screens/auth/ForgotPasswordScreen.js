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
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/buttons/Button";
import CustomInput from "../../components/TextInput";
import IconButton from "../../components/buttons/IconButton";
import { useForgetPasswordTokenMutation } from "../../api/authApi";

const { height } = Dimensions.get("window");

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgetPasswordToken] = useForgetPasswordTokenMutation();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSendForgotPassword = () => {
    if (!validateEmail(email)) {
      Alert.alert("Lỗi", "Email không hợp lệ.");
      return;
    }

    setLoading(true);

    console.log("Đang gửi email");
    const dataForgot = { email: email };
    forgetPasswordToken({ data: dataForgot })
      .unwrap()
      .then((res) => {
        console.log("res", res);
        setLoading(false);
        Alert.alert(
          "Thành công",
          "Vui lòng kiểm tra email để đặt lại mật khẩu.",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      })
      .catch((error) => {
        setLoading(false);
        console.log("error", error);
        Alert.alert("Lỗi", error.data.message);

        // Alert.alert("Lỗi", "Gửi email thất bại, vui kiểm tra lại email.");
      });
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
              <IconButton
                iconName="arrow-left"
                iconSize={24}
                iconColor="#FFFFFF"
                onPress={() => navigation.goBack()}
                buttonSize={50}
                buttonColor="transparent"
                borderColor="transparent"
                style={styles.backButton}
              />
              <View style={styles.header}>
                <Text style={styles.title}>Quên mật khẩu</Text>
                <Text style={styles.subtitle}>
                  Nhập email hoặc số điện thoại của bạn để khôi phục mật khẩu.
                  {/* Nhập email hoặc số điện thoại của bạn để khôi phục mật khẩu. */}
                </Text>
              </View>
              <View style={styles.card}>
                <View style={styles.formContainer}>
                  <View style={styles.dot} />
                  <CustomInput
                    label="Email hoặc Số điện thoại"
                    placeholder="Nhập email hoặc số điện thoại"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    containerStyle={styles.inputContainer}
                    inputContainerStyle={styles.input}
                  />
                  <CustomButton
                    title="Gửi"
                    backgroundColor="#1A2741"
                    disabledBackgroundColor="rgba(26, 39, 65, 0.5)"
                    titleColor="#FFFFFF"
                    disabledTitleColor="#FFFFFF"
                    loading={loading}
                    disabled={!email}
                    style={styles.loginButton}
                    onPress={handleSendForgotPassword}
                  />
                  <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Đã có tài khoản? </Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Login")}
                    >
                      <Text style={styles.signupButtonText}>Đăng nhập</Text>
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
  container: {
    flex: 1,
  },
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
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 1,
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
    lineHeight: 24,
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
});

export default ForgotPasswordScreen;
