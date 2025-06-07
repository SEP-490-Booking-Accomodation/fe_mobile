import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useState } from "react";
import CustomButton from "../buttons/Button"; // Assume your CustomButton here
import { useTranslation } from 'react-i18next';

const PAYMENT_STATUS = Object.freeze({
  BOOKING: 1,
  PENDING: 2,
  PAID: 3,
  REFUND: 4,
  FAILED: 5,
});

const BOOKING_STATUS = Object.freeze({
  CONFIRMED: 1,
  NEEDCHECKIN: 2,
  CHECKEDIN: 3,
  NEEDCHECKOUT: 4,
  CHECKEDOUT: 5,
  CANCELLED: 6,
  COMPLETED: 7,
  PENDING: 8,
  REFUND: 9,
});

export default function CardInMyTicket(props) {
  const {
    imageUrl,
    nameRoom,
    tagName = "Imperial",
    placeName,
    maxPeople,
    price,
    dateCheckin,
    dateCheckout,
    status,
    paymentStatus,
    feedbackId,
    onViewDetail = () => { },
    onReviewAction = () => { },
    onCancelAction = () => { },
    onRebookingAction = () => { },
  } = props;
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const getStatusInfo = () => {
    switch (parseInt(status)) {
      case BOOKING_STATUS.CONFIRMED:
        return { text: t('status_confirmed'), color: "#10B981" };
      case BOOKING_STATUS.NEEDCHECKIN:
        return { text: t('status_need_checkin'), color: "#F59E0B" };
      case BOOKING_STATUS.CHECKEDIN:
        return { text: t('status_checked_in'), color: "#10B981" };
      case BOOKING_STATUS.NEEDCHECKOUT:
        return { text: t('status_need_checkout'), color: "#F59E0B" };
      case BOOKING_STATUS.CHECKEDOUT:
        return { text: t('status_checked_out'), color: "#6366F1" };
      case BOOKING_STATUS.CANCELLED:
        return { text: t('status_cancelled'), color: "#EF4444" };
      case BOOKING_STATUS.COMPLETED:
        return { text: t('status_completed'), color: "#6366F1" };
      case BOOKING_STATUS.PENDING:
        return { text: t('status_pending'), color: "#F59E0B" };
      case BOOKING_STATUS.REFUND:
        return { text: t('status_refund'), color: "#6366F1" };
      default:
        return { text: t('status_unknown'), color: "#6B7280" };
    }
  };

  const getPaymentStatusInfo = () => {
    switch (paymentStatus) {
      case PAYMENT_STATUS.BOOKING:
        return { text: t('booking'), color: "#F59E0B" };
      case PAYMENT_STATUS.PENDING:
        return { text: t('pending_payment'), color: "#FBBF24" };
      case PAYMENT_STATUS.PAID:
        return { text: t('paid'), color: "#10B981" };
      case PAYMENT_STATUS.REFUND:
        return { text: t('refunded'), color: "#6366F1" };
      case PAYMENT_STATUS.FAILED:
        return { text: t('failed'), color: "#EF4444" };
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
                <Text style={styles.infoText}>
                  {t('check_in')}: {dateCheckin}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Icon name="event" size={16} color="#4B84F5" />
                <Text style={styles.infoText}>
                  {t('check_out')}: {dateCheckout}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Icon name="people" size={16} color="#4B84F5" />
                <Text style={styles.infoText}>{maxPeople} {t('people')}</Text>
              </View>
            </View>

            {/* Price */}
            <Text style={styles.priceText}>{price}</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {status === BOOKING_STATUS.CANCELLED || status === BOOKING_STATUS.REFUND ? (
              <CustomButton
                title={t('rebook')}
                backgroundColor="#fef2f2"
                disabledBackgroundColor="rgba(26, 39, 65, 0.5)"
                titleColor="#101828"
                disabledTitleColor="#FFFFFF"
                loading={loading}
                style={{ minWidth: "100%" }}
                disabled={false}
                onPress={onRebookingAction}
              />
            ) : (status === BOOKING_STATUS.PENDING || 
                status === BOOKING_STATUS.CONFIRMED || 
                status === BOOKING_STATUS.NEEDCHECKIN || 
                status === BOOKING_STATUS.CHECKEDIN || 
                status === BOOKING_STATUS.NEEDCHECKOUT) ? (
              <CustomButton
                title={t('view_details')}
                backgroundColor="#101828"
                disabledBackgroundColor="rgba(26, 39, 65, 0.5)"
                titleColor="#ffffff"
                disabledTitleColor="#FFFFFF"
                loading={loading}
                disabled={false}
                style={{ minWidth: "100%", paddingVertical: 10 }}
                onPress={onViewDetail}
              />
            ) : ((status === BOOKING_STATUS.COMPLETED || status === BOOKING_STATUS.CHECKEDOUT) && feedbackId === null) ? (
              <CustomButton
                title={t('review')}
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
