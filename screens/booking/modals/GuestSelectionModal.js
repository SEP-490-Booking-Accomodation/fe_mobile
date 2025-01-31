import { useState } from "react"
import { View, Text, Modal, StyleSheet, TouchableOpacity } from "react-native"
import { Minus, Plus } from "lucide-react-native"

const GuestCounter = ({ title, subtitle, value, onIncrement, onDecrement }) => (
  <View style={styles.counterContainer}>
    <View style={styles.counterInfo}>
      <Text style={styles.counterTitle}>{title}</Text>
      <Text style={styles.counterSubtitle}>{subtitle}</Text>
    </View>
    <View style={styles.counterControls}>
      <TouchableOpacity
        style={[styles.counterButton, value === 0 && styles.counterButtonDisabled]}
        onPress={onDecrement}
        disabled={value === 0}
      >
        <Minus size={24} color={value === 0 ? "#ccc" : "#000"} />
      </TouchableOpacity>
      <Text style={styles.counterValue}>{value}</Text>
      <TouchableOpacity style={styles.counterButton} onPress={onIncrement}>
        <Plus size={24} color="#000" />
      </TouchableOpacity>
    </View>
  </View>
)

const GuestSelectionModal = ({ visible, onClose, onConfirm }) => {
  const [adults, setAdults] = useState(0)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)

  const handleConfirm = () => {
    onConfirm({ adults, children, infants })
    onClose()
  }

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Số lượng người ở phòng</Text>
          <Text style={styles.modalSubtitle}>Tối đa 2 người lớn, 1 trẻ em</Text>

          <GuestCounter
            title="Người lớn"
            subtitle="Từ 18 tuổi trở lên"
            value={adults}
            onIncrement={() => setAdults(Math.min(adults + 1, 2))}
            onDecrement={() => setAdults(Math.max(adults - 1, 0))}
          />

          <GuestCounter
            title="Trẻ em"
            subtitle="Từ 2 đến 17 tuổi"
            value={children}
            onIncrement={() => setChildren(Math.min(children + 1, 1))}
            onDecrement={() => setChildren(Math.max(children - 1, 0))}
          />

          <GuestCounter
            title="Trẻ sơ sinh"
            subtitle="Dưới 2 tuổi"
            value={infants}
            onIncrement={() => setInfants(infants + 1)}
            onDecrement={() => setInfants(Math.max(infants - 1, 0))}
          />

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

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
    paddingBottom: 34,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
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
    gap: 16,
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
})

export default GuestSelectionModal

