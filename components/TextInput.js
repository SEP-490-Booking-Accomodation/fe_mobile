import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomTextInput = ({ placeholder, iconLeft, iconRight, secureTextEntry, ...props }) => {
  return (
    <View style={styles.container}>
      {iconLeft && <Ionicons name={iconLeft} style={styles.icon} />}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        {...props}
      />
      {iconRight && <Ionicons name={iconRight} style={styles.icon} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  icon: {
    fontSize: 20,
    marginHorizontal: 5,
  },
});

export default CustomTextInput;
