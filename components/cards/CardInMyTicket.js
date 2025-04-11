import { useState } from "react"
import { TouchableOpacity, View, StyleSheet, Text, Image } from "react-native"
import Icon from "react-native-vector-icons/MaterialIcons"
import CustomButton from "../buttons/Button"

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
    feedbackId,
    onViewDetail = () => {},
    onReviewAction = () => {},
    onCancelAction = () => {},
    onRebookingAction = () => {},
  } = props

  const [loading, setLoading] = useState(false)

  // Determine the status text and color based on status
  const getStatusInfo = () => {
    switch (status) {
      case "-1":
        return { text: "Đã hủy", color: "#EF4444" }
      case "0":
        return { text: "Đang diễn ra", color: "#10B981" }
      case "1":
        return { text: "Hoàn tất", color: "#6366F1" }
      default:
        return { text: "N/A", color: "#6B7280" }
    }
  }

  const statusInfo = getStatusInfo()

  return (
      <TouchableOpacity style={styles.container} onPress={onViewDetail}>
        <View style={styles.contentRow}>
          <Image
              source={imageUrl} // Image source
              style={styles.thumbnail}
          />

          <View style={styles.rightContainer}>
            <View style={styles.detailsContainer}>
              <Text style={styles.title}>{nameRoom}</Text>

              {/* Status tag */}
              <View style={[styles.tagContainer, { backgroundColor: `${statusInfo.color}20` }]}>
                <Text style={[styles.tagText, { color: statusInfo.color }]}>{statusInfo.text}</Text>
              </View>

              <View style={styles.locationContainer}>
                <Icon name="location-on" size={16} color="#4B84F5" />
                <Text style={styles.locationText}>{placeName}</Text>
                <Text style={styles.dateText}>{dateCompleted}</Text>
              </View>

              <View style={styles.peopleContainer}>
                <Icon name="person" size={16} color="#4B84F5" />
                <Text style={styles.peopleText}>{maxPeople} người </Text>
              </View>

              <Text style={styles.priceText}>{price}</Text>
            </View>

            <View style={styles.buttonContainer}>
              {status === "-1" ? (
                  // For cancelled bookings - Show "Đặt lại" button
                  <CustomButton
                      title={"Đặt lại"}
                      backgroundColor="#fef2f2"
                      disabledBackgroundColor="rgba(26, 39, 65, 0.5)"
                      titleColor="#101828"
                      disabledTitleColor="#FFFFFF"
                      loading={loading}
                      style={{ minWidth: feedbackId === null ? "45%" : "100%" }}
                      disabled={false}
                      onPress={onRebookingAction}
                  />
              ) : status === "0" ? (
                  // For current/upcoming bookings - Show only "Xem chi tiết" button (removed "Hủy" button)
                  <CustomButton
                      title={"Xem chi tiết"}
                      backgroundColor="#101828"
                      disabledBackgroundColor="rgba(26, 39, 65, 0.5)"
                      titleColor="#ffffff"
                      disabledTitleColor="#FFFFFF"
                      loading={loading}
                      disabled={false}
                      style={{ minWidth: "100%", paddingVertical: 10 }}
                      onPress={onViewDetail}
                  />
              ) : status === "1" ? (
                  // For completed bookings - Show "Đánh giá" button if feedbackId is null
                  feedbackId === null ? (
                      <CustomButton
                          title={"Đánh giá"}
                          backgroundColor="#dadada"
                          disabledBackgroundColor="rgba(26, 39, 65, 0.5)"
                          titleColor="#101828"
                          disabledTitleColor="#FFFFFF"
                          loading={loading}
                          style={{ minWidth: "100%" }}
                          disabled={false}
                          onPress={onReviewAction}
                      />
                  ) : null
              ) : null}

              {/* Show "Đánh giá" button next to "Đặt lại" for cancelled bookings if feedbackId is null */}
              {status === "-1" && feedbackId === null && (
                  <CustomButton
                      title={"Đánh giá"}
                      backgroundColor="#dadada"
                      disabledBackgroundColor="rgba(26, 39, 65, 0.5)"
                      titleColor="#101828"
                      disabledTitleColor="#FFFFFF"
                      loading={loading}
                      style={{ minWidth: "45%" }}
                      disabled={false}
                      onPress={onReviewAction}
                  />
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 350,
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
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
  tagContainer: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginVertical: 4,
  },
  tagText: {
    color: "#4B84F5",
    fontSize: 12,
    fontWeight: "500",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingRight: 8,
  },
  locationText: {
    color: "#00000050",
    flex: 1,
  },
  dateText: {
    color: "#4e72e3",
  },
  peopleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  peopleText: {
    color: "#00000050",
  },
  priceText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4e72e3",
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
})
