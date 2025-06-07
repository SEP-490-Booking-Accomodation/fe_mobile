import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const PolicyModal = ({ visible, onClose, policies, isLoading, error }) => {
  const { t } = useTranslation();
  const [expandedPolicy, setExpandedPolicy] = useState(null);

  if (!visible) return null;

  const renderPolicies = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#4E72E3" />
          <Text style={styles.loadingText}>{t('loading_policies')}</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{t('error_loading_policies')}</Text>
        </View>
      );
    }

    if (!policies || policies.length === 0) {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.noDataText}>{t('no_policies_found')}</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={true}>
        {policies.map((policy, index) => (
          <View key={policy._id || index} style={styles.policyCard}>
            <TouchableOpacity
              style={styles.policyHeader}
              onPress={() => setExpandedPolicy(expandedPolicy === policy._id ? null : policy._id)}
            >
              <View style={styles.policyTitleContainer}>
                <Text style={styles.policyTitle}>{policy.policyTitle || 'Untitled Policy'}</Text>
                <Text style={styles.policyDates}>
                  {policy.startDate || 'No start date'} - {policy.endDate || 'No end date'}
                </Text>
              </View>
              <AntDesign
                name={expandedPolicy === policy._id ? 'up' : 'down'}
                size={20}
                color="#4E72E3"
              />
            </TouchableOpacity>

            {expandedPolicy === policy._id && (
              <View style={styles.policyContent}>
                <Text style={styles.policyDescription}>
                  {policy.policyDescription || 'No description available'}
                </Text>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>{t('owner')}: </Text>
                  <Text style={styles.value}>
                    {policy.ownerId?.userId?.fullName || t('unknown_owner')}
                  </Text>
                </View>
                <Text style={styles.updatedAt}>
                  {t('last_updated')}: {policy.updatedAt || 'N/A'}
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('owner_policies')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <AntDesign name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          {renderPolicies()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    width: '100%',
    maxHeight: SCREEN_HEIGHT * 0.8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  scrollView: {
    maxHeight: SCREEN_HEIGHT * 0.6,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    minHeight: 200,
  },
  policyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  policyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
  },
  policyTitleContainer: {
    flex: 1,
    marginRight: 10,
  },
  policyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  policyDates: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  policyContent: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  policyDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginRight: 5,
  },
  value: {
    fontSize: 14,
    color: '#4E72E3',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  updatedAt: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 5,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
    textAlign: 'center',
  },
  noDataText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default PolicyModal; 