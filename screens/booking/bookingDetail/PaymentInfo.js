import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CreditCard, Info } from "lucide-react-native";
import InfoCard from "./InfoCard";
import { formatMoney, getPaymentMethodText } from "../../../utils/formatters";
import { BOOKING_STATUS } from "./Constants";

export default function PaymentInfo({ bookingData }) {
  const totalPriceHour =
    bookingData.basePrice +
    (bookingData.durationBookingHour - 1) * bookingData.overtimeHourlyPrice;

  const { couponId } = bookingData;

  const isRefundEligible = () => {
    const now = new Date();
    const timeExpireRefund = new Date(bookingData.timeExpireRefund);
    return (
      // bookingData.status === BOOKING_STATUS.CANCELLED &&
      bookingData.paymentStatus === 3 && now <= timeExpireRefund
    );
  };

  const isRefundExpired = () => {
    const now = new Date();
    const timeExpireRefund = new Date(bookingData.timeExpireRefund);
    return (
      // bookingData.status === BOOKING_STATUS.CANCELLED &&
      bookingData.paymentStatus === 3 && now > timeExpireRefund
    );
  };

  return (
    <InfoCard
      icon={<CreditCard size={20} color="#ff385c" />}
      title="Thông tin thanh toán"
    >
      <PaymentRow
        label="Phương thức:"
        value={getPaymentMethodText(bookingData.paymentMethod)}
      />
      <PaymentRow
        label="Giá giờ đầu:"
        value={`${formatMoney(bookingData.basePrice)} / giờ`}
      />
      <PaymentRow
        label="Giá giờ sau:"
        value={`${formatMoney(bookingData.overtimeHourlyPrice)} / giờ`}
      />
      <PaymentRow
        label="Số giờ thuê:"
        value={`${bookingData.durationBookingHour} giờ`}
      />
      <View style={[styles.paymentRow, styles.totalRow]} />
      <PaymentRow label="Tổng tiền:" value={`${formatMoney(totalPriceHour)}`} />
      {couponId && (
        <PaymentRow
          label="Giảm giá:"
          value={`${formatMoney(couponId?.amount)}`}
        />
      )}
      <View style={[styles.paymentRow, styles.totalRow]}>
        <Text style={styles.totalLabel}>Tổng cộng:</Text>
        <Text style={styles.totalValue}>
          {formatMoney(bookingData?.totalPrice)}
        </Text>
      </View>

      {(isRefundEligible() || isRefundExpired()) && (
        <View style={styles.refundStatusContainer}>
          <Info size={16} color={isRefundEligible() ? "#28a745" : "#aaa"} />
          <Text
            style={[
              styles.refundStatusText,
              { color: isRefundEligible() ? "#28a745" : "#aaa" },
            ]}
          >
            {isRefundEligible() ? "Hoàn tiền khả dụng" : "Hết hạn hoàn tiền"}
          </Text>
        </View>
      )}
    </InfoCard>
  );
}

function PaymentRow({ label, value }) {
  return (
    <View style={styles.paymentRow}>
      <Text style={styles.paymentLabel}>{label}</Text>
      <Text style={styles.paymentValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 15,
    color: "#666",
  },
  paymentValue: {
    fontSize: 15,
    color: "#333",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff385c",
  },
  refundStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  refundStatusText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
  },
});
