import { View, Text, StyleSheet } from "react-native"

export default function OnlineStatus({ isOnline, lastSeen, showText = false, size = "medium" }) {
    // Format last seen time
    const formatLastSeen = () => {
        if (!lastSeen) return "Offline"

        try {
            const now = new Date()
            const lastSeenDate = new Date(lastSeen)
            const diffMs = now - lastSeenDate
            const diffMins = Math.floor(diffMs / 60000)
            const diffHours = Math.floor(diffMins / 60)
            const diffDays = Math.floor(diffHours / 24)

            if (diffMins < 1) return "Just now"
            if (diffMins < 60) return `${diffMins}m ago`
            if (diffHours < 24) return `${diffHours}h ago`
            if (diffDays === 1) return "Yesterday"
            return `${diffDays}d ago`
        } catch (e) {
            return "Offline"
        }
    }

    // Determine indicator size
    const indicatorSize =
        {
            small: 8,
            medium: 10,
            large: 12,
        }[size] || 10

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.indicator,
                    { backgroundColor: isOnline ? "#4CAF50" : "#9E9E9E" },
                    { width: indicatorSize, height: indicatorSize },
                ]}
            />

            {showText && <Text style={styles.text}>{isOnline ? "Online" : formatLastSeen()}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
    },
    indicator: {
        borderRadius: 50,
        marginRight: 5,
    },
    text: {
        fontSize: 12,
        color: "#666",
    },
})

