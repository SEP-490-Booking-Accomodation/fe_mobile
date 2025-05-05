import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "../../../components/buttons/Button";
import CustomInput from "../../../components/TextInput";
import { useUpdateUserMutation } from "../../../api/profileApi";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";


const AvatarUpload = ({ currentImage, onImageChange }) => {
  const { t } = useTranslation();
  const pickImage = async () => {
    try {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert(t('permission_required'));
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        onImageChange(result.assets[0].uri);
      }
    } catch (error) {
      alert(t('general_error'));
    }
  };

  return (
    <View style={styles.avatarContainer}>
      <TouchableOpacity onPress={pickImage}>
        <View style={styles.avatarWrapper}>
          {currentImage ? (
            <Image source={{ uri: currentImage }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholder]} />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default function EditInfo({ route, navigation }) {
  const { t } = useTranslation();
  const userId = useSelector((state) => state.auth.userId);
  const [updateUserApi] = useUpdateUserMutation();

  const [dataUser, setDataUser] = useState(route.params?.data);
  const [image, setImage] = useState(dataUser?.userId?.avatarUrl[0] || "");
  const [fullName, setFullName] = useState(dataUser?.userId?.fullName || "");
  const [email, setEmail] = useState(dataUser?.userId?.email || "");
  const [phone, setPhone] = useState(dataUser?.userId?.phone || "");
  const [isButtonSaveActive, setIsButtonSaveActive] = useState(false);

  console.log(image);
  useEffect(() => {
    if (
      email.trim() !== (dataUser?.userId?.email || "") ||
      fullName.trim() !== (dataUser?.userId?.fullName || "") ||
      phone.trim() !== (dataUser?.userId?.phone || "") ||
      image !== (dataUser?.userId?.avatarUrl || "")
    ) {
      setIsButtonSaveActive(true);
    } else {
      setIsButtonSaveActive(false);
    }
  }, [email, fullName, phone, image, dataUser]);

  const handleImageChange = (newImageUri) => {
    setImage(newImageUri);
    setIsButtonSaveActive(true);
  };

  const handleUpdateInfo = async () => {
    if (!userId) {
      console.error("User ID is missing!");
      return;
    }

    try {
      await updateUserApi({
        id: userId,
        updatedUser: { fullName, email, phone, avatarUrl: image },
      }).unwrap();

      console.log(t('update_success'));
      setIsButtonSaveActive(false);
      navigation.navigate("ProfileScreen");
    } catch (error) {
      alert(t('general_error'));
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={24} color="#4E72E3" />
      </TouchableOpacity>
      <Text style={styles.textHeader}>{t('edit_profile')}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageContainer}>
          <AvatarUpload currentImage={image} onImageChange={handleImageChange} />
        </View>
        <View style={styles.infoContainer}>
        <Text style={styles.label}>{t('full_name')}</Text>
          <CustomInput value={fullName} onChangeText={setFullName} />
          <View style={styles.spacing} />
          <Text style={styles.label}>{t('email')}</Text>
          <CustomInput value={email} onChangeText={setEmail} />
          <View style={styles.spacing} />
          <Text style={styles.label}>{t('phone_number')}</Text>
          <CustomInput value={phone} onChangeText={setPhone} />
        </View>
        //TODO:  Chỗ này sau khi tắt bottom tab thì sễ để dưới dạng bottom bar ở dưới như header đang style hiện tại
        <CustomButton
          title={t('update_info')}
          disabled={!isButtonSaveActive}
          onPress={handleUpdateInfo}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 1.32,
    elevation: 5,
  },
  textHeader: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 10,
  },
  content: {
    padding: 24,
  },
  avatarContainer: {
    alignItems: "center",
  },
  avatarWrapper: {
    borderRadius: 75,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#4E72E3",
  },
  avatar: {
    width: 150,
    height: 150,
  },
  placeholder: {
    backgroundColor: "#E1E1E1",
  },
  imageContainer: {
    padding: 24,
  },
  infoContainer: {
    paddingBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    paddingVertical: 8,
  },
  spacing: {
    padding: 4,
  },
});
