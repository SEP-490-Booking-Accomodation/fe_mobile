import React, { useState } from "react";
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
import { ArrowLeft } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "../../../components/buttons/Button";
import CustomInput from "../../../components/TextInput";
const AvatarUpload = ({ currentImage, onImageChange }) => {
  const pickImage = async () => {
    console.log('pickImage function called');

    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
          return;
        }
      }

      console.log('Launching image picker');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      console.log('Image picker result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log('New image selected:', result.assets[0].uri);
        onImageChange(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('An error occurred while picking the image. Please try again.');
    }
  };

  return (
    <View style={styles.avatarContainer}>
      <TouchableOpacity onPress={() => setTimeout(pickImage, 100)}>
        <View style={styles.avatarWrapper}>
          {currentImage ? (
            <Image 
              source={{ uri: currentImage }} 
              style={styles.avatar} 
              onError={(e) => console.log('Error loading image:', e.nativeEvent.error)}
            />
          ) : (
            <View style={[styles.avatar, styles.placeholder]} />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default function EditInfo({ route, navigation }) {
  const [dataUser, setDataUser] = useState(route.params.datainfo);

  const handleImageChange = (newImageUri) => {
    setDataUser((prevData) => {
      const newData = {
        ...prevData,
        imgUrl: newImageUri,
      };

      return newData;
    });
    // Here you can also call an API to update the image on your server
    // updateUserImageOnServer(newImageUri);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.arrowBack}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={24} color="#4E72E3" />
      </TouchableOpacity>
      <Text style={styles.textHeader}>Chỉnh sửa hồ sơ</Text>
    </View>
  );
  const renderFooter = () => (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <ArrowLeft size={24} color="#4E72E3" />
      </TouchableOpacity>
      <CustomButton
        style={{ width: "85%" }}
        title="Cập nhật"
        onPress={() => navigation.navigate("ProfileScreen")}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageContainer}>
          <AvatarUpload
            currentImage={dataUser.imgUrl}
            onImageChange={handleImageChange}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Họ tên</Text>
          <CustomInput placeholder={dataUser.name}></CustomInput>
          <View style={styles.spacing}/>
          <Text style={styles.label}>Email</Text>
          <CustomInput placeholder={dataUser.email}></CustomInput>
          <View style={styles.spacing}/>
          <Text style={styles.label}>Số điện thoại</Text>
          <View style={styles.spacing}/>
          <CustomInput placeholder={dataUser.phone}></CustomInput>
        </View>
      </ScrollView>
      {renderFooter()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  arrowBack: {
    marginRight: 10,
    color: "#4E72E3",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.32,
    elevation: 5,
  },
  textHeader: {
    fontSize: 20,
    fontWeight: "600",
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
  infoContainer: {},
  label: {
    fontSize: 16,
    fontWeight: 500,
    paddingVertical: 8,
  },
  footer: {
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
  spacing: {
    padding:8
  }
});
