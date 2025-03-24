import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import CustomButton from "../../components/buttons/Button";
import IconButton from "../../components/buttons/IconButton";
import {
  useSendOtpMutation,
  useVerifyEmailOtpMutation,
} from "../../api/authApi";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/authSlice";

const OTPVerificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { email, userData, id, token } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [sendOtp] = useSendOtpMutation();
  const [verifyEmailOtp] = useVerifyEmailOtpMutation();
  const [otpValue, setOtpValue] = useState("");
  const OTP_LENGTH = 6;
  const otpInputRef = useRef(null);
  const [otpSendFirst, setOtpSendFirst] = useState(false);

  useEffect(() => {
    if (!otpSendFirst) {
      sendOtpToEmail();
      setOtpSendFirst(true);
    }
  }, []);

  const sendOtpToEmail = async () => {
    console.log("Sending OTP to email:");

    const dataSendOtp = {
      email,
    };
    try {
      const res = await sendOtp({ data: dataSendOtp });
      console.log("OTP sent successfully:", res);
    } catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert("Lỗi", "Không thể gửi mã OTP. Vui lòng thử lại sau.");
    }
  };

  const handleOtpChange = (text) => {
    const newOtp = text.replace(/[^0-9]/g, "").slice(0, OTP_LENGTH);
    setOtpValue(newOtp);
  };

  const handleVerifyOtp = async () => {
    console.log("Đang gửi Verify:");
    setLoading(true);
    const verifyData = {
      email: email,
      otp: otpValue,
    };
    console.log(verifyData);

    try {
      const res = await verifyEmailOtp({ data: verifyData });
      console.log("OTP verified successfully:", res);
      setLoading(false);

      if (res?.error) {
        setLoading(false);
        const errorMessage =
          // res.error.data?.message ||
          "Mã OTP không chính xác hoặc đã hết hạn.";
        Alert.alert("Lỗi", errorMessage);
        return;
      }
      dispatch(
        loginSuccess({
          userId: id,
          token: token,
          userData: userData,
          isAuth: true,
        })
      );
      navigation.replace("MainTabs");
    } catch (error) {
      setLoading(false);
      console.error("Error verifying OTP:", error);
      Alert.alert("Lỗi", "Đã có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  const handleResendOtp = () => {
    sendOtpToEmail();
    setOtpValue("");
    Alert.alert("Thông báo", "Mã OTP mới đã được gửi đến email của bạn");
  };

  const renderOtpBoxes = () => {
    const boxes = [];
    for (let i = 0; i < OTP_LENGTH; i++) {
      boxes.push(
        <TouchableOpacity
          key={i}
          style={[styles.otpBox, otpValue[i] ? styles.otpBoxFilled : {}]}
          onPress={() => otpInputRef.current?.focus()}
        >
          <Text style={styles.otpBoxText}>{otpValue[i] || ""}</Text>
        </TouchableOpacity>
      );
    }
    return boxes;
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
                <Text style={styles.title}>Xác nhận mã OTP</Text>
                <Text style={styles.subtitle}>
                  Mã OTP đã được gửi đến email của bạn
                </Text>
              </View>
              <View style={styles.card}>
                <View style={styles.formContainer}>
                  <View style={styles.dot} />

                  {/* Ẩn TextInput thực tế và chỉ hiển thị UI tùy chỉnh */}
                  <View style={styles.otpContainer}>
                    <TextInput
                      ref={otpInputRef}
                      value={otpValue}
                      onChangeText={handleOtpChange}
                      keyboardType="numeric"
                      style={styles.hiddenInput}
                      maxLength={OTP_LENGTH}
                      autoFocus
                    />
                    {renderOtpBoxes()}
                  </View>

                  <CustomButton
                    title="Xác nhận mã OTP"
                    backgroundColor="#1A2741"
                    disabledBackgroundColor="rgba(26, 39, 65, 0.5)"
                    titleColor="#FFFFFF"
                    disabledTitleColor="#FFFFFF"
                    loading={loading}
                    disabled={otpValue.length !== OTP_LENGTH}
                    style={styles.loginButton}
                    onPress={handleVerifyOtp}
                  />
                  <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Chưa nhận được? </Text>
                    <TouchableOpacity onPress={handleResendOtp}>
                      <Text style={styles.signupButtonText}>Gửi lại</Text>
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
    paddingTop: 100,
    marginTop: 100,
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    paddingHorizontal: 12,
    position: "relative",
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    height: 0,
    width: "100%",
  },
  otpBox: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: "#F7F7F7",
    borderRadius: 12,
    backgroundColor: "#F7F7F7",
    alignItems: "center",
    justifyContent: "center",
  },
  otpBoxFilled: {
    borderColor: "#4E72E3",
    backgroundColor: "rgba(78, 114, 227, 0.1)",
  },
  otpBoxText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A2741",
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

export default OTPVerificationScreen;
