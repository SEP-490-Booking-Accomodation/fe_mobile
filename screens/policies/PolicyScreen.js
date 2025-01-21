import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import PolicyItem from "../../components/policies/PolicyItem";
import { useNavigation } from "@react-navigation/native";
import { mockPolicies } from "../../data/mockData";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

const PolicyScreen = () => {
    const navigation = useNavigation();

    const handlePress = (policy) => {
        navigation.navigate("PolicyDetail", { policyId: policy.id });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <MaterialIcons
                    name="arrow-back"
                    size={24}
                    color="#4E72E3"
                    onPress={() => navigation.goBack()}
                />
                <Text style={styles.header}>Chính sách</Text>
            </View>
            <FlatList
                data={mockPolicies}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <PolicyItem
                        iconName="notifications"
                        title={item.title}
                        time={item.date}
                        message={item.description}
                        onPress={() => handlePress(item)}
                    />
                )}
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        backgroundColor: "#F9FAFB",
    },
    header: {
        fontSize: 22,
        fontWeight: "600",
        color: "#1E293B",
        marginLeft: 12,
    },

});

export default PolicyScreen;
