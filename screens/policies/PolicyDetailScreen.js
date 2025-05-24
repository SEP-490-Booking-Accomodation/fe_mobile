import React from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetPolicyByIdQuery } from "../../api/policySystemApi";
import { useTranslation } from "react-i18next";

const PolicyDetailScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { policyId } = route.params;
  const { data, error, isLoading } = useGetPolicyByIdQuery(policyId);
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4E72E3" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{t("error")}: {error.message}</Text>
      </View>
    );
  }

  const policy = data;

  if (!policy) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{t("policy_not_found")}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <AntDesign name="left" size={24} color="#4E72E3" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>{policy.name}</Text>
      </View>
      
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.titleCard}>
          <View style={styles.statusContainer}>
            <View style={styles.statusBadge}>
              <View style={[styles.statusDot, { backgroundColor: policy.isActive ? "#10B981" : "#EF4444" }]} />
              <Text style={[styles.statusText, { color: policy.isActive ? "#10B981" : "#EF4444" }]}>
                {policy.isActive ? t("active_policy") : t("inactive_policy")}
              </Text>
            </View>
            {policy.isDelete && (
              <View style={[styles.statusBadge, { backgroundColor: "#FEF2F2" }]}>
                <View style={[styles.statusDot, { backgroundColor: "#DC2626" }]} />
                <Text style={[styles.statusText, { color: "#DC2626" }]}>
                  {t("deleted")}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.sectionHeader}>
            <AntDesign name="info" size={20} color="#4E72E3" />
            <Text style={styles.sectionTitle}>{t("basic_information")}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t("description")}</Text>
            <Text style={styles.infoValue}>{policy.description}</Text>
          </View>
        </View>

        {policy.policySystemCategoryId && (
          <View style={styles.infoCard}>
            <View style={styles.sectionHeader}>
              <AntDesign name="tags" size={20} color="#4E72E3" />
              <Text style={styles.sectionTitle}>{t("category_information")}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t("category_name")}</Text>
              <Text style={styles.infoValue}>{policy.policySystemCategoryId.categoryName}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t("category_key")}</Text>
              <Text style={styles.infoValue}>{policy.policySystemCategoryId.categoryKey}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t("category_description")}</Text>
              <Text style={styles.infoValue}>{policy.policySystemCategoryId.categoryDescription}</Text>
            </View>
          </View>
        )}

        {policy.values && policy.values.length > 0 && (
          <View style={styles.valuesCard}>
            <View style={styles.sectionHeader}>
              <AntDesign name="bars" size={20} color="#4E72E3" />
              <Text style={styles.sectionTitle}>{t("policy_values")}</Text>
            </View>
            {policy.values.map((value, index) => (
              <View key={value.id || value._id} style={[styles.valueItem, index === policy.values.length - 1 && styles.lastValueItem]}>
                <View style={styles.valueMainInfo}>
                  <Text style={styles.valueText}>{value.val} {value.unit}</Text>
                  <Text style={styles.valueType}>{value.valueType}</Text>
                </View>
                
                <View style={styles.valueDetails}>
                  <View style={styles.valueDetailRow}>
                    <Text style={styles.valueDetailLabel}>{t("description")}:</Text>
                    <Text style={styles.valueDetailValue}>{value.description}</Text>
                  </View>
                  
                  {value.hashTag && (
                    <View style={styles.valueDetailRow}>
                      <Text style={styles.valueDetailLabel}>{t("hash_tag")}:</Text>
                      <Text style={styles.hashTag}>#{value.hashTag}</Text>
                    </View>
                  )}
                  
                  {value.note && (
                    <View style={styles.valueDetailRow}>
                      <Text style={styles.valueDetailLabel}>{t("note")}:</Text>
                      <Text style={styles.valueDetailValue}>{value.note}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.metadataCard}>
          <View style={styles.sectionHeader}>
            <AntDesign name="calendar" size={20} color="#4E72E3" />
            <Text style={styles.sectionTitle}>{t("timeline_information")}</Text>
          </View>
          
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>{t("start_date")}</Text>
            <Text style={styles.metadataValue}>{policy.startDate}</Text>
          </View>
          
          <View style={styles.metadataRow}>
            <Text style={styles.metadataLabel}>{t("end_date")}</Text>
            <Text style={styles.metadataValue}>{policy.endDate}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB", 
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
    fontSize: 14,
    color: "#EF4444",
    textAlign: "center",
    lineHeight: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F9FAFB", 
  },
  headerText: {
    fontSize: 22, 
    fontWeight: "600",
    color: "#1E293B",
    marginLeft: 12,
    flexShrink: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  titleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F9FAFB",
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 8,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#1F2937",
    lineHeight: 24,
  },
  valuesCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  valueItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  lastValueItem: {
    borderBottomWidth: 0,
  },
  valueMainInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  valueText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  valueType: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4E72E3",
    backgroundColor: "#F0F4FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  valueDetails: {
    marginTop: 8,
  },
  valueDetailRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  valueDetailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    minWidth: 80,
  },
  valueDetailValue: {
    fontSize: 14,
    color: "#1F2937",
    flex: 1,
    lineHeight: 20,
  },
  hashTag: {
    fontSize: 14,
    color: "#4E72E3",
    fontWeight: "500",
    flex: 1,
  },
  valueMetadata: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  valueId: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  valueTimestamp: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  metadataCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  metadataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 8,
  },
  metadataLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    flex: 1,
  },
  metadataValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    flex: 2,
    textAlign: "right",
  },
});

export default PolicyDetailScreen;