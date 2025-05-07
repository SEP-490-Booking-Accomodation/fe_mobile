import { useState } from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, StatusBar } from "react-native"
import { Ionicons, Feather } from "@expo/vector-icons"

export default function Ticket() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>E-Ticket</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Feather name="more-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.ticketContainer}>
        <Image source={{ uri: "https://via.placeholder.com/600x300" }} style={styles.ticketImage} />

        <View style={styles.ticketContent}>
          <Text style={styles.ticketSubtitle}>Local Rental Present</Text>
          <Text style={styles.ticketTitle}>Vũng Tàu Beach Resort</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>30/12/2024</Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Time</Text>
              <Text style={styles.infoValue}>12h</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Check In Type</Text>
              <Text style={styles.infoValue}>Phòng 1</Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Order ID</Text>
              <Text style={styles.infoValue}>NG1011163</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Number of Guests</Text>
              <Text style={styles.infoValue}>2</Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Password</Text>
              <View style={styles.passwordContainer}>
                <Text style={styles.infoValue}>{isPasswordVisible ? "1234ABC" : "••••••••"}</Text>
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                  <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              {!isPasswordVisible && <Text style={styles.passwordNote}>Password not available at this time</Text>}
            </View>
          </View>

          <View style={styles.placeContainer}>
            <Text style={styles.infoLabel}>Place</Text>
            <Text style={styles.placeValue}>Vũng Tàu Beach Resort, Bãi Sau, Vũng Tàu, Vietnam</Text>
          </View>

          <View style={styles.dashedLine} />

          <View style={styles.barcodeContainer}>
            {/* <Image source={require("./assets/barcode.png")} style={styles.barcode} resizeMode="contain" /> */}
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  ticketContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 20,
    backgroundColor: "#6c7ee1",
    overflow: "hidden",
  },
  ticketImage: {
    width: "100%",
    height: 200,
  },
  ticketContent: {
    padding: 20,
  },
  ticketSubtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.8,
  },
  ticketTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 25,
  },
  infoColumn: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.8,
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIcon: {
    marginLeft: 10,
  },
  passwordNote: {
    fontSize: 12,
    color: "#fff",
    opacity: 0.7,
    marginTop: 5,
  },
  placeContainer: {
    marginBottom: 25,
  },
  placeValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    lineHeight: 24,
  },
  dashedLine: {
    height: 1,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#fff",
    marginBottom: 25,
  },
  barcodeContainer: {
    alignItems: "center",
  },
  barcode: {
    width: "100%",
    height: 80,
  },
})
