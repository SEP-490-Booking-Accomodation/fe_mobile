import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MultipleButtonNoSelect = ({
    items = [],
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
    return (
        <View style={[styles.container, containerStyle]}>
            {items.map((item, index) => {
                return (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.button,
                            {
                                borderRadius,
                                marginRight: index === items.length - 1 ? 0 : spacing,
                                marginTop: index >= 4 ? spacing : 16,
                            },
                            buttonStyle,
                            activeButtonStyle,
                        ]}
                    >
                        <Text
                            style={[
                                styles.text,
                                textStyle,
                                activeTextStyle,
                            ]}
                        >
                            {item}
                        </Text>
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
        borderColor: 'transparent',
        backgroundColor: '#F2F4F7',
    },
    text: {
        fontSize: 14,
        fontWeight: '500',
    },
});

export default MultipleButtonNoSelect;
