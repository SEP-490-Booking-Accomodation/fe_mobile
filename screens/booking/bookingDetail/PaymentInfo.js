import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import InfoCard from "./InfoCard";
import { formatMoney, getPaymentMethodText } from "../../../utils/formatters";
import { BOOKING_STATUS } from "./Constants";
import { useTranslation } from 'react-i18next';

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
      icon={<AntDesign name="creditcard" size={20} color="#ff385c" />}
      title={t('payment_info_title')}
    >
      <PaymentRow
        label={t('payment_method')}
        value={t(getPaymentMethodText(bookingData.paymentMethod))}
      />
      <PaymentRow
        label={t('base_price_text')}
        value={`${formatMoney(bookingData.basePrice)} ${t('hour')}`}
      />
      <PaymentRow
        label={t('overtime_price')}
        value={`${formatMoney(bookingData.overtimeHourlyPrice)} ${t('hour')}`}
      />
      <PaymentRow
        label={t('rental_hours')}
        value={`${bookingData.durationBookingHour} ${t('hour')}`}
      />
      <View style={[styles.paymentRow, styles.totalRow]} />
      <PaymentRow 
        label={t('subtotal')} 
        value={formatMoney(totalPriceHour)}
      />
      {couponId && (
        <PaymentRow
          label={t('discount')}
          value={formatMoney(couponId?.amount)}
        />
      )}
      <View style={[styles.paymentRow, styles.totalRow]}>
        <Text style={styles.totalLabel}>{t('total')}</Text>
        <Text style={styles.totalValue}>
          {formatMoney(bookingData?.totalPrice)}
        </Text>
      </View>

      {(isRefundEligible() || isRefundExpired()) && (
        <View style={styles.refundStatusContainer}>
          <AntDesign name="infocirlce" 
            size={16} 
            color={isRefundEligible() ? "#28a745" : "#aaa"} 
          />
          <Text style={[styles.refundStatusText, { color: isRefundEligible() ? "#28a745" : "#aaa" }]}>
            {isRefundEligible() ? t('refund_available') : t('refund_expired')}
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
