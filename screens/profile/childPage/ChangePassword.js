import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { useState, useEffect } from "react";
import CustomInput from "../../../components/TextInput";
import CustomButton from "../../../components/buttons/Button";
import { useNavigation } from "@react-navigation/native";
import {useUpdatePasswordMutation} from "../../../api/profileApi";
import { useTranslation } from "react-i18next";

export default function ChangePassword({ route }) {
  const { t } = useTranslation(); 
  const navigation = useNavigation();

  // State for input values
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatePasswordApi] = useUpdatePasswordMutation();
  // State for error messages
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handlePasswordChange = async () => {
    try {
     const response = await updatePasswordApi({updatedPassword: {currentPassword, newPassword}});
     console.log("Change password response:", response);
     if (response.data) {
      Alert.alert(t('success'), t('password_change_success'));
       navigation.goBack();
     }
     else {
      Alert.alert(t('failure'), response.error?.data?.message);
     }
    } catch (error) {
      console.error("Error changing password:", error); 
      alert(t('unexpected_error'));
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.arrowBack} onPress={() => navigation.goBack()}>
        <AntDesign name="left" size={24} color="#4E72E3" />
      </TouchableOpacity>
      <Text style={styles.textHeader}>{t('change_password')}</Text>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <AntDesign name="left" size={24} color="#4E72E3" />
      </TouchableOpacity>
      <CustomButton style={{ width: "85%" }} title={t('update')} onPress={handlePasswordChange} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <View style={styles.contentWrapper}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoiding}>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.infoContainer}>
              {/* Current Password */}
              <Text style={styles.label}>{t('current_password')}</Text>
              <CustomInput
                placeholder="****************"
                value={currentPassword}
                onChangeText={(text) => {
                  setCurrentPassword(text);
                  setCurrentPasswordError(""); // Clear error when typing
                }}
                secureTextEntry
              />
              {currentPasswordError ? <Text style={styles.errorText}>{currentPasswordError}</Text> : null}

              <View style={styles.spacing} />

              {/* New Password */}
              <Text style={styles.label}>{t('new_password')}</Text>
              <CustomInput
                placeholder="****************"
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  setNewPasswordError(""); // Clear error when typing
                }}
                secureTextEntry
              />
              {newPasswordError ? <Text style={styles.errorText}>{newPasswordError}</Text> : null}

              <View style={styles.spacing} />

              {/* Confirm New Password */}
              <Text style={styles.label}>{t('confirm_password')}</Text>
              <CustomInput
                placeholder="****************"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setConfirmPasswordError(""); // Clear error when typing
                }}
                secureTextEntry
              />
              {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
              
              <View style={styles.spacing} />
            </View>
            //TODO:  Chỗ này sau khi tắt bottom tab thì sễ để dưới dạng bottom bar ở dưới như header đang style hiện tại
            <CustomButton title={t('update')} onPress={handlePasswordChange} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      {renderFooter()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentWrapper: {
    flex: 1,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 1.32,
    elevation: 5,
  },
  textHeader: {
    fontSize: 20,
    fontWeight: "600",
    paddingHorizontal: 10,
  },
  content: {
    flexGrow: 1,
    padding: 24,
  },
  infoContainer: {},
  spacing: {
    padding: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    paddingVertical: 8,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    width: "100%",
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: "#4E72E3",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
});
