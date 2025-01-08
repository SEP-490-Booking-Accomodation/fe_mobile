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
import CustomButton from '../components/Button';
import CustomInput from '../components/TextInput';

const { height } = Dimensions.get('window');

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <ImageBackground
      source={require('../assets/images/bg_login.png')} 
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <View style={styles.contentContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Đăng nhập</Text>
              <Text style={styles.subtitle}>
                Bắt đầu hành trình của bạn: Đăng nhập để khám phá
              </Text>
            </View>
            <View style={styles.card}>
              <View style={styles.formContainer}>
                <View style={styles.dot} />
                <CustomInput
                  label="Email hoặc Số điện thoại"
                  placeholder="Nhập email hoặc số điện thoại"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={styles.input}
                />
                <CustomInput
                  label="Mật khẩu"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  containerStyle={styles.inputContainer}
                  inputContainerStyle={styles.input}
                  passwordIconColor="#6B7280"
                />
                <TouchableOpacity 
                  style={styles.forgotPasswordButton}
                  onPress={() => {}}
                >
                  <Text style={styles.forgotPasswordText}>
                    Quên Mật khẩu?
                  </Text>
                </TouchableOpacity>
                <CustomButton
                  title="Đăng nhập"
                  backgroundColor="#1A2741"
                  disabledBackgroundColor="rgba(26, 39, 65, 0.5)"
                  titleColor="#FFFFFF"
                  disabledTitleColor="#FFFFFF"
                  loading={loading}
                  disabled={!email || !password}
                  style={styles.loginButton}
                  onPress={handleLogin}
                />
                <View style={styles.signupContainer}>
                  <Text style={styles.signupText}>
                    Chưa có tài khoản?{' '}
                  </Text>
                  <TouchableOpacity onPress={() => {}}>
                    <Text style={styles.signupButtonText}>
                      Đăng ký ngay
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
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
    marginBottom: Platform.OS === 'ios' ? (height > 800 ? -50 : -40) : 0, 
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
