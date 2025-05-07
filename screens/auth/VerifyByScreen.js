import React, { useState } from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/buttons/Button';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import IconButton from '../../components/buttons/IconButton';
import { useTranslation } from 'react-i18next'; 

const { height } = Dimensions.get('window');

const VerifyByScreen = () => {
    const { t } = useTranslation(); 
    const navigation = useNavigation();
    const [selectedMethod, setSelectedMethod] = useState('phone');

    return (
        <ImageBackground
            source={require('../../assets/images/bg_login.png')}
            style={styles.backgroundImage}
        >
            <View style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoid}
                >
                    <View style={styles.contentContainer}>
                        <View style={styles.header}>
                            <Text style={styles.title}>{t("verify_account_title")}</Text>
                            <Text style={styles.subtitle}>
                                {t("verify_account_subtitle")}
                            </Text>
                        </View>
                        <View style={styles.card}>
                            <View style={styles.dot} />
                            <TouchableOpacity
                                style={[styles.option, selectedMethod === 'phone' && styles.selectedOption]}
                                onPress={() => setSelectedMethod('phone')}
                            >
                                <Ionicons name="call" size={20} color="#34D399" style={styles.icon} />
                                <Text style={styles.optionText}>
                                    {t("phone_option", { number: "********678" })}
                                </Text>
                                <Ionicons
                                    name={selectedMethod === 'phone' ? 'radio-button-on' : 'radio-button-off'}
                                    size={20}
                                    color={selectedMethod === 'phone' ? '#4E72E3' : '#A0AEC0'}
                                    style={styles.radioIcon}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.option, selectedMethod === 'email' && styles.selectedOption]}
                                onPress={() => setSelectedMethod('email')}
                            >
                                <MaterialIcons name="email" size={20} color="#3B82F6" style={styles.icon} />
                                <Text style={styles.optionText}>
                                    {t("email_option", { email: "user@gmail.com" })}
                                </Text>
                                <Ionicons
                                    name={selectedMethod === 'email' ? 'radio-button-on' : 'radio-button-off'}
                                    size={20}
                                    color={selectedMethod === 'email' ? '#4E72E3' : '#A0AEC0'}
                                    style={styles.radioIcon}
                                />
                            </TouchableOpacity>
                            <View style={styles.row}>
                                <IconButton
                                    iconName="arrow-back-outline"
                                    library="Ionicons"
                                    iconSize={18}
                                    buttonSize={40}
                                    iconColor="#4E72E3"
                                    borderRadius={20}
                                    borderWidth={1}
                                    borderColor="#4E72E3"
                                    onPress={() => navigation.goBack()}
                                    style={styles.backIcon}
                                />
                                <CustomButton
                                    title={t("verify_button")}
                                    backgroundColor="#1A2741"
                                    titleColor="#FFFFFF"
                                    style={styles.verifyButton}
                                    onPress={() => navigation.navigate('OTPVerification')}
                                />
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    safeArea: {
        flex: 1,
    },
    keyboardAvoid: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 150,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#EFF6FF',
        lineHeight: 24,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 32,
        paddingBottom: 40,
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    dot: {
        width: 48,
        height: 6,
        borderRadius: 4,
        backgroundColor: '#EBEBEB',
        marginBottom: 24,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 15,
        marginBottom: 16,
    },
    selectedOption: {
        borderColor: '#C1D0FF',
        backgroundColor: 'rgba(174, 187, 230, 0.2)',
    },
    icon: {
        marginRight: 12,
    },
    optionText: {
        fontSize: 16,
        color: '#1A2741',
        flex: 1,
    },
    radioIcon: {
        marginLeft: 'auto',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    backIcon: {
        marginRight: 20,
        backgroundColor: '#fff',
        borderColor: '#4E72E3',
    },
    verifyButton: {
        flex: 1,
    },
});

export default VerifyByScreen;
