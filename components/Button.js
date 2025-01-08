import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

const CustomButton = ({
  title,
  titleStyle,
  disabledTitleStyle,
  style,
  disabledStyle,
  backgroundColor = '#1E293B',
  disabledBackgroundColor = '#E5E7EB',
  titleColor = '#FFFFFF',
  disabledTitleColor = '#9CA3AF',
  disabled = false,
  loading = false,
  onPress,
  activeOpacity = 0.8,
  loadingColor,
  variant = 'filled',
  size = 'medium',
  ...props
}) => {
  const variants = {
    filled: {
      backgroundColor,
      borderWidth: 0,
    },
    outlined: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: backgroundColor,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
  };
  const sizes = {
    small: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      minHeight: 32,
    },
    medium: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      minHeight: 48,
    },
    large: {
      paddingVertical: 16,
      paddingHorizontal: 24,
      minHeight: 56,
    },
  };

  const getTextColor = () => {
    if (disabled) return disabledTitleColor;
    if (variant === 'filled') return titleColor;
    return backgroundColor;
  };

  const getBackgroundColor = () => {
    if (disabled) return disabledBackgroundColor;
    return variants[variant].backgroundColor;
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variants[variant],
        sizes[size],
        { backgroundColor: getBackgroundColor() },
        style,
        disabled && [
          styles.disabled,
          disabledStyle,
        ],
      ]}
      disabled={disabled || loading}
      onPress={onPress}
      activeOpacity={activeOpacity}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={loadingColor || getTextColor()}
          size="small"
        />
      ) : (
        <Text
          style={[
            styles.text,
            { color: getTextColor() },
            size === 'small' && { fontSize: 14 },
            size === 'large' && { fontSize: 18 },
            titleStyle,
            disabled && disabledTitleStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  disabled: {
    opacity: 1, 
  },
});

export default CustomButton;