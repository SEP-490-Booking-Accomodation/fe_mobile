import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { useTranslation } from "react-i18next";

const screenWidth = Dimensions.get("window").width;

export default function WalletScreen() {
  const { t } = useTranslation();

  const transactions = [
    { id: "1", type: t('deposit'), amount: "+500.000 đ", date: "02/02/2025" },
    { id: "2", type: t('withdraw'), amount: "-200.000 đ", date: "01/02/2025" },
    { id: "3", type: t('deposit'), amount: "+300.000 đ", date: "31/01/2025" },
  ];
  return (
    <View style={styles.container}>
      {/* Số dư tài khoản */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>{t('account_balance')}</Text>
        <Text style={styles.balanceAmount}>200.000 đ</Text>
      </View>

      {/* Nút nạp và rút tiền */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.buttonText}>{t('deposit')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.withdrawButton]}>
          <Ionicons name="remove-circle" size={24} color="white" />
          <Text style={styles.buttonText}>{t('withdraw')}</Text>
        </TouchableOpacity>
      </View>

      {/* Biểu đồ số dư */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>{t('balance_fluctuation')}</Text>
        <LineChart
          data={{
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [{ data: [500, 200, 600, 300, 700, 400] }],
          }}
          width={screenWidth - 32}
          height={200}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
            strokeWidth: 2,
            decimalPlaces: 0,
          }}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Lịch sử giao dịch */}
      <View style={styles.transactionContainer}>
        <Text style={styles.sectionTitle}>{t('transaction_history')}</Text>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <Text style={styles.transactionType}>{item.type}</Text>
              <Text style={styles.transactionAmount}>{item.amount}</Text>
              <Text style={styles.transactionDate}>{item.date}</Text>
            </View>
          )}
        />
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>{t('view_all')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8", padding: 16 },

  balanceCard: {
    backgroundColor: "#101828",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  balanceTitle: { fontSize: 16, color: "white", opacity: 0.8 },
  balanceAmount: { fontSize: 28, fontWeight: "bold", color: "white" },

  buttonContainer: { flexDirection: "row", justifyContent: "space-between" },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 4,
  },
  withdrawButton: { backgroundColor: "#FF3B30" },
  buttonText: { color: "white", fontSize: 16, marginLeft: 8 },

  chartContainer: { marginVertical: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  chart: { borderRadius: 8 },

  transactionContainer: { marginTop: 16 },
  transactionItem: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionType: { fontSize: 16, fontWeight: "bold", color: "#333" },
  transactionAmount: { fontSize: 16, fontWeight: "bold" },
  transactionDate: { fontSize: 14, color: "#666" },

  viewAllButton: {
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#007AFF",
    borderRadius: 8,
    marginTop: 8,
  },
  viewAllText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
