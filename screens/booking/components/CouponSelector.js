import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { Entypo, Feather } from "@expo/vector-icons";
import { ReactNativeModal } from "react-native-modal";
import { useGetAllCouponQuery } from "../../../api/couponApi";

export default function CouponSelector({
  selectedVoucher,
  setSelectedVoucher,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [processedCoupons, setProcessedCoupons] = useState([]);
  const { data: couponData, refetch } = useGetAllCouponQuery();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await refetch();
    } catch (error) {
      console.error("Lỗi khi làm mới voucher:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (couponData) {
      processCoupons();
    }
  }, [couponData]);

  const processCoupons = () => {
    if (!couponData) return;

    const currentDate = new Date();
    const processed = [];

    couponData.forEach((coupon) => {
      // Skip deleted or inactive coupons
      if (coupon.isDelete || !coupon.isActive) return;

      const startDate = new Date(convertVNDateToISO(coupon.startDate));
      const endDate = new Date(convertVNDateToISO(coupon.endDate));

      // Format the discount value
      const discountFormatted =
        coupon.discountBasedOn.toLowerCase() === "percentage"
          ? `${coupon.amount}%`
          : `${formatCurrency(coupon.amount)}`;

      // Create a description based on discount type
      const description =
        coupon.discountBasedOn.toLowerCase() === "percentage"
          ? `Giảm ${coupon.amount}% cho đơn hàng` +
            (coupon.maxDiscount
              ? ` (tối đa ${formatCurrency(coupon.maxDiscount)})`
              : "")
          : `Giảm ${formatCurrency(coupon.amount)} cho đơn hàng`;

      // Check if coupon is valid now or in the future
      const isCurrentlyValid =
        startDate <= currentDate && currentDate <= endDate;
      const isFuture = startDate > currentDate;

      if (isCurrentlyValid || isFuture) {
        processed.push({
          id: coupon._id,
          code: coupon.couponCode,
          description: description,
          discount: discountFormatted,
          discountBasedOn: coupon.discountBasedOn,
          amount: coupon.amount || 0,
          maxDiscount: coupon.maxDiscount || null,
          name: coupon.name,
          startDate: coupon.startDate,
          endDate: coupon.endDate,
          isSelectable: isCurrentlyValid, // Only currently valid coupons are selectable
        });
      }
    });

    // Sort: valid coupons first, then future coupons
    processed.sort((a, b) => {
      if (a.isSelectable && !b.isSelectable) return -1;
      if (!a.isSelectable && b.isSelectable) return 1;
      return 0;
    });

    setProcessedCoupons(processed);
  };

  // Helper to convert Vietnamese date format to ISO
  const convertVNDateToISO = (vnDate) => {
    // VN format: "28/02/2025 15:30:45"
    const [datePart, timePart] = vnDate.split(" ");
    const [day, month, year] = datePart.split("/");
    return `${year}-${month}-${day}T${timePart || "00:00:00"}`;
  };

  // Helper to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("₫", "đ");
  };

  const handleSelectVoucher = (voucher) => {
    if (!voucher.isSelectable) return; // Prevent selecting future vouchers
    setSelectedVoucher(voucher);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.label}>Voucher khuyến mãi</Text>
        {selectedVoucher ? (
          <View style={styles.selectedInfo}>
            <Text style={styles.voucherCode}>{selectedVoucher.code}</Text>
            <Text style={styles.voucherDesc}>
              {selectedVoucher.description}
            </Text>
          </View>
        ) : (
          <Text style={styles.placeholder}>Chọn voucher</Text>
        )}
        <Entypo
          name="chevron-right"
          size={20}
          color="#666"
          style={{ position: "absolute", right: 10, top: 10 }}
        />
      </TouchableOpacity>

      <ReactNativeModal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection="right"
        animationIn="slideInRight"
        animationOut="slideOutRight"
        style={styles.modalWrapper}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.header}>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Feather name="arrow-left" size={24} color="black" />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Chọn Voucher</Text>
                </View>

                {processedCoupons.length > 0 ? (
                  <FlatList
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    data={processedCoupons}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.voucherItem,
                          !item.isSelectable && styles.futureVoucher,
                        ]}
                        onPress={() => handleSelectVoucher(item)}
                        disabled={!item.isSelectable}
                      >
                        <View style={styles.voucherHeader}>
                          <Text style={styles.voucherCode}>{item.code}</Text>
                          <Text style={styles.voucherDiscount}>
                            {item.discount}
                          </Text>
                        </View>
                        <Text style={styles.voucherName}>{item.name}</Text>
                        <Text style={styles.voucherDesc}>
                          {item.description}
                        </Text>

                        {!item.isSelectable && (
                          <Text style={styles.comingSoonTag}>
                            Sắp có hiệu lực
                          </Text>
                        )}

                        <Text style={styles.validityPeriod}>
                          HSD: {item.startDate.split(" ")[0]} -{" "}
                          {item.endDate.split(" ")[0]}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                ) : (
                  <View style={styles.noVouchers}>
                    <Text>Không có voucher nào khả dụng</Text>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </ReactNativeModal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: "relative",
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#444",
  },
  placeholder: {
    marginTop: 5,
    color: "#999",
  },
  selectedInfo: {
    marginTop: 5,
  },
  voucherCode: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  voucherDiscount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e63946",
  },
  voucherName: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  voucherDesc: {
    color: "#555",
    fontSize: 13,
    marginTop: 2,
  },
  modalOverlay: {
    justifyContent: "flex-end",
  },
  modalWrapper: {
    margin: 0,
    justifyContent: "center",
  },
  modalContent: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  voucherItem: {
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    borderRadius: 8,
  },
  voucherHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  futureVoucher: {
    opacity: 0.6,
    backgroundColor: "#f0f0f0",
  },
  comingSoonTag: {
    marginTop: 5,
    padding: 3,
    backgroundColor: "#ffcc80",
    color: "#663c00",
    fontSize: 12,
    alignSelf: "flex-start",
    borderRadius: 4,
    overflow: "hidden",
  },
  validityPeriod: {
    marginTop: 5,
    fontSize: 12,
    color: "#777",
  },
  noVouchers: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
  },
});
