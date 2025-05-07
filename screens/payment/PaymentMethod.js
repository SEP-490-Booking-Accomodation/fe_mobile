import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useTranslation } from "react-i18next";

export default function PaymentMethod() {
  const { t } = useTranslation();
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePayment = () => {
    alert(t("card_info_saved"));
  };

  return (
    <View style={styles.container}>
      {/* Hình ảnh thẻ ngân hàng */}
      <Image
        source={{
          uri: "https://www.sbv.gov.vn/webcenter/cs/groups/phongweb/documents/noidungtinh/c2j2/mdc3/~edisp/~export/SBVWEBAPP01SBV077333~12/420256-02.jpg",
        }}
        style={styles.cardImage}
      />


      {/* Hiển thị số thẻ trên ảnh (giả lập) */}
      <View style={styles.cardOverlay}>
        <Text style={styles.cardNumber}>
          {cardNumber ? cardNumber : "**** **** **** ****"}
        </Text>
        <Text style={styles.cardHolder}>
          {cardHolder ? cardHolder.toUpperCase() : t("cardholder_name")}
        </Text>
      </View>

      {/* Form nhập thông tin thẻ */}
      <Text style={styles.title}>{t("enter_card_info")}</Text>

      <TextInput
        style={styles.input}
        placeholder={t("card_number_placeholder")}
        keyboardType="numeric"
        maxLength={19}
        value={cardNumber}
        onChangeText={(text) =>
          setCardNumber(
            text
              .replace(/\s?/g, "")
              .replace(/(\d{4})/g, "$1 ")
              .trim()
          )
        }
      />

<TextInput
        style={styles.input}
        placeholder={t("cardholder_name_placeholder")}
        autoCapitalize="characters"
        value={cardHolder}
        onChangeText={setCardHolder}
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder={t("expiry_date_placeholder")}
          keyboardType="numeric"
          maxLength={5}
          value={expiryDate}
          onChangeText={(text) => setExpiryDate(text.replace(/(\d{2})/, "$1/"))}
        />

        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder={t("cvv_placeholder")}
          keyboardType="numeric"
          maxLength={3}
          secureTextEntry
          value={cvv}
          onChangeText={setCvv}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handlePayment}>
        <Text style={styles.buttonText}>{t("save_card")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 20,
    alignItems: "center",
  },
  cardImage: {
    width: "100%",
    height: 180,
    resizeMode: "contain",
    marginBottom: 10,
  },
  cardOverlay: {
    position: "absolute",
    top: 60,
    left: 40,
    right: 40,
  },
  cardNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    letterSpacing: 2,
  },
  cardHolder: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
    marginTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 12,
    fontSize: 16,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  halfInput: {
    width: "48%",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
