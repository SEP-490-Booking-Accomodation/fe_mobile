import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const Tag = ({ text, backgroundColor = '#E0E0E0', textColor = '#000' }) => {
  return (
    <View style={[styles.tag, { backgroundColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tag: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Tag;
