import { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

const GuestCounter = ({
  title,
  subtitle,
  value,
  onIncrement,
  onDecrement,
  maxValue,
}) => (
  <View style={styles.counterContainer}>
    <View style={styles.counterInfo}>
      <Text style={styles.counterTitle}>{title}</Text>
      <Text style={styles.counterSubtitle}>{subtitle}</Text>
    </View>
    <View style={styles.counterControls}>
      <TouchableOpacity
        style={[
          styles.counterButton,
          value === 0 && styles.counterButtonDisabled,
        ]}
        onPress={onDecrement}
        disabled={value === 0}
      >
        <AntDesign name="minus" size={24} color={value === 0 ? "#ccc" : "#000"} />
      </TouchableOpacity>
      <Text style={styles.counterValue}>{value}</Text>
      <TouchableOpacity
        style={[
          styles.counterButton,
          value === maxValue && styles.counterButtonDisabled,
        ]}
        onPress={onIncrement}
        disabled={value === maxValue}
      >
        
        <AntDesign name="plus" size={24} color={value === maxValue ? "#ccc" : "#000"}/>
      </TouchableOpacity>
    </View>
  </View>
);

const GuestSelectionModal = ({
  visible,
  onClose,
  onConfirm,
  maxPeople = 3,
}) => {
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const totalCount = adults + children + infants;
  const isAtMaxCapacity = totalCount >= maxPeople;

  const handleIncrement = (type) => {
    if (isAtMaxCapacity) return;
    switch (type) {
      case "adults":
        setAdults(adults + 1);
        break;
      case "children":
        setChildren(children + 1);
        break;
      case "infants":
        setInfants(infants + 1);
        break;
    }
  };

  const handleDecrement = (type) => {
    switch (type) {
      case "adults":
        setAdults(Math.max(adults - 1, 0));
        break;
      case "children":
        setChildren(Math.max(children - 1, 0));
        break;
      case "infants":
        setInfants(Math.max(infants - 1, 0));
        break;
    }
  };

  const handleConfirm = () => {
    onConfirm({ adults, children, infants });
    onClose();
  };

  return (
    // <Modal
    //   visible={visible}
    //   animationType="slide"
    //   transparent
    //   onRequestClose={onClose}
    // >
    //   <View style={styles.modalOverlay}>
    //     <View style={styles.modalContent}>
    //       <Text style={styles.modalTitle}>Số lượng người ở phòng</Text>
    //       <Text style={styles.modalSubtitle}>Tối đa {maxPeople} người</Text>

    //       <GuestCounter
    //         title="Người lớn"
    //         subtitle="Từ 18 tuổi trở lên"
    //         value={adults}
    //         onIncrement={() => handleIncrement("adults")}
    //         onDecrement={() => handleDecrement("adults")}
    //         maxValue={maxPeople - children - infants}
    //       />
    //       <GuestCounter
    //         title="Trẻ em"
    //         subtitle="Từ 2 đến 17 tuổi"
    //         value={children}
    //         onIncrement={() => handleIncrement("children")}
    //         onDecrement={() => handleDecrement("children")}
    //         maxValue={maxPeople - adults - infants}
    //       />
    //       {/* <GuestCounter
    //         title="Trẻ sơ sinh"
    //         subtitle="Dưới 2 tuổi"
    //         value={infants}
    //         onIncrement={() => handleIncrement("infants")}
    //         onDecrement={() => handleDecrement("infants")}
    //         maxValue={maxPeople - adults - children}
    //       /> */}

    //       {isAtMaxCapacity && (
    //         <Text style={styles.maxCapacityWarning}>
    //           Đã đạt giới hạn số người tối đa ({maxPeople})
    //         </Text>
    //       )}

    //       <TouchableOpacity
    //         style={styles.confirmButton}
    //         onPress={handleConfirm}
    //       >
    //         <Text style={styles.confirmButtonText}>Tiếp tục</Text>
    //       </TouchableOpacity>
    //     </View>
    //   </View>
    // </Modal>
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Số lượng người ở phòng</Text>
              <Text style={styles.modalSubtitle}>Tối đa {maxPeople} người</Text>

              <GuestCounter
                title="Người lớn"
                subtitle="Từ 18 tuổi trở lên"
                value={adults}
                onIncrement={() => handleIncrement("adults")}
                onDecrement={() => handleDecrement("adults")}
                maxValue={maxPeople - children - infants}
              />
              <GuestCounter
                title="Trẻ em"
                subtitle="Từ 2 đến 17 tuổi"
                value={children}
                onIncrement={() => handleIncrement("children")}
                onDecrement={() => handleDecrement("children")}
                maxValue={maxPeople - adults - infants}
              />

              {isAtMaxCapacity && (
                <Text style={styles.maxCapacityWarning}>
                  Đã đạt giới hạn số người tối đa ({maxPeople})
                </Text>
              )}

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>Tiếp tục</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#666",
  },
  counterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  counterInfo: {
    flex: 1,
  },
  counterTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  counterSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  counterControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  counterButtonDisabled: {
    opacity: 0.5,
  },
  counterValue: {
    fontSize: 18,
    fontWeight: "600",
    minWidth: 24,
    textAlign: "center",
  },
  confirmButton: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  maxCapacityWarning: {
    color: "#ff6b6b",
    fontSize: 14,
    textAlign: "center",
    marginTop: 16,
    fontWeight: "500",
  },
});

export default GuestSelectionModal;
