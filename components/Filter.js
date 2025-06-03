import { useState, useRef, useEffect, useMemo } from "react"
import { View, Text, StyleSheet, Modal, TouchableOpacity, PanResponder, Animated, Dimensions } from "react-native"
import MultiSlider from "@ptomasroos/react-native-multi-slider"
import ButtonGroup from "../components/buttons/ButtonGroup"
import CustomButton from "../components/buttons/Button"
import { useTranslation } from "react-i18next"
import { FontAwesome5 } from "@expo/vector-icons"
import AmenitiesModal from "./modals/AmenitiesModal"

const Filter = ({ visible, onClose, onApply, rentalLocations = [] }) => {
  const { t } = useTranslation()
  const [priceRange, setPriceRange] = useState([100000, 100000000])
  const [selectedRating, setSelectedRating] = useState(null)
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [isAmenitiesModalVisible, setIsAmenitiesModalVisible] = useState(false)
  const screenWidth = Dimensions.get("window").width
  const sliderWidth = screenWidth - 40

  const [minMaxPrices, setMinMaxPrices] = useState({
    min: 0,
    max: 10000,
  })

  const ratingRanges = [
    { min: 0, max: 1, label: "0-1" },
    { min: 1, max: 2, label: "1-2" },
    { min: 2, max: 3, label: "2-3" },
    { min: 3, max: 4, label: "3-4" },
    { min: 4, max: 5, label: "4-5" }
  ]

  const uniqueServiceNames = useMemo(() => {
    const allServices = rentalLocations
      .filter(rental => rental.status === 3) 
      .reduce((services, rental) => {
        if (rental.accommodationTypeIds && Array.isArray(rental.accommodationTypeIds)) {
          rental.accommodationTypeIds.forEach(type => {
            if (type.serviceIds && Array.isArray(type.serviceIds)) {
              type.serviceIds.forEach(service => {
                if (service.name) {
                  services.add(service.name);
                }
              });
            }
          });
        }
        return services;
      }, new Set());
    
    return Array.from(allServices);
  }, [rentalLocations]);

  useEffect(() => {
    if (rentalLocations?.length > 0) {
      let validMinPrices = []
      let validMaxPrices = []

      rentalLocations.forEach((rental) => {
        const min = typeof rental.minPrice === 'number' 
          ? rental.minPrice 
          : Number.parseFloat(rental.minPrice) || 0
        
        const max = typeof rental.maxPrice === 'number' 
          ? rental.maxPrice 
          : Number.parseFloat(rental.maxPrice) || 0

        if (!isNaN(min) && min >= 0) validMinPrices.push(min)
        if (!isNaN(max) && max >= 0) validMaxPrices.push(max)
      })

      const calculatedMin = validMinPrices.length > 0 
        ? Math.min(...validMinPrices) 
        : 0
        
      const calculatedMax = validMaxPrices.length > 0 
        ? Math.max(...validMaxPrices) 
        : 10000 

      const finalMax = calculatedMax > calculatedMin 
        ? calculatedMax 
        : calculatedMin + 10000

      setMinMaxPrices({
        min: calculatedMin,
        max: finalMax,
      })
      setPriceRange([calculatedMin, finalMax])
    }
  }, [rentalLocations])

  const translateY = useRef(new Animated.Value(0)).current

  const handleReset = () => {
    setPriceRange([minMaxPrices.min, minMaxPrices.max])
    setSelectedRating(null)
    setSelectedAmenities([])
  }

  const handleApply = () => {
    onApply({
      priceRange,
      selectedRating,
      selectedAmenities,
    })
    onClose()
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy)
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dy > 100) {
          onClose()
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start()
        }
      },
    }),
  ).current

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalBackground}>
        <Animated.View style={[styles.container, { transform: [{ translateY }] }]} {...panResponder.panHandlers}>
          <View style={styles.dot} />
          <View style={styles.header}>
            <Text style={styles.headerText}>{t("advanced_filter")}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>{t("cancel")}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("price")}</Text>
            <View style={styles.line} />
            <View style={styles.priceContainer}>
              <View style={styles.priceRangeLabels}>
                <View>
                  <Text style={styles.priceRangeTitle}>{t("min")}</Text>
                  <View style={styles.priceBox}>
                    <Text style={styles.priceText}>
                      {priceRange[0].toLocaleString()} {t("currency")}
                    </Text>
                  </View>
                </View>
                <Text style={styles.priceSeparator}>-</Text>
                <View>
                  <Text style={styles.priceRangeTitle}>{t("max")}</Text>
                  <View style={styles.priceBox}>
                    <Text style={styles.priceText}>
                      {priceRange[1].toLocaleString()} {t("currency")}
                    </Text>
                  </View>
                </View>
              </View>
              <MultiSlider
                values={priceRange}
                onValuesChange={setPriceRange}
                min={minMaxPrices.min}
                max={Math.max(minMaxPrices.max, minMaxPrices.min + 10000)}
                step={1000}
                allowOverlap={false}
                snapped
                selectedStyle={{
                  backgroundColor: "#4E72E3",
                  height: 2,
                }}
                unselectedStyle={{
                  backgroundColor: "#E5E7EB",
                  height: 2,
                }}
                containerStyle={{
                  height: 40,
                }}
                markerStyle={{
                  height: 24,
                  width: 24,
                  borderRadius: 12,
                  backgroundColor: "#fff",
                }}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("rating")}</Text>
            <View style={styles.line} />
            <ButtonGroup
              items={ratingRanges.map(range => `${range.label} ${t("star")}`)}
              selectedIndex={selectedRating}
              onChange={setSelectedRating}
              containerStyle={styles.buttonGroupContainer}
              buttonStyle={styles.buttonGroupButton}
              activeButtonStyle={styles.activeButton}
              inactiveButtonStyle={styles.inactiveButton}
              textStyle={styles.text}
              activeTextStyle={styles.activeText}
              inactiveTextStyle={styles.inactiveText}
              spacing={10}
              borderRadius={5}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("amenities")}</Text>
            <View style={styles.line} />
            <TouchableOpacity 
              style={styles.amenitiesButton}
              onPress={() => setIsAmenitiesModalVisible(true)}
            >
              <Text style={styles.amenitiesButtonText}>
                {selectedAmenities.length > 0 
                  ? `${selectedAmenities.length} ${t("amenities_selected")}`
                  : t("select_amenities")}
              </Text>
              <FontAwesome5 name="chevron-right" size={16} color="#98A0B4" />
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              title={t("reset")}
              onPress={handleReset}
              backgroundColor="#E5E7EB"
              titleColor="#101828"
              style={styles.resetButton}
            />
            <CustomButton
              title={t("apply")}
              onPress={handleApply}
              backgroundColor="#1A2741"
              titleColor="#FFF"
              style={styles.applyButton}
            />
          </View>
        </Animated.View>
      </View>

      <AmenitiesModal
        visible={isAmenitiesModalVisible}
        onClose={() => setIsAmenitiesModalVisible(false)}
        amenities={uniqueServiceNames}
        selectedAmenities={selectedAmenities}
        onSelectAmenity={setSelectedAmenities}
      />
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  dot: {
    width: 48,
    height: 6,
    borderRadius: 4,
    backgroundColor: "#EBEBEB",
    alignSelf: "center",
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111827",
  },
  closeText: {
    fontSize: 16,
    color: "#4E72E3",
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#98A0B4",
    marginBottom: 10,
  },
  sliderContainer: {
    paddingVertical: 20,
  },
  priceContainer: {
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: "center",
  },
  priceRangeLabels: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 20,
    width: "100%",
  },
  priceRangeTitle: {
    fontSize: 14,
    color: "#98A0B4",
    marginBottom: 8,
    fontWeight: "500",
    textAlign: "center",
  },
  priceBox: {
    backgroundColor: "#F9FAFB",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 140,
  },
  priceText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
    textAlign: "center",
  },
  priceSeparator: {
    fontSize: 16,
    color: "#98A0B4",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  buttonGroupContainer: {
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  buttonGroupButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderWidth: 1,
  },
  activeButton: {
    backgroundColor: "#4E72E3",
    borderColor: "transparent",
  },
  inactiveButton: {
    backgroundColor: "#F6F6F6",
    borderColor: "#F6F6F6",
  },
  text: {
    fontSize: 15,
    fontWeight: "500",
  },
  activeText: {
    color: "#FFFFFF",
  },
  inactiveText: {
    color: "#4E72E3",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resetButton: {
    flex: 1,
    marginRight: 10,
  },
  applyButton: {
    flex: 1,
  },
  line: {
    height: 1,
    width: Dimensions.get("window").width - 40,
    backgroundColor: "#F3F3F3",
    marginVertical: 10,
  },
  amenitiesButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  amenitiesButtonText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
})

export default Filter
