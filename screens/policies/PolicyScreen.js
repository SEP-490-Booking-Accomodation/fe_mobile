import React, { useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import PolicyItem from "../../components/policies/PolicyItem";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { useLazyGetAllPoliciesQuery } from "../../api/policySystemApi";
import { useTranslation } from "react-i18next";

const PolicyScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [getAllPolicies, { isLoading, error, data }] = useLazyGetAllPoliciesQuery();

  useEffect(() => {
    getAllPolicies();
  }, []);

  const handlePress = (policy) => {
    navigation.navigate("PolicyDetail", { policyId: policy.id });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <AntDesign name="left" size={24} color="#4E72E3" onPress={() => navigation.goBack()} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    textAlign: "center",
    color: "#EF4444",
    fontSize: 14,
    lineHeight: 20,
  },
  listContainer: {
    paddingVertical: 8,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default PolicyScreen;