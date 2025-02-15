import { useState, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image, SafeAreaView, Dimensions } from "react-native"

const { width } = Dimensions.get("window")
const cardWidth = width * 0.9

const PaymentSuccess = ({ route, navigation }) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const animatedValue = useRef(new Animated.Value(0)).current

  const { amount, roomName, location, date, time, guests, idNumber } = route.params || {}

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  })

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  })

  const frontOpacity = animatedValue.interpolate({
    inputRange: [0, 90, 180],
    outputRange: [1, 0, 0],
  })

  const backOpacity = animatedValue.interpolate({
    inputRange: [0, 90, 180],
    outputRange: [0, 0, 1],
  })

  const flipCard = () => {
    Animated.timing(animatedValue, {
      toValue: isFlipped ? 0 : 180,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      setIsFlipped(!isFlipped)
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.navigate("MainTabs")}>
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>

      <View style={styles.mainContainer}>
        {/* Main Flipping Card */}
        <View style={styles.cardContainer}>
          <Animated.View
            style={[
              styles.card,
              {
                transform: [{ rotateY: frontInterpolate }],
                opacity: frontOpacity,
              },
            ]}
          >
            <View style={styles.cardContent}>
              <View style={styles.successIcon}>
                <Text style={styles.checkmark}>✓</Text>
                <View style={styles.sparkle1} />
                <View style={styles.sparkle2} />
                <View style={styles.sparkle3} />
              </View>
              <Text style={styles.title}>Thanh toán thành công</Text>
              <Text style={styles.subtitle}>Chúng tôi vừa gửi số tiền của bạn cho</Text>

              <View style={styles.roomInfo}>
                <Image
                  source={{
                    uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XyZwas29F5FNrFYW7V40QZNIY0lxSP.png",
                  }}
                  style={styles.roomImage}
                />
                <View style={styles.roomDetails}>
                  <Text style={styles.roomName}>Phòng 1</Text>
                  <View style={styles.locationContainer}>
                    <Text style={styles.location}>📍 Vũng Tàu</Text>
                  </View>
                </View>
              </View>

              <View style={styles.amountSection}>
                <Text style={styles.amountLabel}>Số tiền chuyển khoản</Text>
                <Text style={styles.amount}>550.000đ</Text>
              </View>

              <Text style={styles.timestamp}>30/12/2024 — 9.41 am</Text>

              <TouchableOpacity style={styles.detailButton} onPress={flipCard}>
                <Text style={styles.detailButtonText}>Xem chi tiết</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.leftNotch} />
            <View style={styles.rightNotch} />
          </Animated.View>

          <Animated.View
            style={[
              styles.card,
              {
                transform: [{ rotateY: backInterpolate }],
                opacity: backOpacity,
              },
            ]}
          >
            <View style={styles.cardContent}>
              <View style={styles.roomInfoBack}>
                <Image
                  source={{
                    uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XyZwas29F5FNrFYW7V40QZNIY0lxSP.png",
                  }}
                  style={styles.roomImageBack}
                />
                <View style={styles.roomDetailsBack}>
                  <Text style={styles.roomNameBack}>Phòng 1</Text>
                  <View style={styles.locationContainerBack}>
                    <Text style={styles.locationBack}>📍 Vũng Tàu</Text>
                  </View>
                </View>
              </View>

              <View style={styles.detailGrid}>
                <View style={styles.detailColumn}>
                  <Text style={styles.detailLabel}>Ngày</Text>
                  <Text style={styles.detailValue}>30.12.24</Text>
                </View>
                <View style={styles.detailColumn}>
                  <Text style={styles.detailLabel}>Số người</Text>
                  <Text style={styles.detailValue}>2</Text>
                </View>
                <View style={styles.detailColumn}>
                  <Text style={styles.detailLabel}>Giờ</Text>
                  <Text style={styles.detailValue}>12h</Text>
                </View>
                <View style={styles.detailColumn}>
                  <Text style={styles.detailLabel}>ID Number</Text>
                  <Text style={styles.detailValue}>NG1011163</Text>
                </View>
              </View>

              <View style={styles.barcodeSection}>
                {/* Add barcode component here */}
                <View style={styles.barcodePlaceholder} />
              </View>

              <TouchableOpacity style={styles.detailButton} onPress={flipCard}>
                <Text style={styles.detailButtonText}>Quay lại</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.leftNotch} />
            <View style={styles.rightNotch} />
          </Animated.View>
        </View>

        {/* Separate Bottom Card */}
        <View style={styles.bottomCard}>
          <View style={styles.bottomCardContent}>
            <View style={styles.customerInfo}>
              <Text style={styles.customerLabel}>Họ tên</Text>
              <Text style={styles.customerName}>Zane Pham</Text>
              <Text style={styles.totalLabel}>Tổng</Text>
              <Text style={styles.totalAmount}>550.000đ</Text>
            </View>
            <View style={styles.qrCode}>
              {/* Add QR code component here */}
              <View style={styles.qrPlaceholder} />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7B96EC",
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
    zIndex: 1,
  },
  closeButtonText: {
    color: "white",
    fontSize: 24,
  },
  cardContainer: {
    width: cardWidth,
    height: 500, // Fixed height for main card
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    backfaceVisibility: "hidden",
  },
  cardContent: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  leftNotch: {
    position: "absolute",
    left: -15,
    top: "50%",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#7B96EC",
    transform: [{ translateY: -15 }],
  },
  rightNotch: {
    position: "absolute",
    right: -15,
    top: "50%",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#7B96EC",
    transform: [{ translateY: -15 }],
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  sparkle1: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 15,
    height: 15,
    backgroundColor: "#FFD700",
    borderRadius: 7.5,
  },
  sparkle2: {
    position: "absolute",
    top: 10,
    right: -10,
    width: 10,
    height: 10,
    backgroundColor: "#FFD700",
    borderRadius: 5,
  },
  sparkle3: {
    position: "absolute",
    top: -10,
    right: 10,
    width: 12,
    height: 12,
    backgroundColor: "#FFD700",
    borderRadius: 6,
  },
  checkmark: {
    color: "white",
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1A2138",
  },
  subtitle: {
    color: "#666",
    marginBottom: 20,
    fontSize: 16,
  },
  roomInfo: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 10,
  },
  roomImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  roomDetails: {
    flex: 1,
  },
  roomName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A2138",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  location: {
    color: "#666",
    fontSize: 14,
  },
  amountSection: {
    width: "100%",
    alignItems: "center",
    marginVertical: 20,
  },
  amountLabel: {
    color: "#666",
    marginBottom: 5,
    fontSize: 16,
  },
  amount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1A2138",
  },
  timestamp: {
    color: "#666",
    marginBottom: 20,
    fontSize: 14,
  },
  detailButton: {
    backgroundColor: "#1A2138",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  detailButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  // Back card styles
  roomInfoBack: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 30,
  },
  roomImageBack: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 10,
  },
  roomDetailsBack: {
    flex: 1,
  },
  roomNameBack: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A2138",
  },
  locationContainerBack: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  locationBack: {
    color: "#666",
    fontSize: 14,
  },
  detailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
  },
  detailColumn: {
    width: "48%",
    marginBottom: 20,
  },
  detailLabel: {
    color: "#666",
    fontSize: 14,
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A2138",
  },
  barcodeSection: {
    width: "100%",
    height: 80,
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  barcodePlaceholder: {
    width: "100%",
    height: 80,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
  },
  // Bottom card styles
  bottomCard: {
    width: cardWidth,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
  },
  bottomCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  customerInfo: {
    flex: 1,
  },
  customerLabel: {
    color: "#666",
    fontSize: 14,
    marginBottom: 5,
  },
  customerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A2138",
    marginBottom: 15,
  },
  totalLabel: {
    color: "#666",
    fontSize: 14,
    marginBottom: 5,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A2138",
  },
  qrCode: {
    width: 100,
    height: 100,
    marginLeft: 20,
  },
  qrPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
  },
})

export default PaymentSuccess

