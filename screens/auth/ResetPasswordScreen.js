import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableOpacity,
    ImageBackground,
    Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/buttons/Button';
import CustomInput from '../../components/TextInput';
import IconButton from '../../components/buttons/IconButton';

const { height } = Dimensions.get('window');

const ResetPasswordScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResetPassword = () => {
        if (password !== confirmPassword) {
            alert("Mật khẩu không khớp!");
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigation.replace('MainTabs');
        }, 1500);
    };

    const isFormValid = password === confirmPassword && password !== '' && confirmPassword !== '';

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
                            <Text style={styles.title}>Đặt lại mật khẩu</Text>
                            <Text style={styles.subtitle}>
                                Renew hành trình của bạn: Đặt lại mật khẩu
                            </Text>
                        </View>
                        <View style={styles.card}>
                            <View style={styles.formContainer}>
                                <View style={styles.dot} />
                                <CustomInput
                                    label="Mật khẩu mới"
                                    placeholder="*************"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    containerStyle={styles.inputContainer}
                                    inputContainerStyle={styles.input}
                                    passwordIconColor="#6B7280"
                                />
                                <CustomInput
                                    label="Xác nhận mật khẩu mới"
                                    placeholder="*************"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                    containerStyle={styles.inputContainer}
                                    inputContainerStyle={styles.input}
                                    passwordIconColor="#6B7280"
                                />
                                <CustomButton
                                    title="Đặt lại mật khẩu"
                                    backgroundColor="#1A2741"
                                    disabledBackgroundColor="rgba(26, 39, 65, 0.5)"
                                    titleColor="#FFFFFF"
                                    disabledTitleColor="#FFFFFF"
                                    loading={loading}
                                    disabled={!isFormValid}
                                    style={styles.loginButton}
                                    onPress={handleResetPassword}
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
    inputContainer: {
        marginBottom: 24,
    },
    input: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
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

export default ResetPasswordScreen;
