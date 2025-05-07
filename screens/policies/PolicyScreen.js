import React, { useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import PolicyItem from "../../components/policies/PolicyItem";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useLazyGetAllPoliciesQuery } from "../../api/policySystemApi";
import { useTranslation } from "react-i18next";

const PolicyScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [getAllPolicies, { isLoading, error, data }] = useLazyGetAllPoliciesQuery();

    useEffect(() => {
        getAllPolicies(); // Fetch data when component mounts
    }, []);

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
                <Text style={styles.header}>{t("policies")}</Text>
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color="#4E72E3" />
            ) : error ? (
                <Text style={styles.errorText}>{t("data_load_error")}</Text>
            ) : (
                <FlatList
                    data={data || []}
                    keyExtractor={(item) => item?.id.toString()}
                    renderItem={({ item }) => (
                        <PolicyItem
                            iconName="notifications"
                            title={item.name}
                            time={item.createdAt}
                            message={item.description}
                            onPress={() => handlePress(item)}
                        />
                    )}
                    contentContainerStyle={styles.listContainer}
                />
            )}
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
    errorText: {
        textAlign: "center",
        color: "red",
        marginTop: 20,
    },
});

export default PolicyScreen;
