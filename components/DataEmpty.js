import React from 'react';  
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: '#3A3A3AC4',   
    }
})
export default function DataEmpty({iconName, description}) {
    return (
        <View style={styles.container}>
            <Icon name={iconName} size={70} color="#3A3A3AC4" style={styles.icon} />
            <Text style={styles.description}>{description}</Text>
        </View>
    );
}