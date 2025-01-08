import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

const CustomInput = ({
  value,
  onChangeText,
  placeholder,
  containerStyle,
  inputStyle,
  inputContainerStyle,
  label,
  labelStyle,
  leftIcon,
  rightIcon,
  iconSize = 20,
  iconColor = "#6B7280",
  secureTextEntry,
  passwordIconColor = "#4E72E3",
  error,
  errorStyle,
  errorTextStyle,
  ...rest
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const hasLeftIcon = !!leftIcon;
  const hasRightIcon = !!rightIcon || secureTextEntry;

  const renderPasswordIcon = () => {
    if (!secureTextEntry) return null;
    
    return (
      <View style={styles.rightIconContainer}>
        <TouchableOpacity
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          {isPasswordVisible ? (
            <EyeOff size={iconSize} color={passwordIconColor} />
          ) : (
            <Eye size={iconSize} color={passwordIconColor} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderRightIcon = () => {
    if (!rightIcon) return null;

    return (
      <View style={styles.rightIconContainer}>
        {React.cloneElement(rightIcon, {
          size: iconSize,
          color: iconColor,
        })}
      </View>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        error && styles.inputContainerError,
        inputContainerStyle,
      ]}>
        {hasLeftIcon && (
          <View style={styles.leftIconContainer}>
            {React.cloneElement(leftIcon, {
              size: iconSize,
              color: iconColor,
            })}
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            hasLeftIcon && styles.inputWithLeftIcon,
            hasRightIcon && styles.inputWithRightIcon,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...rest}
        />
        
        {secureTextEntry ? renderPasswordIcon() : renderRightIcon()}
      </View>
      
      {error && (
        <View style={[styles.errorContainer, errorStyle]}>
          <Text style={[styles.errorText, errorTextStyle]}>
            {error}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.2,
    borderColor: '#F7F7F7',
    borderRadius: 20,
    backgroundColor: '#F7F7F7',
    minHeight: 48,
    position: 'relative',
  },
  inputContainerError: {
    borderColor: '#EF4444',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWithLeftIcon: {
    paddingLeft: 44,
  },
  inputWithRightIcon: {
    paddingRight: 44,
  },
  leftIconContainer: {
    paddingLeft: 12,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconContainer: {
    paddingRight: 12,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
  },
  errorContainer: {
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
  },
});

export default CustomInput;