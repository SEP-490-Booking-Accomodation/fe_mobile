import { Button, StyleSheet } from "react-native";
import { Text, View } from "react-native";

export function CheckLocation({ location, address, errorMsg, onRefresh }) {
  return (
    <View style={styles.content}>
      <Text style={styles.title}>Vị trí hiện tại của bạn:</Text>
      {errorMsg ? (
        <Text style={styles.error}>{errorMsg}</Text>
      ) : location ? (
        <>
          <Text style={styles.location}>
            Latitude: {location.latitude}, Longitude: {location.longitude}
          </Text>
          <Text style={styles.address}>
            Địa điểm: {address || "Đang tải..."}
          </Text>
        </>
      ) : (
        <Text style={styles.loading}>Đang lấy vị trí...</Text>
      )}
      <Button title="Làm mới vị trí" onPress={onRefresh} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  paddingVertical: { paddingHorizontal: 20 },
  button: {
    backgroundColor: "#1D4ED8",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  marginTop: {
    marginTop: 16,
  },
  content: { padding: 20 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  location: { fontSize: 16, marginTop: 10 },
  address: { fontSize: 16, color: "#555", marginTop: 10 },
  error: { fontSize: 14, color: "red", fontStyle: "italic" },
  loading: { fontSize: 14, fontStyle: "italic", color: "#888" },
});
