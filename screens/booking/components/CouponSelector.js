import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import { Entypo, Feather } from "@expo/vector-icons";
import { ReactNativeModal } from "react-native-modal";
import { useGetAllCouponQuery } from "../../../api/couponApi";
import { useTranslation } from "react-i18next";

export default function CouponSelector({ selectedVoucher, setSelectedVoucher }) {
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [processedCoupons, setProcessedCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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

    couponData?.coupons.forEach((coupon) => {
      if (coupon.isDelete || !coupon.isActive) return;

      const startDate = new Date(convertVNDateToISO(coupon.startDate));
      const endDate = new Date(convertVNDateToISO(coupon.endDate));

      const discountFormatted =
        coupon.discountBasedOn.toLowerCase() === "percentage"
          ? `${coupon.amount}%`
          : `${formatCurrency(coupon.amount)}`;

      let description = "";
      if (coupon.discountBasedOn.toLowerCase() === "percentage") {
        if (coupon.maxDiscount) {
          description = t("discount_percentage_with_max", {
            amount: coupon.amount,
            max: formatCurrency(coupon.maxDiscount),
          });
        } else {
          description = t("discount_percentage_no_max", {
            amount: coupon.amount,
          });
        }
      } else {
        description = t("discount_fixed", {
          amount: formatCurrency(coupon.amount),
        });
      }

      const isCurrentlyValid =
        startDate <= currentDate && currentDate <= endDate;
      const isFuture = startDate > currentDate;

      if (isCurrentlyValid || isFuture) {
        processed.push({
          ...coupon,
          description: description,
          discount: discountFormatted,
          isSelectable: isCurrentlyValid,
        });
      }
    });

    processed.sort((a, b) => {
      if (a.isSelectable && !b.isSelectable) return -1;
      if (!a.isSelectable && b.isSelectable) return 1;

      const aIsPercentage = a.discountBasedOn.toLowerCase() === "percentage";
      const bIsPercentage = b.discountBasedOn.toLowerCase() === "percentage";

      if (aIsPercentage && bIsPercentage) {
        return b.amount - a.amount;
      } else if (aIsPercentage && !bIsPercentage) {
        return -1;
      } else if (!aIsPercentage && bIsPercentage) {
        return 1;
      } else {
        return b.amount - a.amount;
      }
    });

    setProcessedCoupons(processed);
    setFilteredCoupons(processed);
  };

  const convertVNDateToISO = (vnDate) => {
    const [datePart, timePart] = vnDate.split(" ");
    const [day, month, year] = datePart.split("/");
    return `${year}-${month}-${day}T${timePart || "00:00:00"}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("₫", "");
  };

  const handleSelectVoucher = (voucher) => {
    if (!voucher.isSelectable) return;
    if (selectedVoucher && selectedVoucher.couponCode === voucher.couponCode) {
      setSelectedVoucher(null);
    } else {
      setSelectedVoucher(voucher);
    }
    setModalVisible(false);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredCoupons(processedCoupons);
    } else {
      const filtered = processedCoupons.filter((coupon) =>
        coupon.couponCode.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCoupons(filtered);
    }
  };

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.label}>{t("promo_voucher")}</Text>
        {selectedVoucher ? (
          <View style={styles.selectedInfo}>
            <Text style={styles.voucherCode}>{selectedVoucher.couponCode}</Text>
            <Text style={styles.voucherDesc}>
              {selectedVoucher.name}
            </Text>
            <Text style={styles.voucherDesc}>
              {selectedVoucher.description}
            </Text>
          </View>
        ) : (
          <Text style={styles.placeholder}>{t("select_voucher")}</Text>
        )}
        <Entypo
          name="chevron-right"
          size={20}
          color="#666"
          style={{ position: "absolute", right: 10, top: 10 }}
        />
      </TouchableOpacity>

      <ReactNativeModal isVisible={modalVisible} style={styles.modalWrapper}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <View style={styles.header}>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Feather name="arrow-left" size={24} color="black" />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>{t("choose_voucher")}</Text>
                </View>

                <TextInput
                  style={styles.searchBar}
                  placeholder={t("search_coupon_code")}
                  value={searchQuery}
                  onChangeText={handleSearch}
                />

                {filteredCoupons.length > 0 ? (
                  <FlatList
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    data={filteredCoupons}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.voucherItem,
                          !item.isSelectable && styles.futureVoucher,
                          selectedVoucher?.couponCode === item.couponCode &&
                            styles.selectedVoucher,
                        ]}
                        onPress={() => handleSelectVoucher(item)}
                        disabled={!item.isSelectable}
                      >
                        <View style={styles.voucherLeft}>
                          <Text style={styles.discountLabel}>Sale</Text>
                          <Text style={styles.voucherDiscount}>
                            {item.discount}
                          </Text>
                        </View>
                        <View style={styles.voucherRight}>
                          <View style={styles.voucherHeader}>
                            <Text style={styles.voucherCode}>
                              {item.couponCode}
                            </Text>
                          </View>
                          <Text style={styles.validityPeriod}>
                            {t("validity_period", {
                              start: item.startDate.split(" ")[0],
                              end: item.endDate.split(" ")[0],
                            })}
                          </Text>
                          <Text style={styles.validityPeriod}>
                            {item.name}
                          </Text>
                          {!item.isSelectable && (
                            <Text style={styles.comingSoonTag}>
                              {t("coming_soon")}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                ) : (
                  <View style={styles.noVouchers}>
                    <Text>{t("no_vouchers_available")}</Text>
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
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  discountLabel: {
    fontSize: 14,
    color: "white",
    marginBottom: 2,
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
  searchBar: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  voucherItem: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    borderRadius: 8,
  },
  voucherLeft: {
    backgroundColor: "#4E72E3",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    paddingVertical: 10,
  },
  voucherRight: {
    flex: 1,
    paddingLeft: 15,
    paddingVertical: 10,

  },
  voucherHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedVoucher: {
    borderWidth: 2,
    borderColor: "#4E72E3",
    backgroundColor: "#e6f0fa",
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
