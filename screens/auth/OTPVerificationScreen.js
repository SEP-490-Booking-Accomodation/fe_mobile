import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
    TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/buttons/Button';
import IconButton from '../../components/buttons/IconButton';

const { height } = Dimensions.get('window');

const LoginScreen = () => {
    const navigation = useNavigation();
    const [otp, setOtp] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    const handleLogin = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigation.replace('MainTabs');
        }, 1500);
    };

    const handleOtpChange = (text, index) => {
        let newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
        if (text && index < otp.length - 1) {
            inputRefs[index + 1].current.focus();
        }
    };

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
                        <IconButton
                            iconName="arrow-left" 
                            iconSize={24}
                            iconColor="#FFFFFF"
                            onPress={() => navigation.goBack()} 
                            buttonSize={50}
                            buttonColor="transparent"
                            borderColor="transparent"
                            style={styles.backButton}
                        />
                        <View style={styles.header}>
                            <Text style={styles.title}>Xác nhận mã OTP</Text>
                            <Text style={styles.subtitle}>
                                Đảm bảo hành trình của bạn: Xác nhận bằng mã OTP
                            </Text>
                        </View>
                        <View style={styles.card}>
                            <View style={styles.formContainer}>
                                <View style={styles.dot} />
                                <View style={styles.otpContainer}>
                                    {otp.map((digit, index) => (
                                        <TextInput
                                            key={index}
                                            value={digit}
                                            onChangeText={(text) => handleOtpChange(text, index)}
                                            maxLength={1}
                                            style={styles.otpInput}
                                            keyboardType="numeric"
                                            ref={inputRefs[index]} 
                                        />
                                    ))}
                                </View>

                                <CustomButton
                                    title="Xác nhận mã OTP"
                                    backgroundColor="#1A2741"
                                    disabledBackgroundColor="rgba(26, 39, 65, 0.5)"
                                    titleColor="#FFFFFF"
                                    disabledTitleColor="#FFFFFF"
                                    loading={loading}
                                    disabled={otp.some(digit => digit === '')}
                                    style={styles.loginButton}
                                    onPress={handleLogin}
                                />
                                <View style={styles.signupContainer}>
                                    <Text style={styles.signupText}>
                                        Chưa nhận được ?{' '}
                                    </Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('')}>
                                        <Text style={styles.signupButtonText}>
                                            Gửi lại
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
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
        justifyContent: 'space-between',
    },
    backButton: {
        position: 'absolute',
        top: 60, 
        left: 20,
        zIndex: 1, 
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 150,
        marginTop: 100
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
    },
    formContainer: {
        paddingHorizontal: 24,
        paddingBottom: Platform.OS === 'ios' ? 50 : 24,
    },
    dot: {
        width: 48,
        height: 6,
        borderRadius: 4,
        backgroundColor: '#EBEBEB',
        alignSelf: 'center',
        marginBottom: 24,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 24,
    },
    otpInput: {
        width: 48,
        height: 48,
        borderWidth: 1,
        borderColor: '#F7F7F7',
        borderRadius: 30,
        textAlign: 'center',
        fontSize: 18,
        backgroundColor: '#F7F7F7',
    },
    forgotPasswordButton: {
        alignSelf: 'flex-end',
        marginTop: -8,
        marginBottom: 32,
    },
    forgotPasswordText: {
        color: '#4E72E3',
        fontSize: 14,
        fontWeight: '500',
    },
    loginButton: {
        marginBottom: 24,
    },
    signupContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    signupText: {
        color: '#94A3B8',
        fontSize: 14,
    },
    signupButtonText: {
        color: '#4E72E3',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default LoginScreen;
