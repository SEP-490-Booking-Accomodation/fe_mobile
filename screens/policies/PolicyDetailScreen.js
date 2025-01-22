import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { mockPolicies } from "../../data/mockData";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const PolicyDetailScreen = ({ route, navigation }) => {
    const { policyId } = route.params;
    const policy = mockPolicies.find((item) => item.id === policyId);

    if (!policy) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Policy not found</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <MaterialIcons
                    name="arrow-back"
                    size={24}
                    color="#4E72E3"
                    onPress={() => navigation.goBack()}
                />
                <Text style={styles.headerText}>{policy.title}</Text>
            </View>
            <ScrollView style={styles.contentContainer}>
                <Text style={styles.lastUpdate}>Last update: {policy.date}</Text>
                <Text style={styles.policyDescription}>{policy.description}</Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    headerText: {
        fontSize: 20,
        fontWeight: "600",
        color: "#1E293B",
        marginLeft: 12,
        flexShrink: 1,
    },
    contentContainer: {
        flex: 1,
        padding: 16,
    },
    lastUpdate: {
        fontSize: 14,
        color: "#6B7280",
        marginBottom: 8,
    },
    policyTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 16,
    },
    policyDescription: {
        fontSize: 16,
        lineHeight: 24,
        color: "#374151",
    },
    errorText: {
        fontSize: 16,
        color: "red",
        textAlign: "center",
        marginTop: 20,
    },
});

export default PolicyDetailScreen;
