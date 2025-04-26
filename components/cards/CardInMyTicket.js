import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useState } from "react";
import CustomButton from "../buttons/Button"; // Assume your CustomButton here

const PAYMENT_STATUS = Object.freeze({
  BOOKING: 1,
  PENDING: 2,
  PAID: 3,
  REFUND: 4,
  FAILED: 5,
});

export default function CardInMyTicket(props) {
  const {
    imageUrl,
    nameRoom,
    tagName = "Imperial",
    placeName,
    maxPeople,
    price,
    dateCompleted,
    status,
    paymentStatus,
    feedbackId,
    onViewDetail = () => {},
    onReviewAction = () => {},
    onCancelAction = () => {},
    onRebookingAction = () => {},
  } = props;

  const [loading, setLoading] = useState(false);

  const getStatusInfo = () => {
    switch (status) {
      case "-1":
        return { text: "Đã hủy", color: "#EF4444" };
      case "0":
        return { text: "Đang diễn ra", color: "#10B981" };
      case "1":
        return { text: "Hoàn tất", color: "#6366F1" };
      default:
        return { text: "N/A", color: "#6B7280" };
    }
  };

  const getPaymentStatusInfo = () => {
    switch (paymentStatus) {
      case PAYMENT_STATUS.BOOKING:
        return { text: "Đặt chỗ", color: "#F59E0B" };
      case PAYMENT_STATUS.PENDING:
        return { text: "Chờ thanh toán", color: "#FBBF24" };
      case PAYMENT_STATUS.PAID:
        return { text: "Đã thanh toán", color: "#10B981" };
      case PAYMENT_STATUS.REFUND:
        return { text: "Hoàn tiền", color: "#6366F1" };
      case PAYMENT_STATUS.FAILED:
        return { text: "Thất bại", color: "#EF4444" };
      default:
        return null;
    }
  };

  const statusInfo = getStatusInfo();
  const paymentStatusInfo = getPaymentStatusInfo();

  return (
    <TouchableOpacity style={styles.container} onPress={onViewDetail}>
      <View style={styles.contentRow}>
        <Image source={imageUrl} style={styles.thumbnail} />

        <View style={styles.rightContainer}>
          <View style={styles.detailsContainer}>
            <Text style={styles.title}>{nameRoom}</Text>

            {/* Status & Payment tags */}
            <View style={styles.tagRow}>
              <View
                style={[
                  styles.tagContainer,
                  { backgroundColor: `${statusInfo.color}20` },
                ]}
              >
                <Text style={[styles.tagText, { color: statusInfo.color }]}>
                  {statusInfo.text}
                </Text>
              </View>

              {paymentStatusInfo && (
                <View
                  style={[
                    styles.tagContainer,
                    { backgroundColor: `${paymentStatusInfo.color}20` },
                  ]}
                >
                  <Text
                    style={[styles.tagText, { color: paymentStatusInfo.color }]}
                  >
                    {paymentStatusInfo.text}
                  </Text>
                </View>
              )}
            </View>

            {/* Info rows */}
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Icon name="location-on" size={16} color="#4B84F5" />
                <Text style={styles.infoText}>{placeName}</Text>
              </View>

              <View style={styles.infoRow}>
                <Icon name="event" size={16} color="#4B84F5" />
                <Text style={styles.infoText}>{dateCompleted}</Text>
              </View>

              <View style={styles.infoRow}>
                <Icon name="people" size={16} color="#4B84F5" />
                <Text style={styles.infoText}>{maxPeople} người</Text>
              </View>
            </View>

            {/* Price */}
            <Text style={styles.priceText}>{price}</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {status === "-1" ? (
              <CustomButton
                title="Đặt lại"
                backgroundColor="#fef2f2"
                disabledBackgroundColor="rgba(26, 39, 65, 0.5)"
                titleColor="#101828"
                disabledTitleColor="#FFFFFF"
                loading={loading}
                style={{ minWidth: "100%" }}
                disabled={false}
                onPress={onRebookingAction}
              />
            ) : status === "0" ? (
              <CustomButton
                title="Xem chi tiết"
                backgroundColor="#101828"
                disabledBackgroundColor="rgba(26, 39, 65, 0.5)"
                titleColor="#ffffff"
                disabledTitleColor="#FFFFFF"
                loading={loading}
                disabled={false}
                style={{ minWidth: "100%", paddingVertical: 10 }}
                onPress={onViewDetail}
              />
            ) : status === "1" && feedbackId === null ? (
              <CustomButton
                title="Đánh giá"
                backgroundColor="#dadada"
                disabledBackgroundColor="rgba(26, 39, 65, 0.5)"
                titleColor="#101828"
                disabledTitleColor="#FFFFFF"
                loading={loading}
                disabled={false}
                style={{ minWidth: "100%" }}
                onPress={onReviewAction}
              />
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 350,
    marginBottom: 16,
  },
  contentRow: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    minHeight: 140,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  rightContainer: {
    flex: 1,
    justifyContent: "space-between",
    minHeight: 130,
  },
  detailsContainer: {
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  tagRow: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 6,
  },
  tagContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
  },
  infoContainer: {
    gap: 6,
    marginVertical: 6,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    color: "#4B5563",
  },
  priceText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4e72e3",
    marginTop: 6,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
});
