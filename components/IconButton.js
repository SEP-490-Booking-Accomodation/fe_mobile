import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';

const IconButton = ({
  iconName,
  iconSize = 24,
  iconColor = '#FFFFFF',
  onPress = () => {},
  buttonSize = 50,
  borderRadius = 10,
  buttonColor = '#4E72E3',
  borderWidth = 0, 
  borderColor = 'transparent',
  shadow = false,
  library = 'Feather',
  style, 
}) => {
  const renderIcon = () => {
    switch (library) {
      case 'Feather':
        return <Feather name={iconName} size={iconSize} color={iconColor} />;
      case 'FontAwesome':
        return <FontAwesome name={iconName} size={iconSize} color={iconColor} />;
      case 'MaterialIcons':
        return <MaterialIcons name={iconName} size={iconSize} color={iconColor} />;
      case 'Ionicons':
        return <Ionicons name={iconName} size={iconSize} color={iconColor} />;
      default:
        return <Feather name={iconName} size={iconSize} color={iconColor} />;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {
          width: buttonSize,
          height: buttonSize,
          borderRadius: borderRadius,
          backgroundColor: buttonColor,
          borderWidth: borderWidth, 
          borderColor: borderColor, 
          ...(shadow && styles.shadow),
        },
        style, 
      ]}
    >
      {renderIcon()}
    </TouchableOpacity>
  );
};



const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default IconButton;
