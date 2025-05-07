import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

import CustomButton from "../../../components/buttons/Button";

const PaymentConfirm = ({ setPaymentMethod }) => {
  const [selectedPayment, setSelectedPayment] = useState(1);

  const paymentMethods = [
    // {
    //   value: 1,
    //   label: "Thanh toán bằng ví Mean",
    //   sublabel: "Thanh toán bằng ví Mean của bạn",
    //   image: {
    //     uri: "https://developers.momo.vn/v3/assets/images/square-logo-f8712a4d5be38f389e6bc94c70a33bf4.png",
    //   },
    // },
    {
      value: 1,
      label: "Momo",
      sublabel: "Thanh toán bằng Momo của bạn",
      image: {
        uri: "https://developers.momo.vn/v3/assets/images/square-logo-f8712a4d5be38f389e6bc94c70a33bf4.png",
      },
    },
    // {
    //   value: 3,
    //   label: "Thanh toán Test",
    //   sublabel: "Thanh toán Test",
    //   image: {
    //     uri: "https://developers.momo.vn/v3/assets/images/square-logo-f8712a4d5be38f389e6bc94c70a33bf4.png",
    //   },
    // },
  ];

  const handleSelectPayment = (method) => {
    setSelectedPayment(method.value);
    setPaymentMethod(method.value); // Update parent state
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.value}
          style={styles.paymentOption}
          onPress={() => handleSelectPayment(method)}
        >
          <Image source={method.image} style={styles.paymentIcon} />
          <View style={styles.paymentText}>
            <Text style={styles.paymentTitle}>{method.label}</Text>
            <Text style={styles.paymentSubtitle}>{method.sublabel}</Text>
          </View>
          <View style={styles.radioOuter}>
            {selectedPayment === method.value && (
              <View style={styles.radioInner} />
            )}
          </View>
        </TouchableOpacity>
      ))}
      <View style={styles.securityBox}>
        <Text style={styles.securityIcon}>🛡️</Text>
        <View>
          <Text style={styles.securityTitle}>Cam kết thanh toán</Text>
          <Text style={styles.securityText}>
            Mean đảm bảo số tiền bạn thanh toán cho mỗi giao dịch
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 10,
  },
  backButton: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    marginBottom: 10,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  paymentText: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  paymentSubtitle: {
    color: "#666",
    fontSize: 14,
  },
  radioOuter: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#007AFF",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  securityBox: {
    // margin: 20,
    // marginTop: 10,
    padding: 15,
    backgroundColor: "#e6f7e9",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  securityIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  securityTitle: {
    color: "#4caf50",
    fontWeight: "600",
    marginBottom: 4,
  },
  securityText: {
    color: "#4caf50",
    fontSize: 14,
  },
});

export default PaymentConfirm;
