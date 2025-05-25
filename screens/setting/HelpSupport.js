import { View, Text, ScrollView, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';

export default function HelpSupport() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const openFAQ = () => {
    Linking.openURL('https://help.mean.com/faq');
  };

  const openVideoGuide = () => {
    Linking.openURL('https://help.mean.com/videos');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <AntDesign name="left" size={24} color="#4E72E3" onPress={() => navigation.goBack()} />
        <Text style={styles.header}>{t('help_support')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Getting Started Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <MaterialIcons name="rocket-launch" size={24} color="#4E72E3" />
            </View>
            <Text style={styles.sectionTitle}>{t('getting_started')}</Text>
          </View>
          
          <View style={styles.stepsCard}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{t('search_location')}</Text>
                <Text style={styles.stepDescription}>{t('step_search')}</Text>
              </View>
            </View>

            <View style={styles.stepConnector} />

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{t('filter_results')}</Text>
                <Text style={styles.stepDescription}>{t('step_filter')}</Text>
              </View>
            </View>

            <View style={styles.stepConnector} />

            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{t('book_enjoy')}</Text>
                <Text style={styles.stepDescription}>{t('step_book')}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Troubleshooting Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <MaterialIcons name="build" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.sectionTitle}>{t('troubleshooting')}</Text>
          </View>
          
          <View style={styles.troubleshootingCard}>
            <View style={styles.issueItem}>
              <View style={styles.issueIconContainer}>
                <MaterialIcons name="error-outline" size={20} color="#EF4444" />
              </View>
              <View style={styles.issueContent}>
                <Text style={styles.issueTitle}>{t('app_crashes')}</Text>
                <Text style={styles.issueDescription}>{t('problem_app_crash')}</Text>
              </View>
              <AntDesign name="right" size={16} color="#94A3B8" />
            </View>

            <View style={styles.issueDivider} />

            <View style={styles.issueItem}>
              <View style={styles.issueIconContainer}>
                <MaterialIcons name="payment" size={20} color="#F59E0B" />
              </View>
              <View style={styles.issueContent}>
                <Text style={styles.issueTitle}>{t('payment_issues')}</Text>
                <Text style={styles.issueDescription}>{t('problem_payment_fail')}</Text>
              </View>
              <AntDesign name="right" size={16} color="#94A3B8" />
            </View>

            <View style={styles.issueDivider} />

            <View style={styles.issueItem}>
              <View style={styles.issueIconContainer}>
                <MaterialIcons name="location-off" size={20} color="#8B5CF6" />
              </View>
              <View style={styles.issueContent}>
                <Text style={styles.issueTitle}>{t('location_problems')}</Text>
                <Text style={styles.issueDescription}>{t('problem_location')}</Text>
              </View>
              <AntDesign name="right" size={16} color="#94A3B8" />
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

  // Section Styles
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },

  // Steps Card Styles
  stepsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4E72E3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
    paddingBottom: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  stepConnector: {
    width: 2,
    height: 20,
    backgroundColor: '#E2E8F0',
    marginLeft: 15,
    marginVertical: 8,
  },

  // Troubleshooting Card Styles
  troubleshootingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  issueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  issueIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  issueContent: {
    flex: 1,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  issueDescription: {
    fontSize: 14,
    color: '#64748B',
  },
  issueDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 16,
  },
});