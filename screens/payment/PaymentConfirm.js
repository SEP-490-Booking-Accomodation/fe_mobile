import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import CustomButton from '../../components/buttons/Button';
import { ArrowLeft } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

const PaymentConfirm = ({ route, navigation }) => {
  const { t } = useTranslation();
  const [selectedPayment, setSelectedPayment] = useState('mean');


  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.textHeader}>{t('confirm_payment')}</Text>
    </View>
  );

  const RadioButton = ({ value, label, sublabel }) => (
    <TouchableOpacity
      style={styles.paymentOption}
      onPress={() => setSelectedPayment(value)}
    >
      <View style={styles.paymentIcon}>
        <Text>{value === 'mean' ? '📷' : '↔️'}</Text>
      </View>
      <View style={styles.paymentText}>
        <Text style={styles.paymentTitle}>{t(label)}</Text>
        <Text style={styles.paymentSubtitle}>{t(sublabel)}</Text>
      </View>
      <View style={styles.radioOuter}>
        {selectedPayment === value && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {renderHeader()}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('payment_method')}</Text>
          <RadioButton 
            value="mean" 
            label="mean_wallet" 
            sublabel="mean_wallet_desc"
          />
          <RadioButton 
            value="bank" 
            label="bank_transfer" 
            sublabel="bank_transfer_desc"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('payment_details')}</Text>
          <View style={styles.detailRow}>
            <Text>{t('subtotal')}</Text>
            <Text>500.000đ</Text>
          </View>
          <View style={styles.detailRow}>
            <Text>VAT</Text>
            <Text>50.000đ</Text>
          </View>
        </View>

        <View style={styles.securityBox}>
          <Text style={styles.securityIcon}>🛡️</Text>
          <View>
            <Text style={styles.securityTitle}>{t('payment_guarantee')}</Text>
            <Text style={styles.securityText}>
              {t('payment_guarantee_desc')}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.totalSection}>
          {/* ... back button remains the same */}
          <View>
            <Text>{t('total')}</Text>
            <Text style={styles.totalAmount}>550.000đ</Text>
          </View>
        </View>
        <CustomButton 
          onPress={() => navigation.navigate('PaymentSuccess')}
          title={t('pay_now')} 
          style={{width: "45%"}}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.32,
    elevation: 5,
  },
  breakLine: {
    marginVertical: 10,
  },
  textHeader: {
    fontSize: 20,
    fontWeight: "bold",
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentText: {
    flex: 1,
    marginLeft: 12,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  paymentSubtitle: {
    color: '#666',
    fontSize: 14,
  },
  radioOuter: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  securityBox: {
    margin: 20,
    padding: 15,
    backgroundColor: '#e6f7e9',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  securityTitle: {
    color: '#4caf50',
    fontWeight: '600',
    marginBottom: 4,
  },
  securityText: {
    color: '#4caf50',
    fontSize: 14,
  },
  bottomBar: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  payButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  payButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
});

export default PaymentConfirm;