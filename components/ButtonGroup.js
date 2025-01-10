import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList  } from 'react-native';

const ButtonGroup = ({
    items = [],
    selectedIndex = 0,
    onChange = () => {},
    containerStyle = {},
    buttonStyle = {},
    activeButtonStyle = {},
    inactiveButtonStyle = {},
    textStyle = {},
    activeTextStyle = {},
    inactiveTextStyle = {},
    spacing = 8,
    borderRadius = 20,
  }) => {
    const [selected, setSelected] = useState(selectedIndex);
  
    const handlePress = (index) => {
      setSelected(index);
      onChange(index);
    };
  
    return (
        <FlatList
          data={items}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.container, containerStyle]}
          renderItem={({item, index}) => {
            const isSelected = selected === index;
            return (
              <TouchableOpacity
                onPress={() => handlePress(index)}
                style={[
                  styles.button,
                  {
                    borderRadius,
                    marginRight: index === items.length - 1 ? 0 : spacing,
                  },
                  buttonStyle,
                  isSelected ? activeButtonStyle : inactiveButtonStyle,
                ]}
              >
                <Text 
                  style={[
                    styles.text,
                    textStyle,
                    isSelected ? activeTextStyle : inactiveTextStyle
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      );
      
  };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 4,
    flexWrap: 'wrap',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: '#3B82F6',
    borderColor: 'transparent',
  },
  inactiveButton: {
    backgroundColor: 'white',
    borderColor: '#E5E7EB', 
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeText: {
    color: 'white',
  },
  inactiveText: {
    color: '#374151', 
  },
});

export default ButtonGroup;