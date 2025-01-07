import React, { useEffect, useState, useRef } from "react";
import { View, Text, ImageBackground, StyleSheet, Dimensions, TouchableOpacity, Image } from "react-native";
import Swiper from "react-native-swiper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const slides = [
  { image: require("../assets/images/mountain.jpg") },
  { image: require("../assets/images/lake.jpg") },
  { image: require("../assets/images/beach.jpg") },
];
const OnboardingScreen = ({ navigation }) => {
  const swiperRef = useRef(null);
  const [index, setIndex] = useState(0);

  const handleBack = () => {
    if (swiperRef.current && index > 0) {
      swiperRef.current.scrollBy(-1);
    }
  };
  const handleDone = () => {
    navigation.replace("Login");
  };

  return (
    <Swiper
      loop={false}
      showsPagination={false}
      ref={swiperRef}
      onIndexChanged={(i) => setIndex(i)}
    >
      {slides.map((slide, index) => (
        <ImageBackground key={index} source={slide.image} style={styles.background}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Hãy bắt đầu hành{"\n"}trình của bạn</Text>
            <Text style={styles.subtitle}>
              Chúng tôi sẵn sàng giúp bạn lên kế hoạch{"\n"}cho kỳ nghỉ của mình.
            </Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.paginationContainer}>
              <View style={[styles.dot, index === 0 && styles.activeDot]} />
              <View style={[styles.dot, index === 1 && styles.activeDot]} />
              <View style={[styles.dot, index === 2 && styles.activeDot]} />
            </View>
            <View style={styles.navigationButtons}>
              {index > 0 && (
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                  <Image
                    source={require("../assets/icons/back.png")}
                    style={styles.navIcon}
                  />
                </TouchableOpacity>
              )}
              {index === slides.length - 1 && (
                <TouchableOpacity onPress={handleDone}>
                  <Image
                    source={require("../assets/icons/check.png")}
                    style={styles.navIcon}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ImageBackground>
      ))}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,
    height: height,
  },
  contentContainer: {
    paddingHorizontal: 24,
    marginTop: 110,
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 12,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 22,
    opacity: 0.8,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeDot: {
    width: 20,
    backgroundColor: '#fff',
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  navIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  }
});

export default OnboardingScreen;