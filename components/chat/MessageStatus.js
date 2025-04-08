import { View, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function MessageStatus({ status, isCurrentUser, size = "small" }) {
    // Only show status for current user's messages
    if (!isCurrentUser) return null

    // Determine icon size
    const iconSize =
        {
            small: 12,
            medium: 16,
            large: 20,
        }[size] || 12

    // Determine icon and color based on status
    const getStatusIcon = () => {
        switch (status) {
            case "sent":
                return <Ionicons name="checkmark" size={iconSize} color="#9E9E9E" />
            case "delivered":
                return <Ionicons name="checkmark-done" size={iconSize} color="#9E9E9E" />
            case "read":
                return <Ionicons name="checkmark-done" size={iconSize} color="#4A90E2" />
            default:
                return <Ionicons name="time-outline" size={iconSize} color="#9E9E9E" />
        }
    }

    return <View style={styles.container}>{getStatusIcon()}</View>
}

const styles = StyleSheet.create({
    container: {
        marginLeft: 4,
        alignSelf: "flex-end",
    },
})

