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

const { height } = Dimensions.get("window");

const RegisterScreen = () => {
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
  const [register] = useRegisterMutation();

  const handleRegister = async () => {
    if (!fullName || !phone || !email || !password || !confirmPassword) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      alert("Số điện thoại không hợp lệ!");
      return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      alert("Email không hợp lệ!");
      return;
    }
    if (password.length < 8) {
      alert("Mật khẩu phải chứa ít nhất 8 ký tự!");
      return;
    }

    const ageDiff = new Date().getFullYear() - dob.getFullYear();
    if (
      ageDiff < 16 ||
      (ageDiff === 16 &&
        new Date() < new Date(dob.setFullYear(dob.getFullYear() + 16)))
    ) {
      alert("Bạn phải trên 16 tuổi để đăng ký!");
      return;
    }

    if (dob > new Date()) {
      alert("Ngày sinh không hợp lệ!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Mật khẩu và xác nhận mật khẩu không khớp!");
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
      console.log("Register response:", response);
      alert("Đăng ký thành công!");
      // navigation.navigate("Login");
    } catch (error) {
      console.log("Register error:", error);
      alert("Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const showDatepicker = () => {
    if (Platform.OS === 'ios') {
      setIsModalVisible(true);
    } else {
      setShowDatePicker(true);
    }
  };

  const onDateChange = (event, selectedDate) => {
    // For Android, hiding is automatic after selection
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
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
              <Text style={styles.title}>Đăng ký</Text>
              <Text style={styles.subtitle}>
                Bắt đầu hành trình của bạn: Đăng ký để khám phá
              </Text>
            </View>
            <View style={styles.card}>
              <View style={styles.formContainer}>
                {/* <View style={styles.dot} /> */}
                <CustomInput
                  label="Họ và tên"
                  placeholder="Nhập họ và tên"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={styles.input}
                />
                <CustomInput
                  label="Số điện thoại"
                  placeholder="Nhập số điện thoại"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={styles.input}
                />
                <CustomInput
                  label="Email"
                  placeholder="Nhập email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={styles.input}
                />
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Ngày sinh</Text>
                  <TouchableOpacity
                    style={[styles.input, styles.dateInput]}
                    onPress={showDatepicker}
                  >
                    <Text
                      style={dob ? styles.dateText : styles.placeholderText}
                    >
                      {dob ? formatDate(dob) : "Chọn ngày sinh"}
                    </Text>
                  </TouchableOpacity>
                </View>
                <CustomInput
                  label="Mật khẩu"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={styles.input}
                  passwordIconColor="#6B7280"
                />
                <CustomInput
                  label="Xác nhận mật khẩu"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={styles.input}
                  passwordIconColor="#6B7280"
                />
                <CustomButton
                  title="Đăng ký"
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
                  <Text style={styles.signupText}>Đã có tài khoản? </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Login")}
                  >
                    <Text style={styles.signupButtonText}>Đăng nhập</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      {/* DatePicker for Android */}
      {Platform.OS === 'android' && showDatePicker && (
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
              <Text style={styles.confirmButtonText}>Xác nhận</Text>
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
