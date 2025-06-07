import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import InfoCard from "./InfoCard";
import { formatMoney, getPaymentMethodText } from "../../../utils/formatters";
import { BOOKING_STATUS } from "./Constants";
import { useTranslation } from "react-i18next";

export default function PaymentInfo({ bookingData }) {
  const { t } = useTranslation();
  const totalPriceHour =
    bookingData.basePrice +
    (bookingData.durationBookingHour - 1) * bookingData.overtimeHourlyPrice;

  const { couponId } = bookingData;

  const isRefundEligible = () => {
    const now = new Date();
    const timeExpireRefund = new Date(bookingData.timeExpireRefund);
    return (
      bookingData.paymentStatus === 3 && now <= timeExpireRefund
    );
  };

  const isRefundExpired = () => {
    const now = new Date();
    const timeExpireRefund = new Date(bookingData.timeExpireRefund);
    return (
      bookingData.paymentStatus === 3 && now > timeExpireRefund
    );
  };

  return (
    <InfoCard
      icon={<AntDesign name="creditcard" size={20} color="#4E72E3" />}
      title={t("payment_info_title")}
    >
      <View style={styles.container}>
        <View style={styles.mainSection}>
          <PaymentRow
            label={t("payment_method")}
            value={t(getPaymentMethodText(bookingData.paymentMethod))}
          />
          <PaymentRow
            label={t("base_price_text")}
            value={`${formatMoney(bookingData.basePrice)} ${t("hour")}`}
          />
          <PaymentRow
            label={t("overtime_price")}
            value={`${formatMoney(bookingData.overtimeHourlyPrice)} ${t("hour")}`}
          />
          <PaymentRow
            label={t("rental_hours")}
            value={`${bookingData.durationBookingHour} ${t("hour")}`}
          />
        </View>

        <View style={styles.subtotalSection}>
          <PaymentRow 
            label={t("subtotal")} 
            value={formatMoney(totalPriceHour)}
            isHighlighted
          />
          {couponId && (
            <PaymentRow
              label={t("discount")}
              value={`- ${formatMoney(couponId?.amount)}`}
              isDiscount
            />
          )}
        </View>

        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>{t("total")}</Text>
          <Text style={styles.totalValue}>
            {formatMoney(bookingData?.totalPrice)}
          </Text>
        </View>

        {(isRefundEligible() || isRefundExpired()) && (
          <View style={styles.refundStatusContainer}>
            <View style={[
              styles.refundStatusBadge,
              { backgroundColor: isRefundEligible() ? "#E6F4EA" : "#F1F3F5" }
            ]}>
              <AntDesign
                name="infocirlce"
                size={16}
                color={isRefundEligible() ? "#28a745" : "#909AA4"}
              />
              <Text
                style={[
                  styles.refundStatusText,
                  { color: isRefundEligible() ? "#28a745" : "#909AA4" },
                ]}
              >
                {isRefundEligible() ? t("refund_available") : t("refund_expired")}
              </Text>
            </View>
          </View>
        )}
      </View>
    </InfoCard>
  );
}

function PaymentRow({ label, value, isHighlighted, isDiscount }) {
  return (
    <View style={styles.paymentRow}>
      <Text style={[
        styles.paymentLabel,
        isHighlighted && styles.highlightedLabel
      ]}>
        {label}
      </Text>
      <Text style={[
        styles.paymentValue,
        isHighlighted && styles.highlightedValue,
        isDiscount && styles.discountValue
      ]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F7FAFC",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  mainSection: {
    marginBottom: 16,
  },
  subtotalSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    marginBottom: 16,
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  paymentLabel: {
    fontSize: 14,
    color: "#718096",
    fontWeight: "500",
  },
  paymentValue: {
    fontSize: 14,
    color: "#2D3748",
    fontWeight: "500",
  },
  highlightedLabel: {
    color: "#4A5568",
    fontWeight: "600",
  },
  highlightedValue: {
    color: "#2D3748",
    fontWeight: "600",
  },
  discountValue: {
    color: "#E53E3E",
    fontWeight: "600",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4E72E3",
  },
  refundStatusContainer: {
    marginTop: 16,
  },
  refundStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  refundStatusText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
});
