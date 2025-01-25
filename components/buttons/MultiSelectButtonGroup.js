import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MultiSelectButtonGroup = ({
    items = [],
    selectedIndexes = [], 
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
    const handlePress = (index) => {
        const newSelectedIndexes = selectedIndexes.includes(index)
            ? selectedIndexes.filter(selectedIndex => selectedIndex !== index)
            : [...selectedIndexes, index];
        
        onChange(newSelectedIndexes);
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {items.map((item, index) => {
                const isSelected = selectedIndexes.includes(index);
                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handlePress(index)}
                        style={[
                            styles.button,
                            {
                                borderRadius,
                                marginRight: index === items.length - 1 ? 0 : spacing,
                                marginTop: index >= 4 ? spacing : 16,
                            },
                            buttonStyle,
                            isSelected ? activeButtonStyle : inactiveButtonStyle,
                        ]}
                    >
                        <Text
                            style={[
                                styles.text,
                                textStyle,
                                isSelected ? activeTextStyle : inactiveTextStyle,
                            ]}
                        >
                            {item}
                        </Text>
                        {isSelected && (
                            <Text style={styles.closeButton}> x </Text>
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 4,
    },
    button: {
        minHeight: 40, 
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    text: {
        fontSize: 14,
        fontWeight: '500',
    },
    closeButton: {
        color: '#4D78FF',
        marginLeft: 8,
        fontSize: 14,
    },
});

export default MultiSelectButtonGroup;