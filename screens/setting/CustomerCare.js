import { View, Text, ScrollView, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, MaterialIcons, Feather } from '@expo/vector-icons';

export default function CustomerCare() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleContact = (method) => {
    switch(method) {
      case 'phone':
        Linking.openURL('tel:0903312258');
        break;
      case 'email':
        Linking.openURL('mailto:nhiphm302@gmail.com');
        break;
      case 'chat':
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <AntDesign name="left" size={24} color="#4E72E3" onPress={() => navigation.goBack()} />
        <Text style={styles.header}>{t('customer_care')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Emergency Support Card */}
        <View style={styles.emergencyCard}>
          <View style={styles.emergencyHeader}>
            <View style={styles.emergencyIconContainer}>
              <MaterialIcons name="emergency" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.emergencyTextContainer}>
              <Text style={styles.emergencyTitle}>{t('emergency_support')}</Text>
              <Text style={styles.emergencySubtitle}>{t('available_24_7')}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.phoneButton} onPress={() => handleContact('phone')}>
            <Feather name="phone" size={20} color="#FFFFFF" />
            <Text style={styles.phoneText}>0903312258</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📩 {t('contact_methods')}</Text>
          
          <TouchableOpacity style={styles.contactCard} onPress={() => handleContact('email')}>
            <View style={styles.contactIconContainer}>
              <MaterialIcons name="email" size={24} color="#4E72E3" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>{t('email_support')}</Text>
              <Text style={styles.contactValue}>nhiphm302@gmail.com</Text>
            </View>
            <AntDesign name="right" size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Common Issues */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>❓ {t('common_issues')}</Text>
          <View style={styles.issuesCard}>
            <View style={styles.issueItem}>
              <View style={styles.issueDot} />
              <Text style={styles.issueText}>{t('issue_booking')}</Text>
            </View>
            <View style={styles.issueItem}>
              <View style={styles.issueDot} />
              <Text style={styles.issueText}>{t('issue_payment')}</Text>
            </View>
            <View style={styles.issueItem}>
              <View style={styles.issueDot} />
              <Text style={styles.issueText}>{t('issue_location')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  
  // Emergency Card Styles
  emergencyCard: {
    backgroundColor: '#DC2626',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#DC2626',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  emergencyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  emergencyTextContainer: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  emergencySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: 'center',
  },
  phoneText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },

  // Section Styles
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },

  // Contact Card Styles
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  contactIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    color: '#64748B',
  },

  // Issues Card Styles
  issuesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  issueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  issueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4E72E3',
    marginRight: 12,
  },
  issueText: {
    fontSize: 15,
    color: '#475569',
    flex: 1,
  },
});