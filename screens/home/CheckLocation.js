import { Button, StyleSheet } from "react-native";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";

export function CheckLocation({ location, address, errorMsg, onRefresh }) {
  const { t } = useTranslation();

  return (
    <View style={styles.content}>
      <Text style={styles.title}>{t('current_location')}</Text>
      {errorMsg ? (
        <Text style={styles.error}>{t(errorMsg)}</Text>
      ) : location ? (
        <>
          <Text style={styles.location}>
            {t('latitude')}: {location.latitude}, {t('longitude')}: {location.longitude}
          </Text>
          <Text style={styles.address}>
            {t('address')}: {address || t('loading_address')}
          </Text>
        </>
      ) : (
        <Text style={styles.loading}>{t('loading_location')}</Text>
      )}
      <Button title={t('refresh_location_button')} onPress={onRefresh} />
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
