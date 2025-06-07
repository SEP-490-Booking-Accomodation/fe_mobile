import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import MapWithPopup from "../../components/MapWithPopup";
import CustomButton from "../../components/buttons/Button";
import Tag from "../../components/Tag";
import ImageViewing from "react-native-image-viewing";
import MultipleButtonNoSelect from "../../components/buttons/MultipleButtonNoSelect";
import { useGetAccommodationTypeByIdQuery } from "../../api/accommodationTypeApi";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RefreshControl } from "react-native";

const AccomodationDetailScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { accommodationTypeId, rentalData, rentalName } = route.params;
  const authData = useSelector((state) => state.auth);
  const userId = authData.userId;
  const [refreshing, setRefreshing] = useState(false);

  const formatPrice = (value) => {
    return value.toLocaleString("vi-VN");
  };

  const { data, isLoading, isError, refetch } =
    useGetAccommodationTypeByIdQuery(accommodationTypeId);

  const [activeTab, setActiveTab] = useState(0);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentImageSet, setCurrentImageSet] = useState([]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4E72E3" />
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !data?.data) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text>Error loading accommodation data</Text>
          <CustomButton
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const accommodationType = data.data;
  const rentalLocation = accommodationType.rentalLocationId || {};

  const allServices =
    accommodationType.serviceIds?.map((service) => service.name) || [];

  const accommodationTypeData = {
    id: accommodationType._id,
    name: accommodationType.name,
    location: rentalName || t("unknown_location"),
    price: accommodationType.basePrice,
    overtimePrice: accommodationType.overtimeHourlyPrice,
    priceUnit: "h",
    images:
      accommodationType.image?.length > 0
        ? accommodationType.image.map((img, index) => ({
            id: `img-${index}`,
            source: { uri: img },
          }))
        : [
            {
              id: "default-img",
              source: require("../../assets/images/banner.png"),
            },
          ],
    amenities: allServices || [],
    description: accommodationType.description || t("no_description"),
    maxPeople: accommodationType.maxPeopleNumber,
  };

  const handleBookNow = (accommodationType) => {
    if (!userId) {
      Alert.alert(t("not_logged_in_title"), t("not_logged_in_message"), [
        {
          text: t("later"),
        },
        {
          text: t("login"),
          onPress: () => navigation.navigate("Auth"),
        },
      ]);
      return;
    }
    navigation.navigate("BookingInformation", {
      accommodationTypeData: data,
      rentalData: rentalData,
    });
  };

  const openGalleryModal = (index) => {
    const imageSet = accommodationTypeData.images
      .map((img) => ({
        uri: img?.source?.uri || img.source,
      }))
      .filter((img) => img.uri);
    setCurrentImageSet(imageSet);
    setSelectedImageIndex(index);
    setImageModalVisible(true);
  };

  const openSingleImageModal = (image) => {
    if (!image) return;
    setCurrentImageSet([{ uri: image.uri || image }]);
    setSelectedImageIndex(0);
    setImageModalVisible(true);
  };

  const handleMoreOptions = () => {
    Alert.alert(t("more_options"), t("choose_action"), [
      { text: t("share"), onPress: () => console.log("Share pressed") },
      { text: t("report"), onPress: () => console.log("Report pressed") },
      { text: t("cancel"), style: "cancel" },
    ]);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <AntDesign name="left" size={24} color="#4E72E3" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleMoreOptions}>
        <MaterialIcons name="more-vert" size={24} color="#4E72E3" />
      </TouchableOpacity>
    </View>
  );

  const renderMainInfo = () => (
    <View style={styles.mainInfo}>
      <TouchableOpacity
        onPress={() =>
          openSingleImageModal(accommodationTypeData.images[0].source)
        }
      >
        <Image
          source={
            typeof accommodationTypeData.images[0].source === "string"
              ? { uri: accommodationTypeData.images[0].source }
              : accommodationTypeData.images[0].source
          }
          style={styles.mainImage}
        />
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <View style={styles.accommodationTypeHeader}>
          <Text style={styles.accommodationTypeName}>
            {accommodationTypeData.name}
          </Text>
          <Tag
            text={accommodationTypeData.location}
            backgroundColor="#E8EDFB"
            textColor="#4e72e3"
          />
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{`${formatPrice(
            accommodationTypeData.price
          )}đ/${accommodationTypeData.priceUnit}`}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="access-time" size={20} color="#4e72e3" />
          <Text style={styles.detailText}>
            {t("overtime_price")}:{" "}
            {formatPrice(accommodationTypeData.overtimePrice)} {t("per_hour")}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="people" size={20} color="#4e72e3" />
          <Text style={styles.detailText}>
            {t("max_people")}: {accommodationTypeData.maxPeople}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderAmenities = () => (
    <View style={styles.amenitiesContainer}>
      <Text style={styles.sectionTitle}>{t("amenities")}</Text>
      {accommodationTypeData.amenities.length > 0 ? (
        <MultipleButtonNoSelect
          items={accommodationTypeData.amenities}
          containerStyle={styles.amenitiesContainer}
          buttonStyle={styles.amenityButton}
          textStyle={styles.amenityText}
          spacing={8}
          borderRadius={20}
        />
      ) : (
        <Text style={styles.noAmenitiesText}>{t("no_amenities")}</Text>
      )}
    </View>
  );

  const renderTabs = () => {
    const tabs = [t("details"), t("photos")];
    return (
      <View style={styles.tabContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, activeTab === index && styles.activeTab]}
            onPress={() => setActiveTab(index)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === index && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderPhotos = () => {
    if (accommodationTypeData.images.length === 0) {
      return (
        <View style={styles.noPhotosContainer}>
          <Text style={styles.noPhotosText}>{t("no_photos")}</Text>
        </View>
      );
    }

    const numColumns = 3;
    const spacing = 8;
    const screenWidth = Dimensions.get("window").width;
    const contentPadding = 16;
    const totalSpacing = (numColumns - 1) * spacing;
    const totalPadding = contentPadding * 2;
    const imageWidth = (screenWidth - totalSpacing - totalPadding) / numColumns;

    const rows = [];
    for (let i = 0; i < accommodationTypeData.images.length; i += numColumns) {
      const rowItems = accommodationTypeData.images.slice(i, i + numColumns);
      rows.push(
        <View key={`row-${i}`} style={styles.photoRow}>
          {rowItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => openGalleryModal(i + index)}
              style={[
                styles.imageWrapper,
                {
                  marginRight: index === rowItems.length - 1 ? 0 : spacing,
                },
              ]}
            >
              <Image
                source={
                  typeof item.source === "string"
                    ? { uri: item.source }
                    : item.source
                }
                style={[
                  styles.gridImage,
                  { width: imageWidth, height: imageWidth },
                ]}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      );
    }

    return <View style={styles.photosContainer}>{rows}</View>;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <View>
            <Text style={styles.descriptionText}>
              {accommodationTypeData.description}
            </Text>
            {renderAmenities()}
          </View>
        );
      case 1:
        return renderPhotos();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderMainInfo()}
        {renderTabs()}
        {renderContent()}
      </ScrollView>
      <View style={styles.footer}>
        <CustomButton
          onPress={() => handleBookNow(accommodationTypeData)}
          title={t("book_now")}
          style={styles.bookButton}
          backgroundColor="#101828"
          disabled={
            rentalData.data?.status === 4 || rentalData.data?.status === 5
          }
        />
      </View>
      <ImageViewing
        images={currentImageSet}
        imageIndex={selectedImageIndex}
        visible={isImageModalVisible}
        onRequestClose={() => setImageModalVisible(false)}
        keyExtractor={(_, index) => `modal-image-${index}`}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    marginTop: 20,
    width: 120,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  mainImage: {
    width: "100%",
    height: 200,
    borderRadius: 20,
  },
  mainInfo: {
    padding: 16,
  },
  content: {
    flex: 1,
  },
  infoContainer: {
    marginTop: 16,
  },
  accommodationTypeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  accommodationTypeName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  locationText: {
    marginLeft: 4,
    color: "#666",
  },
  priceContainer: {
    marginTop: 8,
  },
  priceText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4e72e3",
  },
  amenitiesContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  noAmenitiesText: {
    color: "#666",
    fontStyle: "italic",
  },
  descriptionText: {
    padding: 16,
    color: "#666",
    lineHeight: 22,
  },
  locationSection: {
    padding: 16,
  },
  tabContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#4e72e3",
  },
  tabText: {
    color: "#666",
  },
  activeTabText: {
    color: "#4e72e3",
    fontWeight: "600",
  },
  photosContainer: {
    padding: 16,
  },
  photoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  noPhotosContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  noPhotosText: {
    color: "#666",
    fontStyle: "italic",
  },
  imageWrapper: {
    overflow: "hidden",
  },
  gridImage: {
    borderRadius: 8,
  },
  footer: {
    padding: 14,
    backgroundColor: "#f8f9fa",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  bookButton: {
    width: "100%",
  },
  amenityButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  amenityText: {
    color: "#374151",
    fontSize: 14,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  detailText: {
    marginLeft: 8,
    color: "#555",
  },
});

export default AccomodationDetailScreen;
